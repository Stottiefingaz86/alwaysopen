import { ImageResponse } from "next/og";

export const alt = "RingsAway, 24/7 AI receptionist and customer feedback reports";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #f0f6ff 0%, #ffffff 45%, #e8f4ec 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 36,
            fontWeight: 600,
            color: "#5f6368",
          }}
        >
          <span>Rings</span>
          <span style={{ color: "#3b7fd4" }}>Away</span>
          <span style={{ color: "#3b7fd4" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.15,
              color: "#202124",
              maxWidth: 900,
            }}
          >
            Your phone line, answered 24/7
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#5f6368",
              maxWidth: 820,
            }}
          >
            AI receptionist on your business number · monthly customer feedback
            reports · Google Business guidance
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#3b7fd4", fontWeight: 500 }}>
          ringsaway.com
        </div>
      </div>
    ),
    { ...size }
  );
}
