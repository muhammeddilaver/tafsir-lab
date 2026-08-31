/**
 * Embeds JSON-LD in the page. Escaping `<` is required: a "</script>"
 * sequence inside the content could close the tag early.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
