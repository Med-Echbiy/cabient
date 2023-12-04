import React from "react";
import { getClients, validateSanityLimit } from "../../../sanity/lib/client";
import PatientsContainer from "@/components/patients/PatientsContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
async function page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signIn");
  }
  const res = await getClients();
  await validateSanityLimit();
  return (
    <div className="px-2 py-4 ">
      <PatientsContainer clients={res} />
    </div>
  );
}

export default page;
