"use client";
import React from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { COLORS, BORDERS_COLORS } from "../general";
Chart.register(...registerables);

interface Props {
  servicesData: {
    serviceName: string;
    data: { pastPastMonth: number; pastMonth: number; currentMonth: number };
  }[];
  mode: "earnings" | "appointments";
}

function ServiceCharts(props: Props) {
  let max = 0;
  props.servicesData.map((e) => {
    const result =
      e.data.currentMonth + e.data.pastMonth + e.data.pastPastMonth;
    if (result > max) {
      max = result;
    }
  });
  const data: ChartData<"line"> = {
    labels: ["le mois avant le mois dernier", "le mois dernier", "ce mois-ci"],
    datasets: props.servicesData.map((e, i) => ({
      label: e.serviceName,
      data: [e.data.pastPastMonth, e.data.pastMonth, e.data.currentMonth],
      borderColor: BORDERS_COLORS[i],
      color: COLORS[i],
      tension: 0.3,
    })),
  };

  return (
    <div className="flex items-center">
      <div className="max-w-[100%] p-4 flex-grow">
        <Line
          data={data}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: max,
              },
            },
          }}
        />
        <p className="text-center capitalize mt-2">
          {props.mode === "appointments"
            ? "Description : Performance du service en termes de nombre de rendez-vous total"
            : "Description : Performance du service en termes de gains par service"}
        </p>
      </div>
    </div>
  );
}

export default ServiceCharts;
