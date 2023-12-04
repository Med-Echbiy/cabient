import React from "react";
import { getDoctors, validateSanityLimit } from "../../../sanity/lib/client";
import DoctorsContainer from "@/components/doctorsPage/DoctorsContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
async function page() {
  const session = (await getServerSession(authOptions)) as {
    user: { name: string; role: string };
  };
  if (!session) {
    redirect("/auth/signIn");
  }
  if (session.user?.role.toLowerCase() !== "admin") {
    redirect("/");
  }
  const doctors = await getDoctors();
  await validateSanityLimit();
  console.log(session?.user);
  return (
    <div className="px-2 py-4 ">
      {/* <SessionProvider session={session}> */}
      <DoctorsContainer doctors={doctors} />
      {/* </SessionProvider> */}
    </div>
  );
}

export default page;
