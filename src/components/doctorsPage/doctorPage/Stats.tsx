import { Appointments, service as Service } from "@/Types/types";
import React, { Suspense, useState } from "react";
import { getServices } from "../../../../sanity/lib/client";
import AppointmentForm from "@/components/appoitnments/add/AppointmentForm";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { BORDERS_COLORS, COLORS } from "@/components/rapport/general";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Stats({
  doctorAppointment,
  allServices,
}: {
  doctorAppointment: Appointments[];
  allServices: Service[];
}) {
  let services: { [service_id: string]: Service | undefined } = {};

  allServices.forEach((e) => {
    services[e._id] = e;
  });
  //
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);
  console.log({ today, yesterday, dayBeforeYesterday });
  let todayEarning = 0;
  let pastDayEarning = 0;
  let pastPastDayEarning = 0;
  let currentMonthEarning = 0;
  let totalEarning = 0;

  doctorAppointment
    .filter((e) => e.paid)
    .forEach((a) => {
      const appointmentDate = new Date(a.start);
      const cost =
        (a.amount as number) || (services[a.service._ref]?.price as number);
      totalEarning += cost;

      // Check for current month
      if (appointmentDate.getFullYear() === today.getFullYear()) {
        if (appointmentDate.getMonth() === today.getMonth()) {
          currentMonthEarning += cost;
          // Check for today
          if (appointmentDate.getDate() === today.getDate()) {
            todayEarning += cost;
          }

          // Check for past day
          else if (appointmentDate.getDate() === yesterday.getDate()) {
            console.log("past day");
            pastDayEarning += cost;
          }

          // Check for past past day
          else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
            pastPastDayEarning += cost;
          }
        } else if (appointmentDate.getMonth() === yesterday.getMonth()) {
          // Check for past day
          if (appointmentDate.getDate() === yesterday.getDate()) {
            console.log("past day");
            pastDayEarning += cost;
          }

          // Check for past past day
          else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
            pastPastDayEarning += cost;
          }
        }
      } else if (appointmentDate.getFullYear() === yesterday.getFullYear()) {
        if (appointmentDate.getDate() === yesterday.getDate()) {
          console.log("past day");
          pastDayEarning += cost;
        }

        // Check for past past day
        else if (appointmentDate.getDate() === dayBeforeYesterday.getDate()) {
          pastPastDayEarning += cost;
        }
      }
    });
  const data: ChartData<"bar"> = {
    labels: ["Avant-hier", "Hier", "Aujourd'hui"],
    datasets: [
      {
        label: "Revenus",
        data: [pastPastDayEarning, pastDayEarning, todayEarning],
        borderColor: BORDERS_COLORS,
        backgroundColor: COLORS,
        borderWidth: 3,
      },
    ],
  };
  const max = Math.max(...[pastDayEarning, todayEarning, pastPastDayEarning]);
  const [padiNotConfirmed] = useState(
    doctorAppointment.filter(
      (e) =>
        e.paid &&
        !e.confirmed &&
        new Date().toLocaleDateString() ===
          new Date(e.start).toLocaleDateString()
    )
  );
  const [todayAppointments] = useState(
    doctorAppointment.filter(
      (e) =>
        new Date().toLocaleDateString() ===
        new Date(e.start).toLocaleDateString()
    )
  );
  return (
    <div className="p-3 shadow w-full h-full flex justify-between flex-col items-center mx-auto card">
      <div className="stats shadow mx-auto">
        <div className="stat place-items-center">
          <div className="stat-title">Revenus des 2 derniers mois.</div>
          <div className="stat-value">
            {totalEarning - currentMonthEarning}Dh{" "}
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Mois en cours</div>
          <div className="stat-value text-orange-600">
            {currentMonthEarning}Dh
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Aujourd&apos;hui </div>
          <div className="stat-value text-primary"> {todayEarning}Dh </div>
        </div>
      </div>
      <div className="flex items-center w-full lg:max-w-[75%]">
        <Bar
          options={{
            animation: false,
            scales: {
              y: {
                min: 0,
                max: max + 200,
              },
            },
            plugins: {
              title: {
                text: "Revenus",
                display: true,
              },
              legend: {
                display: false,
              },
            },
          }}
          data={data}
        />
      </div>
      <div>
        <p className="my-6 text-3xl text-center">
          Rendez-vous aujourd&apos;hui
        </p>
        <div className="stats shadow mx-auto">
          <div className="stat place-items-center min-w-[200px]">
            <div className="stat-title"> Total </div>
            <div className="stat-value text-neutral">
              {todayAppointments.length}
            </div>
          </div>

          <div className="stat place-items-center min-w-[200px] ">
            <div className="stat-title"> Payé non confirmé </div>
            <div className="stat-value text-error">
              {padiNotConfirmed.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
