"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  registerables,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { BORDERS_COLORS, COLORS } from "@/components/rapport/general";
import { Appointments, service } from "@/Types/types";
ChartJS.register(...registerables);

type Data = Record<
  string,
  {
    name: string;
    status: boolean;
    count: number;
    paid: number;
    unpaid: number;
    confirmed: number;
    unconfirmed: number;
  }
>;

function DoctorsBar({
  data,
  total,
  appointments,
  service,
}: {
  data: Data;
  total: number;
  appointments: Appointments[];
  service: service;
}) {
  const DATA = Object.values(data);
  const LABLES = Object.values(data).map((e) => e.name);
  const DATA_COUNT = DATA.map((e) => e.count);
  const data_to_freq_of_doctors_service: ChartData<"bar"> = {
    labels: LABLES,
    datasets: [
      {
        label: "",
        data: DATA_COUNT,
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 4,
      },
    ],
  };
  const options_count: any = {
    animation: false,
    scales: {
      y: {
        min: 0,
        max: total + 1,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Fréquence des rendez-vous entre les médecins",
      },
      legend: {
        display: false, // Définir l'affichage sur false pour masquer la légende
      },
    },
  };
  const DATA_PAID = DATA.map((e) => e.paid);
  const paid_appoin_between_doc: ChartData<"doughnut"> = {
    labels: LABLES,
    datasets: [
      {
        label: "",
        data: DATA_PAID,
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 2,
      },
    ],
  };
  const options_paid: any = {
    animation: false,
    plugins: {
      title: {
        display: true,
        text: "Fréquence des rendez-vous payés entre les médecins",
      },
    },
  };
  //
  const DATA_CONFIRMED = DATA.map((e) => e.paid);
  const confirmed_appointments: ChartData<"doughnut"> = {
    labels: LABLES,
    datasets: [
      {
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 2,
        data: DATA_CONFIRMED,
        label: "",
      },
    ],
  };
  const options_confirmed: any = {
    animation: false,
    plugins: {
      title: {
        display: true,
        text: "Fréquence des rendez-vous confirmés entre les médecins",
      },
    },
  };
  //
  const DATA_UNCONFIRMED = DATA.map((e) => e.unconfirmed);
  const unconfirmed_appointments: ChartData<"doughnut"> = {
    labels: LABLES,
    datasets: [
      {
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 2,
        data: DATA_UNCONFIRMED,
        label: "",
      },
    ],
  };
  const options_unconfirmed: any = {
    animation: false,
    plugins: {
      title: {
        display: true,
        text: "Fréquence des rendez-vous non confirmés entre les médecins",
      },
    },
  };
  //
  const DATA_UNPAID = DATA.map((e) => e.unpaid);
  const unpaid_appointments: ChartData<"doughnut"> = {
    labels: LABLES,
    datasets: [
      {
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 2,
        data: DATA_UNPAID,
        label: "",
      },
    ],
  };
  const options_unpaid: any = {
    animation: false,
    plugins: {
      title: {
        display: true,
        text: "Fréquence des rendez-vous impayés entre les médecins",
      },
    },
  };
  //

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);
  let todayEarning = 0;
  let pastDayEarning = 0;
  let pastPastDayEarning = 0;

  appointments
    .filter((e) => e.paid)
    .forEach((a) => {
      const appointmentDate = new Date(a.start);
      const cost = (a.amount as number) || service.price;
      //   totalEarning += cost;

      // Vérifier le mois en cours
      if (appointmentDate.getFullYear() === today.getFullYear()) {
        if (appointmentDate.getMonth() === today.getMonth()) {
          //   currentMonthEarning += cost;
          // Vérifier aujourd'hui
          if (appointmentDate.getDate() === today.getDate()) {
            todayEarning += cost;
          }

          // Vérifier le jour précédent
          else if (appointmentDate.getDate() === yesterday.getDate()) {
            console.log("jour précédent");
            pastDayEarning += cost;
          }

          // Vérifier le jour précédent précédent
          else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
            pastPastDayEarning += cost;
          }
        } else if (appointmentDate.getMonth() === yesterday.getMonth()) {
          // Vérifier le jour précédent
          if (appointmentDate.getDate() === yesterday.getDate()) {
            console.log("jour précédent");
            pastDayEarning += cost;
          }

          // Vérifier le jour précédent précédent
          else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
            pastPastDayEarning += cost;
          }
        }
      } else if (appointmentDate.getFullYear() === yesterday.getFullYear()) {
        if (appointmentDate.getDate() === yesterday.getDate()) {
          console.log("jour précédent");
          pastDayEarning += cost;
        }

        // Vérifier le jour précédent précédent
        else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
          pastPastDayEarning += cost;
        }
      }
    });
  const DATA_EARNINGS = [todayEarning, pastDayEarning, pastPastDayEarning];
  const EARNINGS_LABELS = ["aujourd'hui", "hier", "avant-hier"];
  const earnings: ChartData<"bar"> = {
    labels: EARNINGS_LABELS,
    datasets: [
      {
        label: "",
        data: DATA_EARNINGS,
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 4,
      },
    ],
  };
  const max =
    todayEarning > pastDayEarning && todayEarning > pastPastDayEarning
      ? todayEarning
      : pastDayEarning > pastPastDayEarning
      ? pastDayEarning
      : pastPastDayEarning;
  const options_earning: any = {
    animation: false,
    scales: {
      y: {
        min: 0,
        max: max + 100,
        beginAtZero: true,
      },
    },

    plugins: {
      title: {
        display: true,
        text: "Gains des 3 derniers jours",
      },
      legend: {
        display: false, // Définir l'affichage sur false pour masquer la légende
      },
    },
  };
  return (
    <>
      <div className="w-full max-w-[80%] mx-auto">
        <Bar data={earnings} options={options_earning} />
      </div>
      <div className="w-full max-w-[80%] mx-auto">
        <Bar data={data_to_freq_of_doctors_service} options={options_count} />
      </div>
      <div className="divider w-full max-w-[80%] mx-auto"></div>
      <div className="grid w-full mt-6 grid-cols-2 items-center gap-6 justify-center max-w-[80%] mx-auto">
        <div className="w-full">
          <Doughnut data={paid_appoin_between_doc} options={options_paid} />
        </div>
        <div className="w-full">
          <Doughnut data={confirmed_appointments} options={options_confirmed} />
        </div>
        <div className="w-full">
          <Doughnut data={unpaid_appointments} options={options_unpaid} />
        </div>
        <div className="w-full">
          <Doughnut
            data={unconfirmed_appointments}
            options={options_unconfirmed}
          />
        </div>
      </div>
    </>
  );
}

export default DoctorsBar;
