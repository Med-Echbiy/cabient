"use client";
import React from "react";
import PieData from "./PieData";
import { client } from "../../../../sanity/lib/client";
import { Appointments, doctor, service } from "@/Types/types";
import useDataStore from "@/store/data";
import { BORDERS_COLORS, COLORS } from "@/components/rapport/general";

interface props {
  appointments: Appointments[];
}

function PieDataContainer(props: props) {
  const { services, doctors } = useDataStore();
  const colors = [
    "rgba(0, 123, 255, 0.2)", // Blue
    "rgba(255, 193, 7, 0.2)", // Yellow
    "rgba(40, 167, 69, 0.2)", // Green
    "rgba(108, 117, 125, 0.2)", // Gray
    "rgba(255, 87, 34, 0.2)", // Orange
    "rgba(123, 104, 238, 0.2)", // Purple
    "rgba(0, 173, 239, 0.2)", // Sky Blue
    "rgba(255, 152, 0, 0.2)", // Amber
    "rgba(0, 204, 106, 0.2)", // Mint Green
    "rgba(220, 53, 69, 0.2)", // Crimson
    "rgba(255, 51, 51, 0.2)", // Dark Red
    "rgba(184, 233, 148, 0.2)", // Lime Green
    "rgba(255, 159, 26, 0.2)", // Pumpkin
    "rgba(186, 220, 88, 0.2)", // Yellow Green
    "rgba(255, 69, 58, 0.2)", // Coral
    "rgba(105, 121, 126, 0.2)", // Silver
    "rgba(90, 200, 250, 0.2)", // Light Sky Blue
    "rgba(255, 111, 145, 0.2)", // Pink
    "rgba(139, 195, 74, 0.2)", // Green Apple
    "rgba(255, 128, 171, 0.2)", // Light Pink
  ];
  const BorderColors = [
    "rgba(0, 123, 255, 0.5)", // Blue
    "rgba(255, 193, 7, 0.5)", // Yellow
    "rgba(40, 167, 69, 0.5)", // Green
    "rgba(108, 117, 125, 0.5)", // Gray
    "rgba(255, 87, 34, 0.5)", // Orange
    "rgba(123, 104, 238, 0.5)", // Purple
    "rgba(0, 173, 239, 0.5)", // Sky Blue
    "rgba(255, 152, 0, 0.5)", // Amber
    "rgba(0, 204, 106, 0.5)", // Mint Green
    "rgba(220, 53, 69, 0.5)", // Crimson
    "rgba(255, 51, 51, 0.5)", // Dark Red
    "rgba(184, 233, 148, 0.5)", // Lime Green
    "rgba(255, 159, 26, 0.5)", // Pumpkin
    "rgba(186, 220, 88, 0.5)", // Yellow Green
    "rgba(255, 69, 58, 0.5)", // Coral
    "rgba(105, 121, 126, 0.5)", // Silver
    "rgba(90, 200, 250, 0.5)", // Light Sky Blue
    "rgba(255, 111, 145, 0.5)", // Pink
    "rgba(139, 195, 74, 0.5)", // Green Apple
    "rgba(255, 128, 171, 0.5)", // Light Pink
  ];
  const doctorsNames = doctors.map((e) => ({
    fullName: e.fullName,
    id: e._id,
  }));
  const state = doctorsNames.map((e, i) => {
    const filter = props.appointments.filter((s) => s.doctors._ref === e.id);
    return filter.length;
  });
  const max = Math.max(...state) + 2;
  const data = {
    labels: doctorsNames.map((e) => e.fullName),
    datasets: [
      {
        label: "",
        data: state,
        backgroundColor: colors,
        borderColor: BorderColors,
        borderWidth: 1,
      },
    ],
  };

  const serviceState = services.map((e, i) => {
    const filter = props.appointments.filter((s) => s.service._ref === e._id);
    return filter.length;
  });
  const max_1 = Math.max(...serviceState) + 2;
  const data1 = {
    labels: services.map((e) => e.service_name),
    datasets: [
      {
        label: "",
        data: serviceState,
        backgroundColor: colors,
        borderColor: BorderColors,
        borderWidth: 1,
      },
    ],
  };
  const allAppointments = props.appointments.length;
  const paid = props.appointments.filter((e) => e.paid).length;
  const nonPaid = allAppointments - paid;
  const max_2 = paid > nonPaid ? paid + 2 : nonPaid + 2;
  const data2 = {
    labels: ["payé", "non-payé"],
    datasets: [
      {
        label: "",
        data: [paid, nonPaid],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  //

  const confirmed = props.appointments.filter((e) => e.confirmed).length;
  const unconfirmed = allAppointments - confirmed;
  const max_3 = confirmed > unconfirmed ? confirmed + 2 : unconfirmed + 2;
  const data_3 = {
    labels: ["confirmé", "non confirmé"],
    datasets: [
      {
        label: "",
        data: [confirmed, unconfirmed],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  return (
    <PieData
      maxes={{ max, max_1, max_2, max_3 }}
      dataV3={data1}
      dataV1={data}
      dataV2={data2}
      dataV4={data_3}
    />
  );
}

export default PieDataContainer;
