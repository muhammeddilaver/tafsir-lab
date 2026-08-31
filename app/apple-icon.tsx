import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The same mark as icon.svg; Apple touch icons do not accept SVG. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F4E85",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
          <g fill="none" stroke="#EFF1EF" strokeWidth="2.1" strokeLinejoin="round">
            <rect x="9.2" y="9.2" width="13.6" height="13.6" />
            <rect x="9.2" y="9.2" width="13.6" height="13.6" transform="rotate(45 16 16)" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
