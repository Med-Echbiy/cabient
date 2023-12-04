import Calendar from "../components/Calendar/Calendar";
import {
  client,
  getAppointments60DaysOld,
  getClients,
  getClientsNoFilter,
  getDoctors,
  getServices,
  validateSanityLimit,
} from "../../sanity/lib/client";
import { events } from "@/Types/types";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export default async function Home() {
  const session = (await getServerSession(authOptions)) as {
    user: { id: string; name: string; role: string };
  };
  if (!session) {
    redirect("/auth/signIn");
  }
  const appointments = await getAppointments60DaysOld();
  const appointment = appointments.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
  const CurrentDate = new Date();

  const events: events[] = appointments.map((event) => {
    if (!!event.confirmed) {
      return {
        ...event,
        title: event.title,
        client: event.client._ref,
        service: event.service._ref,
        doctors: event.doctors._ref,
        start: new Date(event.start),
        end: new Date(event.end),
        color: "#22c55e",
        confirmed: event.confirmed,
      };
    }
    if (CurrentDate > new Date(event.end) && !!!event.confirmed) {
      return {
        ...event,
        title: event.title,
        client: event.client._ref,
        service: event.service._ref,
        doctors: event.doctors._ref,
        start: new Date(event.start),
        end: new Date(event.end),
        color: "#dc2626",
      };
    } else {
      return {
        ...event,
        title: event.title,
        client: event.client._ref,
        service: event.service._ref,
        doctors: event.doctors._ref,
        start: new Date(event.start),
        end: new Date(event.end),
        color: "#fbbf24",
      };
    }
  });

  // ----- -----
  const doctors = await getDoctors();
  const clients = await getClientsNoFilter();
  const services = await getServices();
  await validateSanityLimit();
  return (
    //
    <main className="h-full">
      <Calendar
        appointments={appointment}
        events={events}
        services={services}
        doctors={doctors}
        clients={clients}
      />
    </main>
  );
}
