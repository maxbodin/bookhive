"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { User } from "@supabase/supabase-js";
import { updateProfilePicture } from "@/app/[email]/actions";

interface UserAvatarProps {
  profile: {
    id: string;
    email: string;
    picture?: string | null;
  };
  currentUser: User | null;
}

export function UserAvatar( { profile, currentUser }: UserAvatarProps ) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>( false );
  const [isSubmitting, setIsSubmitting] = useState<boolean>( false );
  const isOwner = currentUser?.id === profile.id;

  const getInitials = ( email: string ) => email.charAt( 0 ).toUpperCase();

  const handleSubmit = async ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    setIsSubmitting( true );

    const formData = new FormData( event.currentTarget );
    const result = await updateProfilePicture( formData );

    if (result.success) {
      toast.success( result.message );
      setIsDialogOpen( false );
    } else {
      toast.error( result.message );
    }
    setIsSubmitting( false );
  };

  const avatar = (
    <Avatar className="h-24 w-24 md:h-32 md:w-32 text-4xl">
      <AvatarImage src={ profile.picture ?? undefined } alt={ profile.email }/>
      <AvatarFallback>{ getInitials( profile.email ) }</AvatarFallback>
    </Avatar>
  );

  if (!isOwner) {
    return avatar;
  }

  return (
    <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
      <DialogTrigger asChild>
        <button className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          { avatar }
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmit }>
          <DialogHeader>
            <DialogTitle>Edit profile picture</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter a new URL for your profile picture.
            </p>
            <Input
              id="pictureUrl"
              name="pictureUrl"
              defaultValue={ profile.picture ?? "" }
              placeholder="https://example.com/image.png"
              required
            />
            {/* Hidden input to pass the email to the server action for revalidation. */}
            <input type="hidden" name="userEmail" value={ profile.email }/>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={ isSubmitting }>
              { isSubmitting ? <Spinner/> : "Save" }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}