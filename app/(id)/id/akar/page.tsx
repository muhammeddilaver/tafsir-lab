import RootsView from "@/components/RootsView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates, everywhere } from "@/lib/meta";

export const metadata = {
  title: T.id.rootsTitle,
  description:
    "Akar kata Arab yang dibahas di sepanjang tafsir. Setiap akar tertaut ke bagian ayat tempat ia dibahas.",
  alternates: {
    canonical: ROUTES.id.roots,
    ...alternates(everywhere((r) => r.roots)),
  },
};

export default function AkarPage() {
  return (
    <>
      <RootsView lang="id" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.id.navHome, url: ROUTES.id.home },
          { name: T.id.rootsTitle, url: ROUTES.id.roots },
        ])}
      />
    </>
  );
}
