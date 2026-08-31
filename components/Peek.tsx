"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ROUTES, T, type Lang } from "@/lib/i18n";

type Parca = { no: number; name: string; label: string; url: string; html: string };
type Ref = { no: number; start: number };

const cache = new Map<string, Parca>();

export default function Peek({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [stack, setStack] = useState<Ref[]>([]);
  const [data, setData] = useState<Parca | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const pushed = useRef(false);      // history kaydini biz mi biraktik
  const opener = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const open = stack.length > 0;
  const top = stack[stack.length - 1];

  const close = useCallback(() => {
    setStack([]);
    setData(null);
    if (pushed.current) {
      pushed.current = false;
      history.back();
    }
    opener.current?.focus();
  }, []);

  // --- link clicks: only a plain left click opens the modal ---
  useEffect(() => {
    function onClick(ev: MouseEvent) {
      if (ev.defaultPrevented || ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return; // yeni sekme vb. bozulmasin
      const a = (ev.target as HTMLElement)?.closest<HTMLAnchorElement>("a[data-p]");
      if (!a) return;
      const [no, start] = (a.dataset.p ?? "").split("/").map(Number);
      if (!no || !start) return;
      ev.preventDefault();
      if (!open) {
        opener.current = a;
        history.pushState({ peek: true }, "");
        pushed.current = true;
        setStack([{ no, start }]);
      } else {
        setStack((s) => [...s, { no, start }]); // modal icinden atif: yigina ekle
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // --- the back button should close the modal ---
  useEffect(() => {
    if (!open) return;
    function onPop() {
      pushed.current = false;
      setStack([]);
      setData(null);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  // --- fetch the fragment ---
  useEffect(() => {
    if (!top) return;
    const key = `${lang}:${top.no}/${top.start}`;
    const hit = cache.get(key);
    if (hit) {
      setData(hit);
      return;
    }
    let alive = true;
    setLoading(true);
    fetch(`${ROUTES[lang].part}/${top.no}/${top.start}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: Parca) => {
        cache.set(key, j);
        if (alive) setData(j);
      })
      .catch(() => alive && setData(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [top, lang]);

  // scroll the content back to the top on a new fragment
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [data]);

  // --- Esc, focus trap, background lock ---
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    box.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !box.current) return;
      const f = box.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  const trail = stack.slice(0, -1);

  return (
    <div className="peek-wrap" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        className="peek"
        role="dialog"
        aria-modal="true"
        aria-label={data ? `${data.name} ${data.label}` : t.peekFallbackTitle}
        tabIndex={-1}
        ref={box}
      >
        <header className="peek-head">
          {stack.length > 1 && (
            <button className="peek-back" onClick={() => setStack((s) => s.slice(0, -1))} aria-label={t.peekBack}>
              ←
            </button>
          )}
          <div className="peek-title">
            {trail.length > 0 && (
              <span className="peek-trail">
                {trail.map((t) => `${t.no}/${t.start}`).join(" › ")} ›{" "}
              </span>
            )}
            <strong>{data ? `${data.name} ${data.label}` : loading ? "…" : t.peekNotFound}</strong>
          </div>
          <button className="peek-x" onClick={close} aria-label={t.peekClose}>
            ✕
          </button>
        </header>

        <div className="peek-body" ref={bodyRef}>
          {data ? (
            <article dangerouslySetInnerHTML={{ __html: data.html }} />
          ) : loading ? (
            <p className="muted">{t.peekLoading}</p>
          ) : (
            <p className="muted">{t.peekFailed}</p>
          )}
        </div>

        {data && (
          <footer className="peek-foot">
            <button
              onClick={async () => {
                const url = location.origin + data.url;
                const mobil = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
                try {
                  if (mobil && navigator.share) {
                    await navigator.share({ title: `${data.name} ${data.label}`, url });
                    return;
                  }
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                } catch {}
              }}
            >
              {copied ? t.linkCopied : t.peekShare}
            </button>
            <a href={data.url}>{t.peekOpen}</a>
          </footer>
        )}
      </div>
    </div>
  );
}
