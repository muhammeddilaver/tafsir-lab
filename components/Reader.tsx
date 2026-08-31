"use client";

import { useEffect, useRef, useState } from "react";
import { NS, T, type Lang } from "@/lib/i18n";

type Props = { no: number; name: string; ayahCount: number; lang: Lang };

// Reading position is kept per language: the same sura is a separate page in each.
const POS = (lang: Lang, no: number) => `${NS[lang]}pos:${no}`;
const LAST = (lang: Lang) => `${NS[lang]}last`;

function save(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}
// Instant in-page jump. On long pages scroll-behavior:smooth tries to animate
// across 100,000 pixels; the jump on load has to be instant.
function jump(el: Element) {
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: Math.max(0, y), behavior: "instant" as ScrollBehavior });
}

function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export default function Reader({ no, name, ayahCount, lang }: Props) {
  const t = T[lang];
  const [toast, setToast] = useState<{ msg: string; undo?: () => void } | null>(null);
  const cur = useRef<{ id: string; ayah: string } | null>(null);
  const timer = useRef<number | null>(null);
  // Telling "dropping by" from "reading": if the position were written the
  // moment the page opens, someone who glanced at a citation and left would
  // lose their place. The position is only written once reading has actually
  // begun.
  const engaged = useRef(false);
  const landed = useRef<string | null>(null);

  // --- track and store the position ---
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-blk]"));
    if (!blocks.length) return;

    // Work out once which verse section each block belongs to: the observer
    // only reports the block coming into view, so rather than searching
    // backwards for the preceding verse heading we map it up front.
    const ayahOf = new Map<string, string>();
    let carry = "";
    for (const b of blocks) {
      if (b.dataset.ayah) carry = b.dataset.ayah;
      ayahOf.set(b.dataset.blk!, carry);
    }

    // Staying 25 seconds also counts as reading (for those who start at the top)
    const dwell = window.setTimeout(() => {
      engaged.current = true;
      schedule();
    }, 25000);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = (e.target as HTMLElement).dataset.blk!;
          const ayah = ayahOf.get(id) ?? "";
          cur.current = { id, ayah };
          if (landed.current === null) landed.current = ayah;
          // Moving from the section they landed on to another means reading
          else if (ayah && ayah !== landed.current) engaged.current = true;
        }
        schedule();
      },
      { rootMargin: "-72px 0px -80% 0px", threshold: 0 }
    );
    blocks.forEach((b) => io.observe(b));

    function persist() {
      if (!cur.current || !engaged.current) return;
      const rec = { ...cur.current, no, name, ts: Date.now(), scroll: Math.round(window.scrollY) };
      save(POS(lang, no), rec);
      save(LAST(lang), rec);
    }
    function schedule() {
      if (timer.current) return;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        persist();
      }, 700);
    }
    const onLeave = () => persist();
    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener("pagehide", onLeave);

    return () => {
      window.clearTimeout(dwell);
      io.disconnect();
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener("pagehide", onLeave);
      if (timer.current) window.clearTimeout(timer.current);
      persist();
    };
  }, [no, name, lang]);

  // --- on load: go to the hash if there is one, otherwise to where they left off ---
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        const blk = el.closest<HTMLElement>(".blk") ?? el;
        jump(blk);
        // Next can restore the scroll position after navigation: retry a frame later.
        requestAnimationFrame(() => jump(blk));
        blk.classList.add("hit");
        window.setTimeout(() => blk.classList.remove("hit"), 2600);
      }
      return;
    }
    const saved = load<{ id: string; ayah?: string }>(POS(lang, no));
    if (!saved?.id) return;
    const el = document.getElementById(saved.id);
    if (!el) return;
    jump(el);
    requestAnimationFrame(() => jump(el));
    setToast({
      msg: saved.ayah ? t.resumedAt(saved.ayah) : t.resumed,
      undo: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    });
    window.setTimeout(() => setToast(null), 6000);
  }, [no, lang, t]);

  // --- line link: copy / share ---
  useEffect(() => {
    async function onClick(ev: MouseEvent) {
      const a = (ev.target as HTMLElement)?.closest<HTMLAnchorElement>("a.anchor");
      if (!a) return;
      ev.preventDefault();
      const id = a.dataset.anchor!;
      const url = `${location.origin}${location.pathname}#${id}`;
      history.replaceState(null, "", `#${id}`);
      const blk = a.closest<HTMLElement>(".blk");
      blk?.classList.add("hit");
      window.setTimeout(() => blk?.classList.remove("hit"), 2600);

      const mobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
      try {
        if (mobile && navigator.share) {
          await navigator.share({ title: `${name} ${blk?.dataset.ayah ?? ""}`.trim(), url });
          return;
        }
        await navigator.clipboard.writeText(url);
        setToast({ msg: t.linkCopied });
      } catch {
        setToast({ msg: url });
      }
      window.setTimeout(() => setToast(null), 3000);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [name, t]);

  // --- reading progress bar ---
  useEffect(() => {
    const bar = document.getElementById("progress");
    if (!bar) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span>{toast.msg}</span>
      {toast.undo && (
        <button onClick={() => { toast.undo!(); setToast(null); }}>{t.backToTop}</button>
      )}
    </div>
  );
}
