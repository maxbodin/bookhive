/**
 * Helper to generate a CSS-safe view transition name from an email.
 */
export const getSafeTransitionNameFromEmail = ( email: string ) => email.replace( /[^a-zA-Z0-9]/g, "-" );