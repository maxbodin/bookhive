"use client";

import React, { useState, useTransition, ViewTransition } from "react";
import { Book } from "@/app/types/book";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BookDetailItem from "@/components/book/book-detail-item";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Pencil, X } from "lucide-react";
import { updateBook } from "@/app/actions/books/updateBook";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface EditableBookDetailsProps {
  book: Book;
  isAdmin: boolean;
  transitionRef: string;
}

export function EditableBookDetails( { book, isAdmin, transitionRef }: EditableBookDetailsProps ) {
  const t = useTranslations( "BookDetails" );
  const tBookTypes = useTranslations( "BookTypes" );

  const [isEditing, setIsEditing] = useState<boolean>( false );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    const formData = new FormData( e.currentTarget );

    startTransition( async () => {
      const result = await updateBook( book.id, formData );
      if (result.success) {
        toast.success( result.message );
        setIsEditing( false );
      } else {
        toast.error( result.message );
      }
    } );
  };

  const undefinedFallback = t( "undefined" );

  if (isEditing) {
    return (
      <form onSubmit={ handleSubmit } className="flex flex-col gap-6 animate-in fade-in">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{ t( "edit.title" ) }</Label>
              <Input id="title" name="title" defaultValue={ book.title ?? "" } required/>
            </div>
            <div>
              <Label htmlFor="cover_url">{ t( "edit.coverUrl" ) }</Label>
              <Input id="cover_url" name="cover_url" defaultValue={ book.cover_url ?? "" }/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authors">{ t( "edit.authors" ) }</Label>
              <Input id="authors" name="authors" defaultValue={ book.authors?.join( ", " ) ?? "" }/>
            </div>
            <div>
              <Label htmlFor="type">{ t( "edit.type" ) }</Label>
              <Select name="type" defaultValue={ book.type ?? "" }>
                <SelectTrigger>
                  <SelectValue placeholder={ t( "edit.selectType" ) }/>
                </SelectTrigger>
                <SelectContent>
                  {/* TODO : Use book type. */ }
                  <SelectItem value="bd">{ tBookTypes( "bd" ) }</SelectItem>
                  <SelectItem value="manga">{ tBookTypes( "manga" ) }</SelectItem>
                  <SelectItem value="roman">{ tBookTypes( "roman" ) }</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">{ t( "edit.description" ) }</Label>
            <Textarea id="description" name="description" defaultValue={ book.description ?? "" } rows={ 15 }/>
          </div>
        </div>

        <Separator/>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="publisher">{ t( "edit.publisher" ) }</Label>
            <Input id="publisher" name="publisher" defaultValue={ book.publisher ?? "" }/>
          </div>
          <div>
            <Label htmlFor="publication_date">{ t( "edit.publicationDate" ) }</Label>
            <Input id="publication_date" name="publication_date" defaultValue={ book.publication_date ?? "" }/>
          </div>
          <div>
            <Label htmlFor="pages">{ t( "edit.pages" ) }</Label>
            <Input id="pages" name="pages" type="number" defaultValue={ book.pages ?? "" }/>
          </div>
          <div>
            <Label htmlFor="isbn_10">{ t( "edit.isbn10" ) }</Label>
            <Input id="isbn_10" name="isbn_10" defaultValue={ book.isbn_10 ?? "" }/>
          </div>
          <div>
            <Label htmlFor="isbn_13">{ t( "edit.isbn13" ) }</Label>
            <Input id="isbn_13" name="isbn_13" defaultValue={ book.isbn_13 ?? "" }/>
          </div>
          <div>
            <Label htmlFor="categories">{ t( "edit.categories" ) }</Label>
            <Input id="categories" name="categories" defaultValue={ book.categories?.join( ", " ) ?? "" }/>
          </div>

          <div
            className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 p-4 rounded-lg border">
            <div>
              <Label htmlFor="height">{ t( "edit.height" ) }</Label>
              <Input id="height" name="height" type="number" step="0.1" defaultValue={ book.height ?? "" }/>
            </div>
            <div>
              <Label htmlFor="length">{ t( "edit.length" ) }</Label>
              <Input id="length" name="length" type="number" step="0.1" defaultValue={ book.length ?? "" }/>
            </div>
            <div>
              <Label htmlFor="width">{ t( "edit.width" ) }</Label>
              <Input id="width" name="width" type="number" step="0.1" defaultValue={ book.width ?? "" }/>
            </div>
            <div>
              <Label htmlFor="weight">{ t( "edit.weight" ) }</Label>
              <Input id="weight" name="weight" type="number" defaultValue={ book.weight ?? "" }/>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Button type="button" variant="outline" onClick={ () => setIsEditing( false ) } disabled={ isPending }>
            <X className="w-4 h-4 mr-2"/> { t( "edit.discard" ) }
          </Button>
          <Button type="submit" disabled={ isPending }>
            { isPending ? <Spinner className="w-4 h-4 mr-2"/> : <Check className="w-4 h-4 mr-2"/> }
            { t( "edit.save" ) }
          </Button>
        </div>
      </form>
    );
  }

  // View Mode.
  return (
    <ViewTransition>
      <div className="animate-in fade-in flex flex-col gap-4">
        <div className="md:col-span-2">
          <ViewTransition name={ `book-title-${ book.id }-${ transitionRef }` }>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl"
                title={ book.title ?? undefinedFallback }>
              { book.title ?? undefinedFallback }
            </h1>
          </ViewTransition>

          <p className="mt-2 text-xl text-muted-foreground">
            { book.authors && book.authors.length > 0
              ? `${ t( "by" ) } ${ book.authors.join( ", " ) }`
              : undefinedFallback }
          </p>

          { book.type && (
            <Badge variant="secondary" className="mt-4">
              { tBookTypes( book.type ) }
            </Badge>
          ) }

          <Separator className="my-6"/>

          <div className="max-w-none">
            <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "edit.description" ) }</h2>
            <p className="whitespace-pre-line">{ book.description ?? undefinedFallback }</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "detailsTitle" ) }</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
              <BookDetailItem label={ t( "edit.publisher" ) } value={ book.publisher }
                              fallbackText={ undefinedFallback }/>
              <BookDetailItem label={ t( "edit.publicationDate" ) } value={ book.publication_date }
                              fallbackText={ undefinedFallback }/>
              <BookDetailItem label={ t( "edit.pages" ) } value={ book.pages } fallbackText={ undefinedFallback }/>
              <BookDetailItem label={ t( "edit.isbn10" ) } value={ book.isbn_10 } fallbackText={ undefinedFallback }/>
              <BookDetailItem label={ t( "edit.isbn13" ) } value={ book.isbn_13 } fallbackText={ undefinedFallback }/>
              <BookDetailItem
                label={ t( "dimensions" ) }
                value={ book.height && book.length && book.width && `${ book.height } x ${ book.length } x ${ book.width } cm` }
                fallbackText={ undefinedFallback }
              />
              <BookDetailItem label={ t( "edit.weight" ) } value={ book.weight && `${ book.weight } g` }
                              fallbackText={ undefinedFallback }/>
              <BookDetailItem label={ t( "edit.categories" ) }
                              value={ book.categories && `${ book.categories.join( ", " ) }` }
                              fallbackText={ undefinedFallback }/>
            </dl>
          </div>
        </div>
        <div className="w-full">
          { isAdmin && (
            <Button
              variant="outline"
              onClick={ () => setIsEditing( true ) }
              className="max-w-sm w-fit"
            >
              <Pencil className="w-4 h-4 mr-2"/> { t( "edit.editButton" ) }
            </Button>
          ) }
        </div>
      </div>
    </ViewTransition>
  );
}