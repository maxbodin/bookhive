/**
 * Formats an email address into a displayable username, or returns the custom username.
 * @param email - The user's email address.
 * @param customUsername - The user's custom username from DB.
 * @returns A formatted username or the guest fallback.
 */
export function getUsername( email?: string | null, customUsername?: string | null ): string {
  if (customUsername && customUsername.trim() !== "") {
    return customUsername.trim();
  }

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