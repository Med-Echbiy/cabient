"use client";
import React from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);

interface props {
  dataV1: any;
  dataV2: any;
  dataV3: any;
  dataV4: any;
  maxes: {
    max: number;
    max_1: number;
    max_2: number;
    max_3: number;
  };
}
function PieData(props: props) {
  console.log(props.maxes);
  return (
    <div className="flex flex-col gap-3 text-center capitalize">
      <h4 className="text-4xl text-center">Statistiques</h4>

      <div className="max-w-[80%] mx-auto w-full">
        <p>Préférence du Médecin :</p>
        <Bar
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: props.maxes.max,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          data={props.dataV1}
        />
      </div>

      <div className="max-w-[80%] mx-auto w-full">
        <p>Fréquence des Services :</p>
        <Bar
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: props.maxes.max_2,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          data={props.dataV3}
        />
      </div>

      <div className="max-w-[80%] mx-auto w-full">
        <p>Fréquence de Paiement :</p>
        <Bar
          options={{
            scales: {
              x: {
                beginAtZero: true,
                max: props.maxes.max_1,
              },
            },
            indexAxis: "y",
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          data={props.dataV2}
        />
      </div>

      <div className="max-w-[80%] mx-auto w-full">
        <p>Fréquence de confirmation :</p>
        <Bar
          options={{
            scales: {
              x: {
                beginAtZero: true,
                max: props.maxes.max_3,
              },
            },
            indexAxis: "y",
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          data={props.dataV4}
        />
      </div>
    </div>
  );
}

export default PieData;
