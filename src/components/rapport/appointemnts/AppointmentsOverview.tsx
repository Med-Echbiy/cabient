import { Appointments } from "@/Types/types";
import React from "react";
import AppointmentsCharts from "./AppointmentsCharts";

interface Props {
  appointments: Appointments[];
}

function AppointmentsOverview(props: Props) {
  // Destructure appointments from props
  const { appointments } = props;

  // Calculate the total number of appointments
  const totalAppointments: number = appointments.length;

  // Calculate the percentage of confirmed appointments
  const confirmedPercentage: string = (
    (appointments.filter((e) => e.confirmed).length / totalAppointments) *
    100
  ).toFixed(2);

  // Calculate the percentage of paid appointments
  const paidPercentage: string = (
    (appointments.filter((e) => e.paid).length / totalAppointments) *
    100
  ).toFixed(2);

  // Calculate the number of appointments in the current month
  const currentMonthAppointments: number = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return (
      appointmentDate.getMonth() === currentMonth &&
      appointmentDate.getFullYear() === currentYear
    );
  }).length;

  // Get the current date
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

  // Calculate the first day of the month before last
  let pastMonth = currentDate.getMonth() - 2;
  let pastYear = currentDate.getFullYear();

  if (pastMonth < 0) {
    pastMonth += 12;
    pastYear--;
  }

  const firstDayOfPast2Month = new Date(pastYear, pastMonth, 1);

  // Calculate the number of appointments in the past month
  const pastMonthAppointments: number = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    return (
      appointmentDate >= firstDayOfPastMonth &&
      appointmentDate < firstDayOfCurrentMonth
    );
  }).length;

  // Calculate the number of appointments in the month before last
  const past_2MonthAppointments: number = appointments.filter((e) => {
    const appointmentDate = new Date(e.start);
    return (
      appointmentDate >= firstDayOfPast2Month &&
      appointmentDate < firstDayOfPastMonth
    );
  }).length;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 flex-col max-w-fit">
        <div className="stats border border-solid border-gray-500 max-w-[235px] mb-2">
          <div className="stat place-items-center">
            <div className="stat-title">Total des Rendez-vous</div>
            <div className="stat-value"> {totalAppointments} </div>
          </div>
        </div>
        <div
          className="stats border border-solid border-gray-500 max-w-[235px] overflow-clip
         mb-2"
        >
          <div className="stat place-items-center">
            <div className="stat-title">Rendez-vous Confirmés</div>
            <div className="stat-value"> {confirmedPercentage}% </div>
          </div>
        </div>
        <div className="stats overflow-hidden border border-solid border-gray-500 w-full max-w-[235px] mb-2">
          <div className="stat place-items-center">
            <div className="stat-title">Rendez-vous Payé</div>
            <div className="stat-value"> {paidPercentage}% </div>
          </div>
        </div>
      </div>

      <div className="charts flex-grow">
        <AppointmentsCharts
          currentMonth={currentMonthAppointments}
          pastMonth={pastMonthAppointments}
          past_2Month={past_2MonthAppointments}
        />
      </div>
    </div>
  );
}

export default AppointmentsOverview;
