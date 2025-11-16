import { createClient } from "@/app/utils/supabase/server";

export default async function UserProfile( { params }: { params: { email: string } } ) {
  const supabase = await createClient();

  const decodedEmail = decodeURIComponent( params.email );

  const { data: user, error } = await supabase
    .from( "profiles" )
    .select( "*" )
    .eq( "email", decodedEmail )
    .single();

  if (error || !user) {
    return <div>{ error?.message || "User not found" }</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Profile for { user.email }</h1>
      <p>Name: { user.email }</p>
      <p>Joined: { new Date( user.created_at ).toLocaleDateString() }</p>
    </div>
  );
}
