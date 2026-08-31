import MethodView from "@/components/MethodView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.tr.methodTitle,
  description:
    "Metnin tamamında bağlayıcı olan usul ve üslup kuralları: nakil, ihtilaf, hüküm ve kendi okuması.",
  alternates: {
    canonical: ROUTES.tr.method,
    ...alternates({ tr: ROUTES.tr.method, en: ROUTES.en.method }),
  },
};

export default function UsulPage() {
  return (
    <>
      <MethodView lang="tr" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.tr.navHome, url: ROUTES.tr.home },
          { name: T.tr.methodTitle, url: ROUTES.tr.method },
        ])}
      />
    </>
  );
}
