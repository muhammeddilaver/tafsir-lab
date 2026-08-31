import RootsView from "@/components/RootsView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.en.rootsTitle,
  description:
    "The Arabic roots analysed across the commentary. Each root links to the section where it is treated.",
  alternates: {
    canonical: ROUTES.en.roots,
    ...alternates({ tr: ROUTES.tr.roots, en: ROUTES.en.roots }),
  },
};

export default function RootsPage() {
  return (
    <>
      <RootsView lang="en" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.en.navHome, url: ROUTES.en.home },
          { name: T.en.rootsTitle, url: ROUTES.en.roots },
        ])}
      />
    </>
  );
}
