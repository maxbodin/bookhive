"use client";

import React, { useState, useTransition } from "react";
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
}

export function EditableBookDetails( { book, isAdmin }: EditableBookDetailsProps ) {
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
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={ book.title ?? "" } required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authors">Authors (comma-separated)</Label>
              <Input id="authors" name="authors" defaultValue={ book.authors?.join( ", " ) ?? "" }/>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={ book.type ?? "" }>
                <SelectTrigger>
                  <SelectValue placeholder="Select type"/>
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={ book.description ?? "" } rows={ 20 }/>
          </div>
        </div>

        <Separator/>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label htmlFor="publisher">Publisher</Label><Input id="publisher" name="publisher"
                                                                  defaultValue={ book.publisher ?? "" }/></div>
          <div><Label htmlFor="publication_date">Publication Date</Label><Input id="publication_date"
                                                                                name="publication_date"
                                                                                defaultValue={ book.publication_date ?? "" }/>
          </div>
          <div><Label htmlFor="pages">Pages</Label><Input id="pages" name="pages" type="number"
                                                          defaultValue={ book.pages ?? "" }/></div>
          <div><Label htmlFor="isbn_10">ISBN 10</Label><Input id="isbn_10" name="isbn_10"
                                                              defaultValue={ book.isbn_10 ?? "" }/></div>
          <div><Label htmlFor="isbn_13">ISBN 13</Label><Input id="isbn_13" name="isbn_13"
                                                              defaultValue={ book.isbn_13 ?? "" }/></div>
          <div><Label htmlFor="categories">Categories (comma-separated)</Label><Input id="categories" name="categories"
                                                                                      defaultValue={ book.categories?.join( ", " ) ?? "" }/>
          </div>

          <div className="col-span-full grid grid-cols-4 gap-4 mt-2 p-4 bg-secondary/10 rounded-lg border">
            <div><Label htmlFor="height">Height (cm)</Label><Input id="height" name="height" type="number" step="0.1"
                                                                   defaultValue={ book.height ?? "" }/></div>
            <div><Label htmlFor="length">Length (cm)</Label><Input id="length" name="length" type="number" step="0.1"
                                                                   defaultValue={ book.length ?? "" }/></div>
            <div><Label htmlFor="width">Width (cm)</Label><Input id="width" name="width" type="number" step="0.1"
                                                                 defaultValue={ book.width ?? "" }/></div>
            <div><Label htmlFor="weight">Weight (g)</Label><Input id="weight" name="weight" type="number"
                                                                  defaultValue={ book.weight ?? "" }/></div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
            <Button type="button" variant="outline" onClick={ () => setIsEditing( false ) } disabled={ isPending }>
              <X className="w-4 h-4 mr-2"/> Discard
            </Button>
            <Button type="submit" disabled={ isPending }>
              { isPending ? <Spinner className="w-4 h-4 mr-2"/> : <Check className="w-4 h-4 mr-2"/> }
              Save Changes
            </Button>
        </div>
      </form>
    );
  }

  // View Mode.
  return (
    <div className="animate-in fade-in flex flex-col gap-4">
      <div className="md:col-span-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl"
            title={ book.title ?? undefinedFallback }>
          { book.title ?? undefinedFallback }
        </h1>

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
        <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "descriptionTitle" ) }</h2>
        <p className="whitespace-pre-line">{ book.description ?? undefinedFallback }</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "detailsTitle" ) }</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
          <BookDetailItem label={ t( "publisher" ) } value={ book.publisher } fallbackText={ undefinedFallback }/>
          <BookDetailItem label={ t( "publicationDate" ) } value={ book.publication_date }
                          fallbackText={ undefinedFallback }/>
          <BookDetailItem label={ t( "pages" ) } value={ book.pages } fallbackText={ undefinedFallback }/>
          <BookDetailItem label={ t( "isbn10" ) } value={ book.isbn_10 } fallbackText={ undefinedFallback }/>
          <BookDetailItem label={ t( "isbn13" ) } value={ book.isbn_13 } fallbackText={ undefinedFallback }/>
          <BookDetailItem
            label={ t( "dimensions" ) }
            value={ book.height && book.length && book.width && `${ book.height } x ${ book.length } x ${ book.width } cm` }
            fallbackText={ undefinedFallback }
          />
          <BookDetailItem label={ t( "weight" ) } value={ book.weight && `${ book.weight } g` }
                          fallbackText={ undefinedFallback }/>
          <BookDetailItem label={ t( "categories" ) } value={ book.categories && `${ book.categories.join( ", " ) }` }
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
            <Pencil className="w-4 h-4 mr-2"/> Edit Details
          </Button>
        ) }
      </div>
    </div>
  );
}