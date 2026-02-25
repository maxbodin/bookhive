"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { createBook } from "@/app/actions/books/createBook";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface CreateBookDialogProps {
  initialTitle?: string;
}

export function CreateBookDialog( { initialTitle = "" }: CreateBookDialogProps ) {
  const t = useTranslations( "BookDetails" ); // TODO : Add dedicated translations.
  const tTypes = useTranslations( "BookTypes" );
  const [isOpen, setIsOpen] = useState<boolean>( false );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    const formData = new FormData( e.currentTarget );

    startTransition( async () => {
      const result = await createBook( formData );
      if (result.success) {
        toast.success( result.message );
        setIsOpen( false );
      } else {
        toast.error( result.message );
      }
    } );
  };

  return (
    <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
      <DialogTrigger asChild>
        <Button className="w-full shadow-lg gap-2 hover:scale-105 transition-transform">
          <Plus className="h-4 w-4"/>
          Create "{ initialTitle }" manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={ handleSubmit }>
          <DialogHeader>
            <DialogTitle>Create New Book</DialogTitle>
            <DialogDescription>
              Add a new book to the database manually.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title*</Label>
              <Input id="title" name="title" defaultValue={ initialTitle } required/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="authors">Authors* (comma separated)</Label>
                <Input id="authors" name="authors" placeholder="e.g. J.K. Rowling, Tolkien" required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type*</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bd">{ tTypes( "bd" ) }</SelectItem>
                    <SelectItem value="manga">{ tTypes( "manga" ) }</SelectItem>
                    <SelectItem value="roman">{ tTypes( "roman" ) }</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea id="description" name="description" rows={ 3 } required/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publisher">Publisher*</Label>
                <Input id="publisher" name="publisher" required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publication_date">Publication Date</Label>
                <Input id="publication_date" name="publication_date" type="date"/>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="isbn_10">ISBN 10</Label>
                <Input id="isbn_10" name="isbn_10" maxLength={ 10 }/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn_13">ISBN 13</Label>
                <Input id="isbn_13" name="isbn_13" maxLength={ 13 }/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pages">Pages*</Label>
                <Input id="pages" name="pages" type="number" min="0" required/>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover_url">Cover URL</Label>
              <Input id="cover_url" name="cover_url" placeholder="https://..." type="url"/>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border grid grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="height" className="text-xs">Height (cm)</Label>
                <Input id="height" name="height" type="number" step="0.1" className="h-8"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="length" className="text-xs">Length (cm)</Label>
                <Input id="length" name="length" type="number" step="0.1" className="h-8"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="width" className="text-xs">Width (cm)</Label>
                <Input id="width" name="width" type="number" step="0.1" className="h-8"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight" className="text-xs">Weight (g)</Label>
                <Input id="weight" name="weight" type="number" className="h-8"/>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={ () => setIsOpen( false ) } disabled={ isPending }>
              Cancel
            </Button>
            <Button type="submit" disabled={ isPending }>
              { isPending && <Spinner className="mr-2 h-4 w-4"/> }
              Create Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}