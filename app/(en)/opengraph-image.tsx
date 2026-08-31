import { ogAlt, ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt("en");

export default function Image() {
  return ogImage("en");
}
