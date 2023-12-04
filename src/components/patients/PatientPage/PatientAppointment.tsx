"use client";
import {
  Appointments,
  Client as ClientType,
  doctor,
  events,
  service,
} from "@/Types/types";
import React, { useEffect, useState } from "react";
import ShowCase from "./ShowCase";
import useDataStore from "@/store/data";

interface props {
  appointments: Appointments[];
  client: ClientType;
  services: service[];
  doctors: doctor[];
}

function PatientAppointment(props: props) {
  const { getAppointments } = useDataStore();
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-2 mx-auto h-full overflow-hidden">
      {props.appointments.length > 0 &&
        getAppointments().map((e) => {
          const color = e.confirmed
            ? "#22c55e"
            : new Date() > new Date(e.end as Date)
            ? "#dc2626"
            : "#fbbf24";
          return (
            <div
              className="text-white card p-4 flex flex-col gap-1 rounded shadow-xl w-full"
              style={{
                backgroundColor: color,
              }}
              key={e._id + "Z"}
            >
              <h4 className="flex items-center justify-between gap-2">
                {" "}
                <span> {e.title}</span>{" "}
                <ShowCase
                  key={e._id + "ffffffff"}
                  client={props.client}
                  appointments={e as unknown as Appointments}
                />{" "}
              </h4>
              <div className="flex items-center justify-start gap-1">
                <p className="text-xs">
                  {new Date(e.start).toLocaleDateString("fr", {
                    dateStyle: "long",
                  })}
                </p>
                <p>-</p>
                <p className="text-xs">
                  {new Date(e.end).toLocaleDateString("fr", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <p className="text-xs">
                  {new Date(e.start).toLocaleTimeString("fr", {
                    timeStyle: "short",
                  })}
                </p>
                <p>-</p>
                <p className="text-xs">
                  {new Date(e.end).toLocaleTimeString("fr", {
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default PatientAppointment;
