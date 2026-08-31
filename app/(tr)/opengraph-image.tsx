import { ogAlt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt("tr");

export default function Image() {
  return ogImage("tr");
}
