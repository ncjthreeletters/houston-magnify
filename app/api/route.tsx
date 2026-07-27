import { ImageResponse } from "next/og"

export const runtime = "edge"

const HEADER_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MagShirt%20copy-yGAzUJKZ2VNUBvTydVP7m5B2JuzxmG.png"
const LOGO_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Magnify_New%20Logo.png%20White%20Magnify_New%20Logo-JniqYxnF1wa3FqP3NDjw2zYKoLOi8V.png"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
      }}
    >
      {/* Main headline image */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <img
          src={HEADER_IMAGE}
          alt="LET HOUSTON SEE HEAVEN"
          width="700"
          height="180"
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      {/* Call to action */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#007AFF",
          color: "#ffffff",
          padding: "16px 32px",
          borderRadius: "24px",
          fontSize: "28px",
          fontWeight: 600,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {"TEXT 'JOIN' TO 832-895-2125"}
      </div>

      {/* Magnify logo at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={LOGO_IMAGE}
          alt="Magnify"
          width="100"
          height="50"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
