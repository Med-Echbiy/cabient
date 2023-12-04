"use client";
import { Appointments, service } from "@/Types/types";
import React, { useEffect, useState } from "react";
import { client, getClients } from "../../../../sanity/lib/client";
import { MdOutlineAttachMoney, MdOutlineMoneyOff } from "react-icons/md";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
interface FeautureAppointment extends Appointments {
  serviceName: string;
}
function DoctorState({
  doctorAppointment,
  services,
}: {
  doctorAppointment: Appointments[];
  services: service[];
}) {
  const { id } = useParams();
  console.log({ id });
  const activeServices = services.filter((e) => {
    const active = e.doctors.filter(
      (a) => a._ref === id && !a._key?.startsWith("false") && e.status
    );
    return active.length > 0;
  });
  console.log({ activeServices });
  function filterAppointments(allAppoi: Appointments[]) {
    const filtred = allAppoi.filter((e) => {
      const currentDate = new Date();
      const appointmentDate = new Date(e.start);
      return (
        appointmentDate.getDate() === currentDate.getDate() &&
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        e.confirmed &&
        !!activeServices.find((a) => a._id === e.service._ref)
      );
    });
    console.log(filtred);
    filtred.sort((a, b) => {
      const aHours = new Date(a.end).getHours();
      const aMinutes = new Date(a.end).getMinutes();
      const bHours = new Date(b.end).getHours();
      const bMinutes = new Date(b.end).getMinutes();
      if (aHours === bHours) {
        return aMinutes - bMinutes;
      }
      return aHours - bHours;
    });
    return filtred.map((e) => {
      const service = activeServices.find((a) => a._id === e.service._ref);
      return { ...e, serviceName: service?.service_name as string };
    });
  }
  const [featureAppointment, setFeatureAppointment] = useState<
    FeautureAppointment[]
  >([]);
  useEffect(() => {
    const state = filterAppointments(doctorAppointment);
    setFeatureAppointment(state);
  }, [doctorAppointment]);

  return (
    <div className="pt-6 flex flex-col gap-3 h-full px-4 row-span-2 current_appointments card shadow-md">
      {featureAppointment.length > 0 && (
        <h4>
          Rendez-vous confirmés aujourd&apos;hui : {featureAppointment.length}
        </h4>
      )}
      {featureAppointment.length > 0 ? (
        featureAppointment.map((e) => (
          <div
            className="p-4 w-full rounded-lg text-gray-900"
            style={{
              backgroundColor: e.color,
            }}
            key={e._id + e._type + e.color + "x"}
          >
            <div className="text-sm flex items-center justify-between">
              {e.paid ? <MdOutlineAttachMoney /> : <MdOutlineMoneyOff />}{" "}
              <form action=""></form>
            </div>
            <p className="flex items-center justify-between">
              {" "}
              <span>{e.title} </span>
              <span className="text-[10px]">{e.serviceName}</span>{" "}
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
    </div>
  );
}

export default DoctorState;
