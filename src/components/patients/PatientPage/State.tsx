import { Appointments } from "@/Types/types";
import React from "react";

interface props {
  appointments: Appointments[];
}

function State(props: props) {
  const totalAppointments = props.appointments.length;

  const passed = props.appointments.filter((e) => new Date(e.end) < new Date());
  const upcoming = props.appointments.filter(
    (e) => new Date(e.start) > new Date()
  );
  const ongoing = props.appointments.filter(
    (e) => new Date(e.end) > new Date() && new Date(e.start) < new Date()
  );

  return (
    <div className="stats shadow mx-auto">
      <div className="stat place-items-center">
        <div className="stat-title">Total des rendez-vous</div>
        <div className="stat-value"> {totalAppointments} </div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">En cours</div>
        <div className="stat-value text-yellow-600"> {ongoing.length} </div>
      </div>

      <div className="stat place-items-center">
        <div className="stat-title">À venir</div>
        <div className="stat-value text-primary"> {upcoming.length} </div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Passés</div>
        <div className="stat-value text-error"> {passed.length} </div>
      </div>
    </div>
  );
}

export default State;
