"use client";
import React from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { COLORS, BORDERS_COLORS } from "../general";
import { AppointmentsPerService } from "./ServicesOverview";
Chart.register(...registerables);

interface Props {
  data: AppointmentsPerService;
}

function ServiceBar(props: Props) {
  const LABELS = Object.keys(props.data).sort();
  const DATA = LABELS.map((e) => props.data[e].unConfirmed);
  const data: ChartData<"bar"> = {
    labels: LABELS,
    datasets: [
      {
        label: "Rendez-vous non confirmés par service %",
        data: DATA,
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 4,
      },
    ],
  };
  return (
    <div className="flex items-center">
      <div className="max-w-[100%] p-4 flex-grow">
        <Bar
          options={{
            scales: {
              x: {
                beginAtZero: true,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Rendez-vous non confirmés par service %",
              },
              legend: {
                display: false,
              },
            },
          }}
          data={data}
        />
      </div>
    </div>
  );
}

export default ServiceBar;
