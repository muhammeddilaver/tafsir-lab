import RootsView from "@/components/RootsView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.tr.rootsTitle,
  description:
    "Tefsir boyunca çözümlenen Arapça kökler. Her kök, işlendiği ayet bölümüne bağlanır.",
  alternates: {
    canonical: ROUTES.tr.roots,
    ...alternates({ tr: ROUTES.tr.roots, en: ROUTES.en.roots }),
  },
};

export default function KokPage() {
  return (
    <>
      <RootsView lang="tr" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.tr.navHome, url: ROUTES.tr.home },
          { name: T.tr.rootsTitle, url: ROUTES.tr.roots },
        ])}
      />
    </>
  );
}
