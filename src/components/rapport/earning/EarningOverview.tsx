import { Appointments, service } from "@/Types/types";
import React from "react";
import EarningCharts from "./EarningCharts";
import { Tooltip } from "@mui/material";

interface Props {
  appointments: Appointments[];
  services: service[];
}

function EarningOverview(props: Props) {
  const { appointments, services } = props;
  const costs: any = {};

  for (let service of services) {
    if (!(service._id in costs)) {
      costs[service._id] = service.price;
    }
  }

  const ongoing = props.appointments.filter(
    (e) => new Date(e.end) > new Date() && new Date(e.start) < new Date()
  );

  const currentMonth = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear &&
      e.paid
    );
  });

  const currentMonthButNoFilter = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear
    );
  });

  const currentDate = new Date();
  const firstDayOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Calculate the first day of the previous month
  const firstDayOfPastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1 >= 0 ? currentDate.getMonth() - 1 : 11, // Adjust for January (0-based)
    1
  );

  const pastMonth = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    return (
      appointmentDate >= firstDayOfPastMonth &&
      appointmentDate < firstDayOfCurrentMonth &&
      e.paid
    );
  });

  let currentMonthEarning = 0;
  let currentMonthLoan = 0;
  // meaning the confirmed but not paid
  currentMonth.length > 0
    ? currentMonth.map((a, i) => {
        const costA = a.amount || costs[a.service._ref];
        return (currentMonthEarning += costA);
      })
    : 0;
  currentMonthButNoFilter
    .filter((e) => e.confirmed && !e.paid)
    .map((a) => {
      const costA = a.amount || costs[a.service._ref];
      return (currentMonthLoan += costA);
    });
  let pastMonthEarning = 0;

  pastMonth.length > 0
    ? pastMonth.map((a, i) => {
        const costA = a.amount || costs[a.service._ref];
        return (pastMonthEarning += costA);
      })
    : 0;

  return (
    <section className="flex items-center gap-1 mt-6">
      <div className="flex items-center gap-1 flex-col w-full max-w-[237.19px]">
        <div className="stats w-full border border-solid border-gray-500 mb-2">
          <div className="stat place-items-center">
            <div className="stat-title">Gains du Mois en Cours</div>
            <div className="stat-value">{currentMonthEarning}Dh</div>
          </div>
        </div>
        <Tooltip
          arrow
          placement="right-start"
          title={"Le montant confirmé mais non payé ce mois-ci"}
        >
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title capitalize">Prêt du mois en cours</div>
              <div className="stat-value">{currentMonthLoan}Dh</div>
            </div>
          </div>
        </Tooltip>
        <div className="stats w-full border border-solid border-gray-500 mb-2">
          <div className="stat place-items-center">
            <div className="stat-title">Rendez-vous en cours</div>
            <div className="stat-value">{ongoing.length}</div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <EarningCharts
          earningCurrentMonth={currentMonthEarning as number}
          earningPastMonth={pastMonthEarning as number}
        />
      </div>
    </section>
  );
}

export default EarningOverview;
