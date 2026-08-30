import RootsView from "@/components/RootsView";
import { ROUTES, T } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.tr.rootsTitle,
  alternates: {
    canonical: ROUTES.tr.roots,
    ...alternates({ tr: ROUTES.tr.roots, en: ROUTES.en.roots }),
  },
};

export default function KokPage() {
  return <RootsView lang="tr" />;
}
