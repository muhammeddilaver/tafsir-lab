import MethodView from "@/components/MethodView";
import { ROUTES, T } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: T.en.methodTitle,
  alternates: {
    canonical: ROUTES.en.method,
    ...alternates({ tr: ROUTES.tr.method, en: ROUTES.en.method }),
  },
};

export default function MethodPage() {
  return <MethodView lang="en" />;
}
