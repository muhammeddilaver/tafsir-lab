#!/usr/bin/env python3
"""Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver).

Google does not take part in IndexNow; for Google the sitemap plus Search
Console is the route. This speeds up the other engines, which matters for a
new site whose 6,000+ pages would otherwise be discovered slowly.

Usage:  python3 indexnow.py                 # submit every URL in the sitemap
        python3 indexnow.py --dry-run       # show what would be sent
        python3 indexnow.py /sure/2 /en     # submit only these paths

Run it AFTER a deploy: the key file and the pages have to be live, or the
submission is rejected.
"""
import glob, json, os, re, sys, urllib.request, urllib.error

HOST = os.environ.get("INDEXNOW_HOST", "tafsirlab.com")
ENDPOINT = "https://api.indexnow.org/indexnow"
BATCH = 10_000            # IndexNow accepts at most 10,000 URLs per request
ROOT = os.path.dirname(os.path.abspath(__file__))


def find_key():
    """The key is the name of the file in public/ that holds it."""
    hits = [f for f in glob.glob(os.path.join(ROOT, "public", "*.txt"))
            if re.fullmatch(r"[0-9a-f]{8,128}", os.path.basename(f)[:-4])]
    if len(hits) != 1:
        sys.exit(f"expected exactly one IndexNow key file in public/, found {len(hits)}")
    key = os.path.basename(hits[0])[:-4]
    if open(hits[0], encoding="utf-8").read().strip() != key:
        sys.exit(f"{hits[0]} must contain exactly the key {key}")
    return key


def get(url):
    req = urllib.request.Request(url, headers={"user-agent": "indexnow-submit"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")


def sitemap_urls():
    status, body = get(f"https://{HOST}/sitemap.xml")
    if status != 200:
        sys.exit(f"sitemap.xml returned {status}")
    # Only <loc>, not the hreflang <xhtml:link href="...">: those are the same
    # pages under their other language and are already listed in their own right.
    return re.findall(r"<loc>([^<]+)</loc>", body)


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry = "--dry-run" in sys.argv
    key = find_key()

    # The key file has to be reachable before anything is submitted.
    try:
        status, body = get(f"https://{HOST}/{key}.txt")
    except urllib.error.URLError as e:
        sys.exit(f"could not reach https://{HOST}/{key}.txt — {e}")
    if status != 200 or body.strip() != key:
        sys.exit(f"https://{HOST}/{key}.txt did not return the key (status {status})")
    print(f"key file verified: https://{HOST}/{key}.txt")

    urls = [f"https://{HOST}{a}" if a.startswith("/") else a for a in args] or sitemap_urls()
    print(f"{len(urls)} URLs to submit for {HOST}")
    if dry:
        for u in urls[:5]:
            print("  ", u)
        print(f"   … ({len(urls)} total)  — dry run, nothing sent")
        return

    for i in range(0, len(urls), BATCH):
        chunk = urls[i:i + BATCH]
        payload = json.dumps({
            "host": HOST,
            "key": key,
            "keyLocation": f"https://{HOST}/{key}.txt",
            "urlList": chunk,
        }).encode()
        req = urllib.request.Request(
            ENDPOINT, data=payload,
            headers={"content-type": "application/json; charset=utf-8"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                print(f"  batch {i // BATCH + 1}: {len(chunk)} URLs -> HTTP {r.status}")
        except urllib.error.HTTPError as e:
            # 422 usually means the key or host does not match; 403 an invalid key.
            sys.exit(f"  batch {i // BATCH + 1} rejected: HTTP {e.code} {e.read().decode('utf-8','replace')[:200]}")


if __name__ == "__main__":
    main()
