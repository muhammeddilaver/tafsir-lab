import MethodView from "@/components/MethodView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates, everywhere } from "@/lib/meta";

export const metadata = {
  title: T.id.methodTitle,
  description:
    "Aturan metode dan gaya yang mengikat seluruh teks: periwayatan, perbedaan pendapat, hukum, dan bacaan penulis sendiri.",
  alternates: {
    canonical: ROUTES.id.method,
    ...alternates(everywhere((r) => r.method)),
  },
};

export default function MetodePage() {
  return (
    <>
      <MethodView lang="id" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.id.navHome, url: ROUTES.id.home },
          { name: T.id.methodTitle, url: ROUTES.id.method },
        ])}
      />
    </>
  );
}
