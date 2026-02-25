"use client";

import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Profile } from "@/app/types/profile";
import { updateUsername } from "@/app/actions/profiles/updateUsername";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";

interface EditableUsernameProps {
  profile: Profile;
  isOwner: boolean;
  displayUsername: string;
}

/**
 *
 * @param profile
 * @param isOwner
 * @param displayUsername
 * @constructor
 */
export function EditableUsername( { profile, isOwner, displayUsername }: EditableUsernameProps ) {
  const t = useTranslations( "EditableUsername" );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>( false );
  const [isSubmitting, setIsSubmitting] = useState<boolean>( false );

  const handleSubmit = async ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    setIsSubmitting( true );

    const formData = new FormData( event.currentTarget );
    const result = await updateUsername( formData );

    if (result.success) {
      toast.success( result.message );
      setIsDialogOpen( false );
    } else {
      toast.error( result.message );
    }
    setIsSubmitting( false );
  };

  const UsernameElement = <h1 className="text-3xl font-bold">{ displayUsername }</h1>;

  if (!isOwner) {
    return UsernameElement;
  }

  return (
    <Dialog open={ isDialogOpen } onOpenChange={ setIsDialogOpen }>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 rounded transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          { UsernameElement }
          <Pencil className="w-5 h-5 text-muted-foreground"/>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmit }>
          <DialogHeader>
            <DialogTitle>{ t( "title" ) }</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              { t( "description" ) }
            </p>
            <Input
              id="username"
              name="username"
              defaultValue={ profile.username ?? "" }
              placeholder={ t( "placeholder" ) }
              required
              maxLength={ 30 }
            />
            <input type="hidden" name="userEmail" value={ profile.email }/>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                { t( "cancel" ) }
              </Button>
            </DialogClose>
            <Button type="submit" disabled={ isSubmitting }>
              { isSubmitting ? <Spinner/> : t( "save" ) }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}