import React from "react";
import {
  getBasedOnClient,
  getDoctors,
  getDoctorsNoFilter,
  getOneClient,
  getServices,
  getServicesNoFilter,
} from "../../../../sanity/lib/client";
import { Appointments, doctor, service } from "@/Types/types";
import PatientContainer from "@/components/patients/PatientPage/PatientContainer";
import ClientContainer from "@/components/patients/PatientPage/ClientContainer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signIn");
  }
  const res = await getOneClient(params.id);
  const requestAppointments: Appointments[] = await getBasedOnClient(params.id);
  console.log(requestAppointments);
  const appointments = requestAppointments
    .sort((a, b) => (new Date(b.start) as any) - (new Date(a.start) as any))
    .map((event) => {
      if (event.paid) {
        return {
          ...event,
          color: "#22c55e",
        };
      }
      if (new Date() > new Date(event.end) && event.paid == false) {
        return {
          ...event,
          color: "#dc2626",
        };
      } else {
        return {
          ...event,
          color: "#fbbf24",
        };
      }
    });

  const doctors: doctor[] = await getDoctorsNoFilter();
  const services: service[] = await getServicesNoFilter();
  return (
    <div className=" flex  p-6 min-h-screen">
      <ClientContainer client={res} />
      <PatientContainer
        appointments={appointments}
        doctors={doctors}
        services={services}
        client={res}
      />
    </div>
  );
}

export default page;
