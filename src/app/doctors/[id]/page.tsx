import React from "react";
import { client, getServices } from "../../../../sanity/lib/client";
import { doctor as Doctor } from "@/Types/types";
import ContainerDoctor from "@/components/doctorsPage/doctorPage/ContainerDoctor";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export const dynamic = "force-dynamic";
async function page({ params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions)) as {
    user: { name: string; role: string };
  };
  if (!session) {
    redirect("/auth/signIn");
  }
  if (session.user?.role.toLowerCase() !== "admin") {
    redirect("/");
  }
  const id = params.id;
  const doctor: Doctor = await client.fetch(
    "*[_type == 'unite' && _id == $id ][0]",
    {
      id,
    },
    {
      cache: "no-store",
    }
  );
  const doctorAppointment = await client.fetch(
    '*[_type == "reservation" && doctors._ref == $id ]',
    { id },
    {
      cache: "no-store",
    }
  );
  const allServices = await getServices();
  return (
    <ContainerDoctor
      doctor={doctor}
      allServices={allServices}
      doctorAppointment={doctorAppointment}
    />
  );
}

export default page;
