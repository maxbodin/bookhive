"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionState } from "@/app/types/action-state";
import { ReadingSession } from "@/app/types/reading-session";

const readingSessionSchema = z.object( {
  bookId: z.coerce.number().int().positive( "Book ID must be a positive number." ),
  startTime: z.iso.datetime( "Please provide a valid start date and time." ),
  endTime: z.iso.datetime( "Please provide a valid end date and time." ),
  startPage: z.coerce.number().int().min( 0, "Start page cannot be negative." ),
  endPage: z.coerce.number().int().positive( "End page must be a positive number." ),
  notes: z.string().max( 1000, "Notes must be 1000 characters or less." ).optional(),
} ).refine( data => new Date( data.startTime ) < new Date( data.endTime ), {
  message: "Start time must be before end time.",
  path: ["startTime"],
} );

/**
 * Logs a reading session for the authenticated user.
 * @param formData - The form data from the client.
 */
export async function logReadingSession( formData: FormData ): Promise<ActionState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "Authentication required. Please log in." };
  }

  const validatedFields = readingSessionSchema.safeParse( {
    bookId: formData.get( "bookId" ),
    startTime: formData.get( "startTime" ),
    endTime: formData.get( "endTime" ),
    startPage: formData.get( "startPage" ),
    endPage: formData.get( "endPage" ),
    notes: formData.get( "notes" ),
  } );

  if (!validatedFields.success) {
    const firstError = validatedFields.error;
    return {
      success: false,
      message: firstError.message || "Invalid input. Please check the form.",
    };
  }

  const { bookId, startTime, endTime, startPage, endPage, notes } = validatedFields.data;
  const dataToInsert: Partial<ReadingSession> = {
    uid: user.id,
    book_id: bookId,
    start_time: startTime,
    end_time: endTime,
    start_page: startPage,
    end_page: endPage,
    notes: notes,
  };

  const { error } = await supabase.from( "reading_sessions" ).insert( dataToInsert );

  if (error) {
    console.error( "Supabase insert error:", error.message );
    return { success: false, message: "Failed to log session. Please try again later." };
  }

  revalidatePath( "/" );

  return { success: true, message: "Reading session logged successfully!" };
}