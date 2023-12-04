import { Client } from "@/Types/types";
import React from "react";
import PatientPie from "./PatientPie";
import { calculateAge } from "../../Crud";

interface Props {
  patients: Client[];
}

function PatientOverview(props: Props) {
  // Calculate the total number of patients
  const totalPatients: number = props.patients.length;

  // Initialize objects to store age and gender distributions
  const ageDistribution: { "<18": number; "18-40": number; ">40": number } = {
    "<18": 0,
    "18-40": 0,
    ">40": 0,
  };
  const genderDistribution: { female: number; male: number } = {
    female: 0,
    male: 0,
  };

  // Iterate through each patient
  for (let patient of props.patients) {
    // Calculate the age of the current patient using a helper function (calculateAge)
    const age: number = calculateAge(patient.dateOfBirth as Date);

    // Update gender distribution based on the gender of the current patient
    if (patient.gender === "female") {
      genderDistribution.female += 1;
    } else {
      genderDistribution.male += 1;
    }

    // Update age distribution based on the age of the current patient
    if (age < 18) {
      ageDistribution["<18"] += 1;
    } else if (age > 40) {
      ageDistribution[">40"] += 1;
    } else {
      ageDistribution["18-40"] += 1;
    }
  }

  return (
    <section className="w-full patient_Overview shadow p-2 flex flex-col items-center gap-2">
      <div className="stats border border-solid border-gray-500 max-w-fit mb-2">
        <div className="stat place-items-center">
          <div className="stat-title">Total des Patients</div>
          <div className="stat-value"> {totalPatients} </div>
        </div>
      </div>
      <PatientPie
        ageDistribution={ageDistribution}
        genderDistribution={genderDistribution}
      />
    </section>
  );
}

export default PatientOverview;
