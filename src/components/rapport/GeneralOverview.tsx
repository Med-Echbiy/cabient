import { Appointments } from "@/Types/types";
import React from "react";
import GeneralPie from "./GeneralPie";

interface props {
  appointments: Appointments[];
}
function GeneralOverview(props: props) {
  const data = {
    "Confirmé mais non payé": props.appointments.filter(
      (e) => e.confirmed && !e.paid
    ).length,
    "Confirmé et payé": props.appointments.filter((e) => e.confirmed && e.paid)
      .length,
    "Non confirmé et non payé": props.appointments.filter(
      (e) => !e.confirmed && !e.paid
    ).length,
    "Non confirmé et payé": props.appointments.filter(
      (e) => !e.confirmed && e.paid
    ).length,
  };

  return (
    <section className="flex items-center justify-center w-full">
      <GeneralPie total={props.appointments.length} data={data} />
    </section>
  );
}

export default GeneralOverview;
