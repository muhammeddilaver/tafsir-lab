import { Amiri, IBM_Plex_Sans, Literata, Petrona } from "next/font/google";

// The fonts are downloaded at build time and served from our own origin.
// Before, all four arrived through a single render-blocking stylesheet from
// fonts.googleapis.com: two extra origins to connect to (preconnect + DNS +
// TLS), and no text could paint until that CSS had loaded. Served from our
// own origin the files come down over the same connection as the HTML.
//
// latin-ext is required: Turkish ı ğ ş İ and the ā ī ū of the English text
// are not in the basic latin subset.

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif",
});

const petrona = Petrona({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

// 500 appeared in no rule; 400 and 600 are enough.
// preload is off: Plex is only used for small type — the top bar, meta lines
// and the index — never the LCP element. Preloaded files compete with the
// HTML and CSS for bandwidth; body (Literata) and headings (Petrona) come
// first.
const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
  variable: "--font-sans",
});

// Arabic is only used at 400 (none of the four rules asks for bold).
// preload is off: Amiri's arabic subset is ~100 KB, and the home page, the
// root index and the static pages contain no Arabic at all — preloading it
// everywhere is wasted bandwidth. The @font-face unicode-range is still
// there, so it downloads by itself on a page that has Arabic.
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  variable: "--font-arabic",
});

/** Applied to the <html> tag of both root layouts; declares the variables. */
export const fontVars = [literata, petrona, plex, amiri].map((f) => f.variable).join(" ");
