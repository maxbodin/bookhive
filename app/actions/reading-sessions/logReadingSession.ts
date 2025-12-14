"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionState } from "@/app/types/action-state";
import { ReadingSession } from "@/app/types/reading-session";
import { getTranslations } from "next-intl/server";

/**
 * Logs a reading session for the authenticated user.
 * @param formData - The form data from the client.
 */
export async function logReadingSession( formData: FormData ): Promise<ActionState> {
  const t = await getTranslations( "LogReadingSessionAction" );

  const readingSessionSchema = z.object( {
    bookId: z.coerce.number().int().positive( t( "errors.bookId" ) ),
    startTime: z.iso.datetime( t( "errors.startTimeInvalid" ) ),
    endTime: z.iso.datetime( t( "errors.endTimeInvalid" ) ),
    startPage: z.coerce.number().int().min( 0, t( "errors.startPageNegative" ) ),
    endPage: z.coerce.number().int().positive( t( "errors.endPagePositive" ) ),
    notes: z.string().max( 1000, t( "errors.notesTooLong" ) ).optional(),
  } ).refine( data => new Date( data.startTime ) < new Date( data.endTime ), {
    message: t( "errors.startTimeBeforeEndTime" ),
    path: ["startTime"],
  } );

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: t( "errors.authRequired" ) };
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
    return { success: false, message: t( "errors.logFailed" ) };
  }

  revalidatePath( "/" );

  return { success: true, message: t( "success.logSuccess" ) };
}