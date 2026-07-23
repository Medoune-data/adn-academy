import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D9622B",
          borderRadius: 7,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: -0.5,
          color: "#FBF6EE",
        }}
      >
        ADN
      </div>
    ),
    { ...size }
  );
}
