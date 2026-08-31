import MethodView from "@/components/MethodView";
import JsonLd from "@/components/JsonLd";
import { ROUTES, T } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/jsonld";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.en.methodTitle,
  description:
    "The rules that bind the whole text: transmission, disagreement, legal rulings and the text's own readings.",
  alternates: {
    canonical: ROUTES.en.method,
    ...alternates({ tr: ROUTES.tr.method, en: ROUTES.en.method }),
  },
};

export default function MethodPage() {
  return (
    <>
      <MethodView lang="en" />
      <JsonLd
        data={breadcrumbLd([
          { name: T.en.navHome, url: ROUTES.en.home },
          { name: T.en.methodTitle, url: ROUTES.en.method },
        ])}
      />
    </>
  );
}
