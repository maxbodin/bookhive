import AuthForm from "@/components/login/auth-form";
import { ViewTransition } from "react";

export default function LoginPage() {
  return (
    <ViewTransition>
      <main className="flex justify-center items-center pb-10">
        <AuthForm/>
      </main>
    </ViewTransition>
  );
}