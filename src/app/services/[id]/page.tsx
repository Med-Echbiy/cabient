import React from "react";
import { client, getDoctors } from "../../../../sanity/lib/client";
import { Appointments, service as Service } from "@/Types/types";
import { MdOutlineAttachMoney, MdOutlineMoneyOff } from "react-icons/md";
import DoctorsBar from "@/components/ServicesPage/servicePage/DoctorsBar";
import { redirect } from "next/navigation";
import { urlForImage } from "../../../../sanity/lib/image";
import Notify from "@/components/ServicesPage/servicePage/Notify";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
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
  const service: Service = await client.fetch(
    `*[_type == "services" && _id == $id][0]`,
    {
      id: params.id,
    },
    {
      cache: "no-store",
    }
  );
  if (!!!service) {
    redirect("/");
  }
  let fourteenDaysAgo = new Date();
  fourteenDaysAgo.setMonth(fourteenDaysAgo.getDate() - 2);
  const appointments: Appointments[] = await client.fetch(
    `*[_type == "reservation" && defined(doctors) && defined(client) && service._ref == $id && dateTime(end) > dateTime('${fourteenDaysAgo.toISOString()}') ]`,
    { id: params.id },
    {
      cache: "no-store",
    }
  );
  const doctors = await getDoctors();
  console.log(appointments.length);
  //
  let doctorsDataInObject: Record<
    string,
    {
      name: string;
      status: boolean;
      count: number;
      paid: number;
      unpaid: number;
      confirmed: number;
      unconfirmed: number;
    }
  > = {};
  doctors.forEach((e) => {
    doctorsDataInObject[e._id] = {
      name: e.fullName,
      status: !!e.status,
      count: 0,
      paid: 0,
      unpaid: 0,
      confirmed: 0,
      unconfirmed: 0,
    };
  });
  //
  const todayAppoin = appointments
    .filter((e) => {
      doctorsDataInObject[e.doctors._ref].count += 1;
      if (e.paid) {
        doctorsDataInObject[e.doctors._ref].paid += 1;
      } else if (!e.paid) {
        doctorsDataInObject[e.doctors._ref].unpaid += 1;
      }
      if (e.confirmed) {
        doctorsDataInObject[e.doctors._ref].confirmed += 1;
      } else if (!e.confirmed) {
        doctorsDataInObject[e.doctors._ref].unconfirmed += 1;
      }
      const currentDate = new Date();
      const appointmentDate = new Date(e.start);
      return (
        appointmentDate.getDate() === currentDate.getDate() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        doctorsDataInObject[e.doctors._ref].status
      );
    })
    .sort((a, b) => {
      const aHours = new Date(a.end).getHours();
      const aMinutes = new Date(a.end).getMinutes();
      const bHours = new Date(b.end).getHours();
      const bMinutes = new Date(b.end).getMinutes();
      if (aHours === bHours) {
        return aMinutes - bMinutes;
      }
      return aHours - bHours;
    })
    .map((e) => ({
      ...e,
      doctorName: doctorsDataInObject[e.doctors._ref].name,
      status: doctorsDataInObject[e.doctors._ref].status,
    }));

  console.log(doctorsDataInObject);
  //

  return (
    <main className="grid grid-cols-1 gap-3 p-3 items-center min-h-screen">
      <Notify />
      <h1 className="flex w-full max-w-[80%] text-neutral mt-4 mx-auto items-center gap-5 text-4xl capitalize">
        <img
          className="max-w-[80px] rounded-full aspect-square object-cover object-center"
          src={`${urlForImage(service.image)}`}
          alt={service.service_name}
        />
        <span>{service.service_name}</span>
      </h1>
      <div className="w-full max-w-[80%] mx-auto divider"></div>
      <section className="w-full p-4 gap-3 grid grid-cols-3 max-w-[80%] mx-auto">
        {todayAppoin.length > 0 && (
          <h4 className=" col-span-3">
            Rendez-vous confirmés aujourd&apos;hui : {todayAppoin.length}
          </h4>
        )}
        {todayAppoin.length > 0 ? (
          todayAppoin.map((e) => (
            <div
              className="p-4 w-full rounded-lg text-gray-900"
              style={{
                backgroundColor: e.color,
              }}
              key={e._id + e._type + e.color + "wwwwww"}
            >
              <div className="text-sm flex items-center justify-between">
                {e.paid ? <MdOutlineAttachMoney /> : <MdOutlineMoneyOff />}{" "}
                <form action=""></form>
              </div>
              <p className="flex items-center justify-between">
                {" "}
                <span>{e.title} </span>
                <span className="text-xs"> {e.doctorName} </span>
              </p>
              <div className="flex gap-1 text-[10px] 3xl:text-xs ">
                <span>
                  {new Date(e.start).toLocaleTimeString("fr", {
                    timeStyle: "short",
                  })}
                  {" - "}
                  {new Date(e.end).toLocaleTimeString("fr", {
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-full text-center">
            Aucun rendez-vous disponible pour le moment
          </div>
        )}
      </section>
      <section className="shadow-lg card h-full gap-y-6">
        <DoctorsBar
          appointments={appointments}
          service={service}
          total={appointments.length}
          data={doctorsDataInObject}
        />
      </section>
    </main>
  );
}

export default page;
