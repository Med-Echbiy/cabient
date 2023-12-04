"use client";
import { doctor, service } from "@/Types/types";
import React, { useEffect, useState } from "react";
import DoctorCell from "./DoctorCell";
import { BsTrash } from "react-icons/bs";
import { Dialog, TextField } from "@mui/material";
import { nanoid } from "nanoid";
import { client } from "../../../sanity/lib/client";
import { createDoctor } from "../Crud";
import toast from "react-hot-toast";
import useOverlay from "@/store/overlayToggle";
import { validateDoctor } from "../validation";
import { getSession, useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface props {
  doctors: doctor[];
}

function DoctorsContainer(props: props) {
  // const session = useSession();
  const { toggleOverlayStatu } = useOverlay();
  const [doctors, setDoctors] = useState(props.doctors);
  useEffect(() => {
    console.log("doctors:", doctors);
  }, [doctors]);
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(15);
  // Step 2: Calculate the index of the last client on the current page
  const indexOfLastClient = currentPage * clientsPerPage;
  // Calculate the index of the first client on the current page
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  // calculate total pages
  const totalPages = Math.ceil(doctors.length / clientsPerPage);
  // Get the clients for the current page
  const currentClients = doctors.slice(indexOfFirstClient, indexOfLastClient);

  //
  const [error, setError] = useState("");
  //
  const [doctor, setDoctor] = useState<doctor>({
    email: "",
    fullName: "",
    _id: `doctor_${nanoid(20)}`,
    isDeleted: false,
    phone: undefined,
    status: true,
  });
  //

  useEffect(() => {
    setError("");
  }, [doctor]);
  useEffect(() => {
    setDoctor((pre) => ({
      ...pre,
      phone: undefined,
      fullName: "",
      email: "",
      _id: `doctor_${nanoid(20)}`,
    }));
  }, [open]);
  //
  const handleChange = (
    name: "fullName" | "phone" | "email",
    value: string | number
  ) => {
    setDoctor((pre) => ({ ...pre, [name]: value }));
  };
  const handleAddDoctor = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Création d'un Médecin...");
      const validation = validateDoctor(doctor);
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await createDoctor(doctor);
      if (res) {
        toast.dismiss();
        toast.success("Médecin créé avec succès!");
        setDoctors((e) => [...e, { ...doctor, phone: +`${doctor.phone}` }]);
        console.log(doctors);
        setOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups!");
    } finally {
      toggleOverlayStatu();
    }
  };
  const handleUpdateDoctor = (update: doctor) => {
    const updatedDoctors = doctors.map((e) => {
      if (e._id === update._id) {
        return update;
      }
      return e;
    });
    setDoctors(updatedDoctors);
  };

  return (
    <div>
      <div className=" my-3 flex items-center lg:justify-center">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 btn-primary btn"
          >
            <span>Ajouter Médecin</span>
            <span>+</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`table table-zebra table-sm lg:table-md 2xl:table-lg`}
        >
          {/* en-tête */}
          <thead>
            <tr className="">
              <th className=""></th>
              <th>Nom complet</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((e, i) => (
              <DoctorCell
                update={handleUpdateDoctor}
                doctor={e}
                index={i}
                key={e._id + "rererer"}
              />
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
      <Dialog maxWidth="xs" open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex relative items-center justify-center p-12">
          <section className="flex max-w-[300px] w-full items-center capitalize gap-3 flex-col ">
            <div
              onClick={() => setOpen(false)}
              className="btn btn-circle btn-sm text-sm absolute top-3 right-2 btn-error btn-outline"
            >
              X
            </div>
            <div className="mb-4 capitalize text-xl">Ajouter Médecin</div>
            <div className=" divider"></div>
            <TextField
              value={doctor.fullName}
              onChange={(e) =>
                handleChange("fullName", e.target.value.toLocaleLowerCase())
              }
              label="Nom complet"
            />
            <TextField
              value={doctor.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              type="number"
              label="Téléphone"
            />
            <TextField
              value={doctor.email}
              onChange={(e) =>
                handleChange("email", e.target.value.toLocaleLowerCase())
              }
              label="Email"
              type="email"
            />
            <button
              onClick={() => handleAddDoctor()}
              className="btn btn-primary mt-4"
            >
              Ajouter +
            </button>
            {error && (
              <p className="text-center max-w-[300px] text-error text-sm">
                {error}
              </p>
            )}
          </section>
        </div>
      </Dialog>
    </div>
  );
}

export default DoctorsContainer;
