import React from "react";
import { getDoctors, getServices } from "../../../sanity/lib/client";
import ServicesContainer from "@/components/ServicesPage/ServicesContainer";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
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
  const services = await getServices();
  const doctors = await getDoctors();
  return (
    <div className="px-2 py-4 ">
      <ServicesContainer doctors={doctors} services={services} />
    </div>
  );
}

export default page;
