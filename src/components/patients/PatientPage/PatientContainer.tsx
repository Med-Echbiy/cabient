"use client";
import { Appointments, Client, doctor, events, service } from "@/Types/types";
import React, { Suspense, useEffect, useState } from "react";
import PatientAppointment from "./PatientAppointment";
import State from "./State";
import PieDataContainer from "./PieDataContainer";
import NoAppointments from "./NoAppointments";
import useDataStore from "@/store/data";
import LoadingClient from "@/components/Common/LoadingClient";

interface props {
  appointments: Appointments[];
  doctors: doctor[];
  services: service[];
  client: Client;
}

function PatientContainer(props: props) {
  const {
    getAppointments,
    appointments,
    setAppointments,
    setDoctors,
    setServices,
  } = useDataStore();
  const [data, setData] = useState(props.appointments);
  useEffect(() => {
    setDoctors(props.doctors);
    setServices(props.services);
    setAppointments(props.appointments as unknown as events[]);
  }, [
    props.appointments,
    props.doctors,
    props.services,
    setAppointments,
    setDoctors,
    setServices,
  ]);
  useEffect(() => {
    console.log("effect from container run ", getAppointments());
    const appoin = getAppointments() as unknown as Appointments[];
    setData((e) => [...appoin]);
  }, [appointments, getAppointments]);
  return (
    <div className="flex-grow px-6">
      {data.length > 0 ? (
        <>
          <div className="flex flex-col gap-12">
            <div className="w-full flex items-center justify-center">
              <State appointments={data} />
            </div>
            <div>
              <h3 className=" capitalize text-center text-4xl my-3">
                rendez-vous
              </h3>
              <PatientAppointment
                doctors={props.doctors}
                services={props.services}
                client={props.client}
                appointments={data}
              />
            </div>
            <div>
              <PieDataContainer appointments={data} />
            </div>
          </div>
        </>
      ) : (
        <NoAppointments>No Appointmetns Found!</NoAppointments>
      )}
    </div>
  );
}

export default PatientContainer;
