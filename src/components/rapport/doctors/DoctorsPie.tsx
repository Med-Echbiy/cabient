"use client";
import React, { CSSProperties } from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { COLORS, BORDERS_COLORS } from "../general";
import { Doughnut, PolarArea, Radar } from "react-chartjs-2";
import { Appointments, doctor } from "@/Types/types";
Chart.register(...registerables);

interface Props {
  data: { doctorName: string; appointmentsCount: number }[];
  data_2: {
    doctorName: string;
    earning: number;
  }[];
  data_3: {
    doctorName: string;
    unpaidAppointments: number;
  }[];
  data_4: {
    doctorName: string;
    unConfirmedAppointments: number;
    confirmedAppointments: number;
  }[];
}

function DoctorsPie(props: Props) {
  const data: ChartData<"doughnut"> = {
    labels: props.data.map((e) => e.doctorName),
    datasets: [
      {
        label: "pourcentage %",
        data: props.data.map((e) => e.appointmentsCount),
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const data_2: ChartData<"doughnut"> = {
    labels: props.data_2.map((e) => e.doctorName),
    datasets: [
      {
        data: props.data_2.map((e) => e.earning),
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const data_3: ChartData<"doughnut"> = {
    labels: props.data_3.map((e) => e.doctorName),
    datasets: [
      {
        label: "pourcentage %",
        data: props.data_3.map((e) => e.unpaidAppointments * 100),
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const data_4: ChartData<"doughnut"> = {
    labels: props.data_4.map((e) => e.doctorName),
    datasets: [
      {
        label: "pourcentage %",
        data: props.data_4.map((e) => e.unConfirmedAppointments * 100),
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };
  const data_5: ChartData<"doughnut"> = {
    labels: props.data_4.map((e) => e.doctorName),
    datasets: [
      {
        label: "pourcentage %",
        data: props.data_4.map((e) => e.confirmedAppointments * 100),
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3 max-h-full flex-grow">
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p className="mb-2">Répartition des rendez-vous pour les médecins</p>
        <Doughnut data={data} />
      </div>
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p className="mb-2">Répartition des gains pour les médecins</p>
        <Doughnut data={data_2} />
      </div>
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p className="mb-2">Répartition des rendez-vous non-payé</p>
        <Doughnut data={data_3} />
      </div>
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p className="mb-2">Répartition des rendez-vous non-confirme</p>
        <Doughnut data={data_4} />
      </div>
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p className="mb-2">Répartition des rendez-vous confirme</p>
        <Doughnut data={data_5} />
      </div>
    </div>
  );
}

export default DoctorsPie;
