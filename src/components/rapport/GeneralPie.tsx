"use client";
import React from "react";
import { Chart, ChartData, registerables } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { BORDERS_COLORS, COLORS } from "./general";
Chart.register(...registerables);
function GeneralPie({
  data,
  total,
}: {
  data: {
    "Confirmé mais non payé": number;
    "Confirmé et payé": number;
    "Non confirmé et non payé": number;
    "Non confirmé et payé": number;
  };
  total: number;
}) {
  const doughnutData: ChartData<"doughnut"> = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "percentage%",
        data: Object.values(data)
        .map((e) => (e / total) * 100),
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
      },
    ],
  };
  return (
    <div className="max-w-[600px] mt-3 w-full">
      <Doughnut data={doughnutData} />
    </div>
  );
}

export default GeneralPie;
