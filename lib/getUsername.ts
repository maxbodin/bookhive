/**
 * Formats an email address into a displayable username.
 * @param email - The user's email address.
 * @returns A formatted username or the guest fallback.
 */
export function getUsername( email?: string | null ): string {
  if (!email) {
    return "Guest"; // Fallback if user or email is undefined.
  }

  return email
    .split( "@" )[0] // Get the part before the '@'.
    .replace( ".", " " ) // Replace '.' with spaces.
    .split( " " ) // Split by spaces.
    .map( ( part ) => part.charAt( 0 ).toUpperCase() + part.slice( 1 ).toLowerCase() ) // Capitalize each part.
    .join( " " ); // Rejoin into a single string.
}