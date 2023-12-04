import { Appointments, Client, doctor, service } from "@/Types/types";
import React from "react";
import {
  client,
  getAllAppointments,
  getAllAppointmentsNoFilter,
  getClients,
  getDoctors,
  getServices,
  getServicesNoFilter,
} from "../../../sanity/lib/client";
import PatientOverview from "@/components/rapport/patients/PatientOverview";
import AppointmentsOverview from "@/components/rapport/appointemnts/AppointmentsOverview";
import EarningOverview from "@/components/rapport/earning/EarningOverview";
import DoctorsOverview from "@/components/rapport/doctors/DoctorsOverview";
import ServicesOverview from "@/components/rapport/services/ServicesOverview";
import GeneralOverview from "@/components/rapport/GeneralOverview";
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
  const appointments = await getAllAppointmentsNoFilter();
  const services: service[] = await getServices();
  // all services get also the services that have been deleted but stored for stats :)
  const AllServices = await getServicesNoFilter();
  const doctors: doctor[] = await getDoctors();
  const patients: Client[] = await getClients();

  return (
    <>
      <h1 className="my-4 text-xl capitalize text-center">
        Note : Les totaux (rendez-vous, gains) concernent les deux derniers
        mois, offrant une vision récente, non cumulée sur une période plus
        longue.
      </h1>
      <main className="p-6 min-h-screen grid grid-cols-4">
        <div className="flex items-center flex-col gap-3">
          <PatientOverview patients={patients} />
          <DoctorsOverview
            services={AllServices}
            appointments={appointments}
            doctors={doctors}
          />
        </div>
        <div className=" col-span-3 p-2 shadow">
          <AppointmentsOverview appointments={appointments} />
          <EarningOverview services={AllServices} appointments={appointments} />
          <ServicesOverview services={services} appointments={appointments} />
          <GeneralOverview appointments={appointments} />
        </div>
      </main>
    </>
  );
}

export default page;
