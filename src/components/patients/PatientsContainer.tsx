"use client";
import { Client } from "@/Types/types";
import React, { useEffect, useState } from "react";
import PatientsHeader from "./PatientsHeader";
import PatientCell from "./PatientCell";
import useDataStore from "@/store/data";
import { calculateAge } from "../Crud";

interface Props {
  clients: Client[];
}

function PatientsContainer(props: Props) {
  const { getClients, setClients, clients } = useDataStore();
  useEffect(() => {
    setClients(props.clients);
  }, [props.clients, setClients]);
  const [data, setData] = useState(props.clients);
  useEffect(() => {
    setData(getClients());
  }, [clients, getClients]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(15);
  // Step 2: Calculate the index of the last client on the current page
  const indexOfLastClient = currentPage * clientsPerPage;
  // Calculate the index of the first client on the current page
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  // calculate total pages
  const totalPages = Math.ceil(data.length / clientsPerPage);
  // Get the clients for the current page
  const currentClients = data.slice(indexOfFirstClient, indexOfLastClient);

  function handelFilter(
    name: { lable: "fullName" | "age" | "gender"; value: string }[]
  ) {
    let filterData: Client[] = getClients();
    if (name[0].lable === "fullName") {
      if (!name[0].value || name[0].value === "all") {
        filterData = filterData;
      } else {
        filterData = filterData.filter((e) =>
          e.fullName.startsWith(name[0].value as string)
        );
      }
      setData(filterData);
    }
    if (name[1].lable === "gender") {
      if (name[1].value === "all") {
        filterData = filterData;
      } else {
        filterData = filterData.filter((e) => e.gender === name[1].value);
      }
      setData(filterData);
    }
    if (name[2].lable === "age") {
      if (name[2].value === "all") {
        filterData = filterData;
      } else if (name[2].value === "<18") {
        filterData = filterData.filter(
          (e) => calculateAge(e.dateOfBirth as Date) <= 18
        );
      } else if (name[2].value === "18-35") {
        filterData = filterData.filter(
          (e) =>
            calculateAge(e.dateOfBirth as Date) >= 18 &&
            calculateAge(e.dateOfBirth as Date) <= 35
        );
      } else {
        filterData = filterData.filter(
          (e) => calculateAge(e.dateOfBirth as Date) >= 35
        );
      }
      setData(filterData);
    }
    setData(filterData);
  }
  const handleSort = (by: string) => {
    let sorted = getClients();
    if (by === "default") {
      sorted = data.sort((a, b) => {
        if (a.fullName < b.fullName) {
          return -1; // Name A comes before name B
        }
        if (a.fullName > b.fullName) {
          return 1; // Name A comes after name B
        }
        return 0; // Names are equal
      });
      setData(() => [...sorted]);
    } else if (by === "older-first") {
      sorted = data.sort((a, b) => {
        const ageA = calculateAge(a.dateOfBirth as Date);
        const ageB = calculateAge(b.dateOfBirth as Date);
        if (ageA > ageB) {
          return -1;
        }
        if (ageA < ageB) {
          return 1;
        }
        return 0;
      });
    } else if (by === "younger-first") {
      sorted = data.sort((a, b) => {
        const ageA = a.age as number;
        const ageB = b.age as number;
        if (ageA < ageB) {
          return -1;
        }
        if (ageA > ageB) {
          return 1;
        }
        return 0;
      });
    } else if (by === "male-first") {
      sorted = data.sort((a, b) => {
        if (a.gender === "male") {
          return -1;
        }
        if (a.gender === "female") {
          return 1;
        }
        return 0;
      });
    } else if (by === "female-first") {
      sorted = data.sort((a, b) => {
        if (a.gender === "male") {
          return 1;
        }
        if (a.gender === "female") {
          return -1;
        }
        return 0;
      });
    } else if (by === "last-created") {
      sorted = data.sort((a, b) => {
        const createdA = a._createdAt as string;
        const createdB = b._createdAt as string;
        if (new Date(createdA) > new Date(createdB)) {
          return 1;
        }
        if (new Date(createdA) < new Date(createdB)) {
          return -1;
        }
        return 0;
      });
    } else if (by === "new-created") {
      sorted = data.sort((a, b) => {
        const createdA = a._createdAt as string;
        const createdB = b._createdAt as string;
        if (new Date(createdA) > new Date(createdB)) {
          return -1;
        }
        if (new Date(createdA) < new Date(createdB)) {
          return 1;
        }
        return 0;
      });
      console.log(sorted[0]);
    }

    setData((pre) => [...sorted]);
  };
  return (
    <div className="py-6">
      <PatientsHeader
        handleSort={handleSort}
        handleFilter={handelFilter}
        clients={props.clients}
      />
      <div className="overflow-x-auto">
        <table className={`table table-zebra table-sm  lg:table-md`}>
          {/* tête */}
          <thead>
            <tr className="">
              <th className=""></th>
              <th>Nom complet</th>
              <th>Âge</th>
              <th>Genre</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((e, i) => (
              <PatientCell key={e._id + "z"} client={e} index={i} />
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center w-full my-4">
          <div className="join">
            <button
              disabled={currentPage === 1}
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage((pre) => pre - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-outline no-animation hover:bg-white hover:text-neutral">
              Page {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((pre) => pre + 1)}
              disabled={currentPage === totalPages}
              className="join-item btn btn-outline"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientsContainer;
