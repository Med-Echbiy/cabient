import { redirect } from "next/navigation";
import React from "react";

function page() {
  redirect("/auth/signIn");
  return <div>page</div>;
}

export default page;
