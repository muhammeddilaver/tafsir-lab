import RootsView from "@/components/RootsView";
import { ROUTES, T } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.en.rootsTitle,
  alternates: {
    canonical: ROUTES.en.roots,
    ...alternates({ tr: ROUTES.tr.roots, en: ROUTES.en.roots }),
  },
};

export default function RootsPage() {
  return <RootsView lang="en" />;
}
