"use client";
import React, { CSSProperties } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { BORDERS_COLORS, COLORS } from "../general";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  genderDistribution: { female: number; male: number };
  ageDistribution: {
    "<18": number;
    "18-40": number;
    ">40": number;
  };
}

function PatientPie(props: Props) {
  const age = props.ageDistribution;
  const total = props.genderDistribution.female + props.genderDistribution.male;
  const { male, female } = props.genderDistribution;

  const data: ChartData<"doughnut"> = {
    labels: ["féminin", "masculin"],
    datasets: [
      {
        label: "pourcentage %",
        data: [
          +(female / total).toFixed(2) * 100,
          +(male / total).toFixed(2) * 100,
        ],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  const data_2 = {
    labels: ["<18", "18-40", ">40"],
    datasets: [
      {
        label: "pourcentage %",
        data: [
          +(age["<18"] / total).toFixed(2) * 100,
          +(age["18-40"] / total).toFixed(2) * 100,
          +(age[">40"] / total).toFixed(2) * 100,
        ],
        backgroundColor: COLORS,
        borderColor: BORDERS_COLORS,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3 max-h-full flex-grow">
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p>répartition par genre</p>
        <Doughnut data={data} />
      </div>
      <div className="flex-grow capitalize text-center max-w-[100%]">
        <p>répartition par âge</p>
        <Doughnut data={data_2} />
      </div>
    </div>
  );
}

export default PatientPie;
