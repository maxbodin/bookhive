import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type BookForOgImage = {
  title?: string | null;
  authors?: string[] | string | null;
  cover_url?: string | null;
};

const FALLBACK_TITLE = "Book";
const FALLBACK_AUTHOR = "Unknown author";
const FALLBACK_COVER_ALT = "Book cover";

function toAuthorLabel( authors: BookForOgImage["authors"] ): string {
  if ( Array.isArray( authors ) ) {
    const cleaned = authors.filter( ( author ) => Boolean( author ) );
    return cleaned.length > 0 ? cleaned.join( ", " ) : FALLBACK_AUTHOR;
  }

  if ( typeof authors === "string" && authors.trim().length > 0 ) {
    return authors;
  }

  return FALLBACK_AUTHOR;
}

/**
 * Lightweight read for OG rendering.
 * Avoids importing server actions/i18n in Edge bundle.
 */
async function getBookForOgImage( id: number ): Promise<BookForOgImage | null> {
  if ( !Number.isFinite( id ) ) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if ( !supabaseUrl || !supabaseAnonKey ) {
    return null;
  }

  const query = new URLSearchParams( {
    select: "title,authors,cover_url",
    id: `eq.${ id }`,
    limit: "1",
  } );

  const response = await fetch( `${ supabaseUrl }/rest/v1/books?${ query.toString() }`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${ supabaseAnonKey }`,
    },
    next: { revalidate: 3600 },
  } );

  if ( !response.ok ) {
    return null;
  }

  const rows = ( await response.json() ) as BookForOgImage[];
  return rows[0] ?? null;
}

export default async function Image( { params }: { params: Promise<{ id: string }> } ) {
  const resolvedParams = await params;
  const book = await getBookForOgImage( Number( resolvedParams.id ) );

  const title = book?.title || FALLBACK_TITLE;
  const author = toAuthorLabel( book?.authors );

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
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
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
              { `By ${ author }` }
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
              alt={ FALLBACK_COVER_ALT }
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
    }
  );
}