import { ImageResponse } from "next/og";
import { getBookById } from "@/app/actions/books/getBookById";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Helper to fetch fonts from the /public directory.
 * @param url
 */
async function getFontData( url: string | URL ) {
  const response = await fetch( url );
  return response.arrayBuffer();
}

export default async function Image( { params }: { params: Promise<{ id: string }> } ) {
  const resolvedParams = await params;
  const book = await getBookById( Number( resolvedParams.id ) );

  // Fetch fonts in parallel for performance.
  const [geistRegular, geistBold] = await Promise.all( [
    getFontData( new URL( "../../../public/fonts/Geist-Regular.otf", import.meta.url ) ),
    getFontData( new URL( "../../../public/fonts/Geist-Bold.otf", import.meta.url ) ),
  ] );

  const title = book?.title || "Discover a Book on BookHive";
  const author = book?.authors?.join( ", " ) || "an esteemed author";

  return new ImageResponse(
    (
      <div
        style={ {
          display: "flex",
          background: "linear-gradient(to bottom right, rgba(12, 10, 9, 1) 50%, rgba(250, 204, 21, 1) 100%)",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "\"Geist Sans\"",
          color: "#fafafa",
        } }
      >
        <div
          style={ {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "60%",
            height: "100%",
          } }
        >
          <div style={ { display: "flex", flexDirection: "column" } }>
            <div
              style={ {
                display: "flex",
                fontSize: 28,
                fontWeight: 400,
                color: "#a8a29e",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 24,
              } }
            >
              BookHive
            </div>
            <div
              style={ {
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1.1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              } }
            >
              { title }
            </div>
            <div
              style={ {
                display: "flex",
                fontSize: 36,
                fontWeight: 400,
                color: "#a8a29e",
                marginTop: 24,
              } }
            >
              By { author }
            </div>
          </div>
          <div
            style={ {
              display: "flex",
              fontSize: 32,
              fontWeight: 600,
              color: "#facc15",
            } }
          >
            bookhive.maximebodin.com
          </div>
        </div>

        <div
          style={ {
            display: "flex",
            width: "320px",
            height: "480px",
            borderRadius: "16px",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `inset 0 0 0 2px #27272a, 0 25px 50px -12px rgba(0,0,0,0.75)`,
          } }
        >
          { book?.cover_url ? (
            <img
              src={ book.cover_url }
              alt="Book Cover"
              style={ { width: "100%", height: "100%", objectFit: "cover" } }
            />
          ) : (
            <div
              style={ {
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#27272a",
                color: "#a8a29e",
                fontSize: 64,
                fontWeight: 800,
              } }
            >
              BH
            </div>
          ) }
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist Sans",
          data: geistRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Geist Sans",
          data: geistBold,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}