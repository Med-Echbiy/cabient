import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LoginForm } from "@/components/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className=" max-w-lg card shadow p-4 gap-y-4">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </section>
  );
}

export default page;
