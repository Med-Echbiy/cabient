"use client";
import { Appointments, doctor, service } from "@/Types/types";
import React, { useEffect, useState } from "react";
import DoctorInfo from "./DoctorInfo";
import DoctorState from "./DoctorState";
import Stats from "./Stats";
import { client } from "../../../../sanity/lib/client";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

function ContainerDoctor({
  doctorAppointment,
  doctor,
  allServices,
}: {
  doctorAppointment: Appointments[];
  doctor: doctor;
  allServices: service[];
}) {
  const [appoitnments, setAppointments] =
    useState<Appointments[]>(doctorAppointment);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    // Ensure the subscription is canceled when the component unmounts
    const sub = client
      .listen('*[_type == "reservation" && doctors._ref == $id]', {
        id,
      })
      .subscribe((update) => {
        const result = update;
        console.log(result);
        const appointment = update.result as unknown as Appointments;
        const key = Object.keys(result.mutations[0])[0] as
          | "patch"
          | "createIfNotExists"
          | "delete";
        console.log(key);
        if (key === "patch") {
          const allAppoi = appoitnments.map((e) => {
            if (e._id === appointment._id) {
              return appointment;
            }
            return e;
          });
          setAppointments(allAppoi);
        } else if (key === "createIfNotExists") {
          const appoint = [...appoitnments, appointment];
          setAppointments(appoint);
        } else if (key === "delete") {
          const appoint = appoitnments.filter(
            (e) => e._id !== result.documentId
          );
          setAppointments(appoint);
        }
        toast.success("Rendez-vous mis à jour!!");
      });
    // Clean up the subscription when the component unmounts
    return () => sub.unsubscribe();
  }, [appoitnments, id]);
  return (
    <div className="min-h-screen">
      {/* <h1 className="my-4 text-xl capitalize text-center">
        Note : Les totaux (rendez-vous, gains) concernent les deux derniers
        mois, offrant une vision récente, non cumulée sur une période plus
        longue.
      </h1> */}
      <main className="grid grid-cols-4 h-full p-2">
        <section className="shadow p-3 grid grid-rows-3 min-h-screen">
          <DoctorInfo doctor={doctor} />
          <DoctorState
            services={allServices}
            doctorAppointment={appoitnments}
          />
        </section>
        <section className="col-span-3 shadow p-3 w-full min-h-screen flex flex-col items-center">
          <Stats doctorAppointment={appoitnments} allServices={allServices} />
        </section>
      </main>
    </div>
  );
}

export default ContainerDoctor;
