import { Appointments, doctor, service } from "@/Types/types";
import React from "react";
import DoctorsPie from "./DoctorsPie";

interface Props {
  doctors: doctor[];
  appointments: Appointments[];
  services: service[];
}

function DoctorsOverview(props: Props) {
  // Calculate the total number of doctors
  const totalDoctors: number = props.doctors.length;

  // Calculate the total number of appointments
  const totalAppointments: number = props.appointments.length;

  // Initialize an object to store service costs
  const costs: { [serviceId: string]: number } = {};

  // Populate service costs in the 'costs' object
  for (let service of props.services) {
    if (!(service._id in costs)) {
      costs[service._id] = service.price;
    }
  }

  // Initialize arrays to store various data related to doctors and appointments
  const data: { doctorName: string; appointmentsCount: number }[] = [];
  const data_2: { doctorName: string; earning: number }[] = [];
  const data_3: { doctorName: string; unpaidAppointments: number }[] = [];
  const data_4: {
    doctorName: string;
    unConfirmedAppointments: number;
    confirmedAppointments: number;
  }[] = [];

  // Calculate the total number of unpaid appointments and unconfirmed appointments
  const allUnpaid: number = props.appointments.filter((e) => !e.paid).length;
  const allUnconfirmed: number = props.appointments.filter(
    (e) => !e.confirmed
  ).length;

  // Iterate through each doctor
  for (let doctor of props.doctors) {
    // Count total appointments for the current doctor
    const count: number = props.appointments.filter(
      (e) => e.doctors._ref === doctor._id
    ).length;

    // Count unpaid appointments for the current doctor
    const unpaidCount: number = props.appointments.filter(
      (e) => !e.paid && e.doctors._ref === doctor._id
    ).length;

    // Count unconfirmed appointments for the current doctor
    const unconfirmedCount: number = props.appointments.filter(
      (e) => !e.confirmed && e.doctors._ref === doctor._id
    ).length;

    // Push data related to unpaid appointments for the current doctor
    data_3.push({
      doctorName: doctor.fullName,
      unpaidAppointments: +(unpaidCount / allUnpaid).toFixed(2),
    });

    // Push data related to unconfirmed and confirmed appointments for the current doctor
    data_4.push({
      doctorName: doctor.fullName,
      unConfirmedAppointments: +(unconfirmedCount / allUnconfirmed).toFixed(2),
      confirmedAppointments: +(1 - unconfirmedCount / allUnconfirmed).toFixed(
        2
      ),
    });

    // Push data related to total appointments for the current doctor
    data.push({
      doctorName: doctor.fullName,
      appointmentsCount: +(count / totalAppointments).toFixed(2) * 100,
    });
  }

  // Filter paid appointments
  const filterPaidAppointments = props.appointments.filter((e) => e.paid);

  // Iterate through each doctor to calculate earnings
  for (let doctor of props.doctors) {
    let earning: number = 0;

    // Filter paid appointments for the current doctor
    filterPaidAppointments
      .filter((e) => e.doctors._ref === doctor._id)
      .map((a) => {
        // Get the reference and cost of the service for the current appointment
        const refA: string = a.service._ref;
        const costA: number = a.amount || costs[refA];
        // Add the cost to the total earnings for the current doctor
        earning += costA;
      });

    // Push data related to earnings for the current doctor
    data_2.push({ doctorName: doctor.fullName, earning: earning });
  }

  return (
    <section className="patient_Overview w-full h-full shadow p-2 flex flex-col items-center gap-2">
      <div className="stats border  border-solid border-gray-500 max-w-fit mb-2">
        <div className="stat place-items-center">
          <div className="stat-title">Total des Médecins</div>
          <div className="stat-value"> {totalDoctors} </div>
        </div>
      </div>
      <DoctorsPie data_4={data_4} data_3={data_3} data_2={data_2} data={data} />
    </section>
  );
}

export default DoctorsOverview;
