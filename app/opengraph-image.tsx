import { ImageResponse } from "next/og";

export const alt = "SellCalc — fee calculators for online sellers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f1e7", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, color: "#1d1b16", fontWeight: 700 }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "#1f5f4a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>%</div>
            SellCalc
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.1, color: "#1d1b16", fontWeight: 700 }}>Know what you keep</div>
            <div style={{ fontSize: 76, lineHeight: 1.1, color: "#1f5f4a", fontWeight: 700 }}>before you list.</div>
          </div>
          <div style={{ fontSize: 30, color: "#4a463d" }}>Etsy · eBay US · eBay UK · every fee line, sourced and dated</div>
        </div>
      </div>
    ),
    size,
  );
}
