import React from "react";
import { client } from "../../../sanity/lib/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EmployeeContainer from "@/components/employee/EmployeeContainer";
import { employee } from "@/Types/types";

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
  const employee: employee[] = await client.fetch("*[_type == 'employee']");
  return (
    <div className="px-2 py-4 ">
      {/* <SessionProvider session={session}> */}
      <EmployeeContainer employee={employee} />
      {/* </SessionProvider> */}
    </div>
  );
}

export default page;
