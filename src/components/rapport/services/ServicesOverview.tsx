import { Appointments, service } from "@/Types/types";
import React from "react";
import ServiceCharts from "./ServiceCharts";
import ServiceBar from "./ServiceBar";

interface props {
  services: service[];
  appointments: Appointments[];
}
interface AppointmentData {
  total: number;
  paid: number;
  unpaid: number;
  confirmed: number;
  unConfirmed: number;
}

export interface AppointmentsPerService {
  [serviceName: string]: AppointmentData;
}
function ServicesOverview(props: props) {
  // Calculate the total number of services
  const totalServices: number = props.services.length;

  // Calculate the total number of unpaid appointments
  const totalUnpaidAppointments: number = props.appointments.filter(
    (e) => !e.paid
  ).length;

  // Calculate the total number of unconfirmed appointments
  const totalUnconfirmedAppointments: number = props.appointments.filter(
    (e) => !e.confirmed
  ).length;

  // Initialize an object to store appointment data per service
  const appointmentsPerService: Record<string, any> = {};

  // Initialize variables to track the most used and most confirmed services
  let mostUsedService: { serviceName: string; count: number } = {
    serviceName: "",
    count: -1,
  };
  let mostConfirmedService: { serviceName: string; count: number } = {
    serviceName: "",
    count: -1,
  };

  // Iterate through each service
  props.services.forEach((service) => {
    // Filter appointments for the current service
    const serviceAppointments = props.appointments.filter(
      (e) => e.service._ref === service._id
    );

    // Calculate counts for total, paid, and confirmed appointments
    const count: number = serviceAppointments.length;
    const paidCount: number = serviceAppointments.filter((e) => e.paid).length;
    const confirmedCount: number = serviceAppointments.filter(
      (e) => e.confirmed
    ).length;

    // Update the most used service if needed
    if (mostUsedService.count < count) {
      mostUsedService = { serviceName: service.service_name, count };
    }

    // Update the most confirmed service if needed
    if (mostConfirmedService.count < confirmedCount) {
      mostConfirmedService = {
        serviceName: service.service_name,
        count: confirmedCount,
      };
    }

    // Calculate and store appointment percentages per service
    const compose = {
      total: count,
      paid: +((paidCount / totalUnpaidAppointments) * 100).toFixed(2),
      unpaid: +(((count - paidCount) / totalUnpaidAppointments) * 100).toFixed(
        2
      ),
      unConfirmed: +(
        ((count - confirmedCount) / totalUnconfirmedAppointments) *
        100
      ).toFixed(2),
      confirmed: +(
        (confirmedCount / totalUnconfirmedAppointments) *
        100
      ).toFixed(2),
    };

    appointmentsPerService[service.service_name] = compose;
  });

  // Initialize arrays to store services' performance and earnings data
  let servicesPerformance: {
    serviceName: string;
    data: { pastPastMonth: number; pastMonth: number; currentMonth: number };
  }[] = [];
  let serviceEarnings: {
    serviceName: string;
    data: { pastPastMonth: number; pastMonth: number; currentMonth: number };
  }[] = [];

  // Initialize variables to track total earnings, lost earnings, and loans
  let totalEarning: number = 0;
  let totalLostEarnings: number = 0;
  let totalLoan: number = 0;

  // Iterate through each service for additional performance and earnings calculations
  props.services.forEach((service) => {
    props.appointments
      .filter((e) => e.service._ref === service._id)
      .forEach((a) => {
        const cost = a.amount || service.price;
        if (a.confirmed && !a.paid) {
          totalLoan += cost;
        } else if (!a.confirmed && !a.paid) {
          totalLostEarnings += cost;
        } else {
          totalEarning += cost;
        }
      });
    // Update total loan based on service price and confirmed unpaid appointments
    // totalLoan += service.price * confirmedUnpaidAppointments.length;

    // // Update total lost earnings based on service price and unpaid appointments percentage
    // totalLostEarnings += +(
    //   (appointmentsPerService[service.service_name].unpaid / 100) *
    //   totalUnpaidAppointments *
    //   service.price
    // ).toFixed(0);

    // // Update total earnings based on service price and paid appointments percentage
    // totalEarning += +(
    //   (appointmentsPerService[service.service_name].paid / 100) *
    //   totalUnpaidAppointments *
    //   service.price
    // ).toFixed(0);

    // Date calculations for filtering appointments
    const currentDate: Date = new Date();
    const firstDayOfCurrentMonth: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfPastMonth: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1 >= 0 ? currentDate.getMonth() - 1 : 11,
      1
    );
    const firstDayOfPast2Month: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 2 >= 0 ? currentDate.getMonth() - 2 : 10,
      1
    );

    // Function to filter appointments based on a date filter
    const filterAppointments = (dateFilter: (date: Date) => boolean) =>
      props.appointments.filter(
        (e) => dateFilter(new Date(e.start)) && service._id === e.service._ref
      );

    // Filter appointments for the current, past, and past-past months
    const currentMonthAppointments = filterAppointments(
      (appointmentDate) =>
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear()
    );
    const pastMonthAppointments = filterAppointments(
      (appointmentDate) =>
        appointmentDate >= firstDayOfPastMonth &&
        appointmentDate < firstDayOfCurrentMonth
    );
    const past2MonthAppointments = filterAppointments(
      (appointmentDate) =>
        appointmentDate >= firstDayOfPast2Month &&
        appointmentDate < firstDayOfPastMonth
    );

    // Compose performance data for the current service
    const composePerformance = {
      serviceName: service.service_name,
      data: {
        currentMonth: currentMonthAppointments.length,
        pastMonth: pastMonthAppointments.length,
        pastPastMonth: past2MonthAppointments.length,
      },
    };

    // Compose earnings data for the current service
    const composeEarnings = {
      serviceName: service.service_name,
      data: {
        currentMonth:
          currentMonthAppointments.filter((e) => e.paid).length * service.price,
        pastMonth:
          pastMonthAppointments.filter((e) => e.paid).length * service.price,
        pastPastMonth:
          past2MonthAppointments.filter((e) => e.paid).length * service.price,
      },
    };

    // Push data to respective arrays
    servicesPerformance.push(composePerformance);
    serviceEarnings.push(composeEarnings);
  });

  return (
    <main>
      <section className="flex items-center gap-1 mt-6">
        <div className="flex items-center gap-1 flex-col w-full max-w-[237.19px]">
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Total des Services</div>
              <div className="stat-value">{totalServices}</div>
            </div>
          </div>
          <div className="stats w-full border overflow-hidden border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Service le Plus Réservé</div>
              <div
                className={`stat-value text-3xl ${
                  mostUsedService.serviceName.length > 12 && "text-xl"
                }`}
              >
                {mostUsedService.serviceName.length > 16
                  ? `${mostUsedService.serviceName.slice(0, 16)}...`
                  : mostUsedService.serviceName}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <ServiceCharts
            mode="appointments"
            servicesData={servicesPerformance}
          />
        </div>
      </section>
      <section className="flex items-center gap-1 mt-6">
        <div className="flex items-center gap-1 flex-col w-full max-w-[237.19px]">
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Total Gains </div>
              <div className="stat-value">{totalEarning}Dh</div>
            </div>
          </div>
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Prêt Total </div>
              <div className="stat-value">{totalLoan}Dh</div>
            </div>
          </div>
          <div className="stats w-full border border-solid overflow-hidden border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Service le Plus Confirmé</div>
              <div
                className={`stat-value text-3xl ${
                  mostConfirmedService.serviceName.length > 12 && "text-xl"
                }`}
              >
                {mostConfirmedService.serviceName.length > 16
                  ? `${mostConfirmedService.serviceName.slice(0, 16)}...`
                  : mostConfirmedService.serviceName}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <ServiceCharts mode="earnings" servicesData={serviceEarnings} />
        </div>
      </section>
      <section className="flex items-center gap-1 mt-6">
        <div className="flex items-center gap-1 flex-col w-full max-w-[237.19px]">
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title text-xs overflow-hidden">
                Total des Rendez. Non Confirmés
              </div>
              <div className="stat-value">
                {(
                  (totalUnconfirmedAppointments / props.appointments.length) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
          </div>
          <div className="stats w-full border border-solid border-gray-500 mb-2">
            <div className="stat place-items-center">
              <div className="stat-title">Gains Perdus</div>
              <div className="stat-value text-3xl">{totalLostEarnings}Dh</div>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <ServiceBar data={appointmentsPerService} />
        </div>
      </section>
    </main>
  );
}

export default ServicesOverview;
