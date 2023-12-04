"use client";
import React from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { COLORS, BORDERS_COLORS } from "../general";
Chart.register(...registerables);

interface Props {
  earningCurrentMonth: number;
  earningPastMonth: number;
}

function EarningCharts(props: Props) {
  const max =
    (props.earningCurrentMonth > props.earningPastMonth
      ? props.earningCurrentMonth
      : props.earningPastMonth) + 100;
  const data_1: ChartData<"bar"> = {
    labels: ["Mois passé", "Mois en cours"],
    datasets: [
      {
        label: "Performance des gains",
        data: [props.earningPastMonth, props.earningCurrentMonth],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
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
                max: max,
              },
            },
            indexAxis: "y",
            plugins: {
              title: {
                display: true,
                text: "Performance des gains",
              },
              legend: {
                display: false,
              },
            },
          }}
          data={data_1}
        />
      </div>
    </div>
  );
}

export default EarningCharts;
