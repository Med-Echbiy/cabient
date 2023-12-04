"use client";
import React, { useEffect, useState } from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { COLORS, BORDERS_COLORS } from "../general";
Chart.register(...registerables);

interface Props {
  currentMonth: number;
  pastMonth: number;
  past_2Month: number;
}

function AppointmentsCharts(props: Props) {
  const [max, setMax] = useState(0);

  useEffect(() => {
    const numbers = [props.currentMonth, props.pastMonth, props.past_2Month];
    setMax(Math.max(...numbers));
  }, [props]);

  const data_1: ChartData<"bar"> = {
    labels: ["le mois avant le mois dernier", "le mois dernier", "ce mois-ci"],
    datasets: [
      {
        label: "performance des rendez-vous",
        data: [props.past_2Month, props.pastMonth, props.currentMonth],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 4,
        // tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex items-center">
      <div className="max-w-[100%] p-4 flex-grow">
        <Bar
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: max + 2,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "performance des rendez-vous",
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

export default AppointmentsCharts;
