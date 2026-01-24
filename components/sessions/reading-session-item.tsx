"use client";
import { Book, Calendar, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ReadingSessionWithBook } from "@/app/types/reading-session";
import { calculateSessionDuration } from "@/app/utils/reading-sessions/calculateSessionDuration";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useState, useTransition } from "react";
import { deleteReadingSession } from "@/app/actions/reading-sessions/deleteReadingSession";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface ReadingSessionItemProps {
  session: ReadingSessionWithBook;
  isOwner: boolean;
}

const formatSessionDate = ( startTime: string ) => {
  const date = new Date( startTime );
  return format( date, "MMMM d, yyyy 'at' h:mm a" );
};

const REVEAL_WIDTH = 90; // The width of the revealed delete button in pixels.
const DRAG_THRESHOLD = 60; // How far the user must drag to snap it open.

export function ReadingSessionItem( { session, isOwner }: ReadingSessionItemProps ) {
  const t = useTranslations( "ReadingSessions" );
  const tDialog = useTranslations("ReadingSessions.deleteDialog");

  const [isPending, startTransition] = useTransition();
  const [isRevealed, setIsRevealed] = useState<boolean>( false );
  const [isDeleting, setIsDeleting] = useState<boolean>( false );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const x = useMotionValue( 0 );
  const backgroundOpacity = useTransform(x, [0, REVEAL_WIDTH], [0.5, 1]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > DRAG_THRESHOLD) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      setIsDeleting(true);
      const result = await deleteReadingSession(session.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setIsDeleting(false);
      }
      setIsDialogOpen(false);
      setIsRevealed(false);
    });
  };

  const handleContentClick = () => {
    if (isRevealed) {
      setIsRevealed(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsRevealed(false);
    }
  };

  const startPage = session.start_page ?? 0;
  const endPage = session.end_page;
  const pagesRead = endPage - startPage;
  const totalPages = session.book?.pages ?? 0;

  const { hours, minutes } = calculateSessionDuration( session.start_time, session.end_time );
  const hasDuration = hours > 0 || minutes > 0;

  // Calculate completion percentage after this session, preventing division by zero.
  const completionPercentage = totalPages > 0
    ? Math.round( ( endPage / totalPages ) * 100 )
    : 0;

  const sessionContent = (
      <div className={ cn(!isRevealed ? "rounded-lg " : "rounded-r-lg", "flex w-full gap-4  border bg-card p-4 text-card-foreground shadow-sm")}>
        <div className="w-16 flex-shrink-0">
          { session.book?.cover_url ? (
            <img src={ session.book?.cover_url } alt={ `Cover of ${ session.book?.title }` }
                 className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"/>
          ) : (
            <div
              className="w-full flex items-center justify-center rounded-t-lg aspect-[2/3] bg-gray-100 dark:bg-secondary">
              <p className="text-primary text-sm">{ t( "noCover" ) }</p>
            </div>
          ) }
        </div>

        <div className="flex-grow flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <h3 className="font-semibold leading-tight mb-2" title={ session.book?.title }>
                  { session.book?.title ?? t( "unknownBook" ) }
                </h3>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                  <Calendar className="h-3.5 w-3.5"/>
                  <span>{ formatSessionDate( session.start_time ) }</span>
                </div>
              </div>
              { totalPages > 0 && (
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-xl text-primary">{ completionPercentage }%</p>
                </div>
              ) }
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Book className="h-3.5 w-3.5"/>
                <span>
                  { t( "pagesRead", { count: pagesRead } ) }
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({ t( "pageRange", { start: startPage, end: endPage } ) })
                <p className="text-right text-xs text-muted-foreground mt-1">
                  { t( "totalPages", { count: totalPages } ) }
                </p>
              </span>
            </div>

            { hasDuration && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Clock className="h-3.5 w-3.5"/>
                <span>
                { hours > 0 && t( "sessionDurationHours", { count: hours } ) }
                  { hours > 0 && minutes > 0 && " " }
                  { minutes > 0 && t( "sessionDurationMinutes", { count: minutes } ) }
              </span>
              </div>
            ) }
          </div>

          { session.notes && (
            <div className="mt-3 border-t pt-3">
              <p className="whitespace-pre-wrap text-sm text-foreground">{ session.notes }</p>
            </div>
          ) }
        </div>
      </div>
    )
  ;

  // If the user is not the owner, render a simple, non-interactive item.
  if (!isOwner) {
    return sessionContent;
  }

  // If the user is the owner, wrap the content with sliding functionality for deletion.
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <AnimatePresence>
        {!isDeleting && (
          <div className="relative w-full overflow-hidden rounded-lg">
            <AlertDialogTrigger asChild>
              <motion.div
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-destructive text-destructive-foreground"
                style={ { width: REVEAL_WIDTH, opacity: backgroundOpacity } }
                aria-label={ t( "deleteActionLabel" ) }
                role="button"
                aria-hidden={ !isRevealed }
              >
                <Trash2 className="h-6 w-6"/>
              </motion.div>
            </AlertDialogTrigger>
            <motion.div
              drag="x"
              dragConstraints={ { left: 0, right: REVEAL_WIDTH } }
              dragElastic={ 0.2 }
              onDragEnd={ handleDragEnd }
              animate={ { x: isRevealed ? REVEAL_WIDTH : 0 } }
              transition={{ type: "spring", stiffness: 1000, damping: 100 }}
              style={ { x } }
              className="relative z-10 cursor-grab active:cursor-grabbing"
              onClick={ handleContentClick }
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
            >
              { sessionContent }
            </motion.div>
          </div>
        ) }
      </AnimatePresence>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tDialog("title")}</AlertDialogTitle>
          <AlertDialogDescription>{tDialog("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tDialog("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-foreground"
          >
            {isPending && <Spinner className="mr-2" />}
            {tDialog("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}