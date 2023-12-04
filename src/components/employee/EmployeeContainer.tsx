"use client";
import { employee } from "@/Types/types";
import useOverlay from "@/store/overlayToggle";
import {
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmployeeCell from "./EmployeeCell";
import { validateEmployee } from "../validation";
import { createEmployee } from "../Crud";
import { client } from "../../../sanity/lib/client";

function EmployeeContainer({ employee }: { employee: employee[] }) {
  const { toggleOverlayStatu } = useOverlay();
  const [workers, setWorkers] = useState(employee);
  useEffect(() => {
    console.log("doctors:", workers);
  }, [workers]);
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(15);
  // Step 2: Calculate the index of the last client on the current page
  const indexOfLastClient = currentPage * clientsPerPage;
  // Calculate the index of the first client on the current page
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  // calculate total pages
  const totalPages = Math.ceil(workers.length / clientsPerPage);
  // Get the clients for the current page
  const currentClients = workers.slice(indexOfFirstClient, indexOfLastClient);

  //
  const [error, setError] = useState("");
  //
  const [worker, setWorker] = useState<employee>({
    fullName: "",
    _id: `employee_${nanoid(20)}`,
    password: "",
    role: undefined,
    _type: "employee",
  });
  //

  useEffect(() => {
    setError("");
  }, [worker]);
  useEffect(() => {
    setWorker((pre) => ({
      ...pre,
      fullName: "",
      password: "",
      role: undefined,
      _id: `employee_${nanoid(20)}`,
    }));
  }, [open]);
  //
  const handleChange = (
    name: "fullName" | "password" | "role",
    value: string | number
  ) => {
    setWorker((pre) => ({ ...pre, [name]: value }));
  };
  const handleAddEmployee = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Création d'un employé en cours...");
      const validation = validateEmployee(worker);
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await createEmployee(worker);
      if (res) {
        toast.dismiss();
        toast.success("Employé créé avec succès !");
        setWorkers((e) => [...e, worker]);
        console.log(workers);
        setOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
    } finally {
      toggleOverlayStatu();
    }
  };

  const handleUpdateEmployee = (update: employee) => {
    const updatedDoctors = workers.map((e) => {
      if (e._id === update._id) {
        return update;
      }
      return e;
    });
    setWorkers(updatedDoctors);
  };
  const handleDelete = async (id: string) => {
    try {
      toast.loading("Suppression en cours...");
      const req = await client.delete(id);
      if (req) {
        const update = workers.filter((e) => e._id !== id);
        setWorkers(update);
        toast.dismiss();
        toast.success("Terminé !");
      } else {
        throw Error("Oups");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups");
      console.log(error);
    }
  };

  return (
    <div>
      <div className=" my-3 flex items-center lg:justify-center">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center capitalize gap-2 btn-primary btn"
          >
            <span>Ajouter employé</span>
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
              <th>Rôle</th>
              <th>Mot de passe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((e, i) => (
              <EmployeeCell
                update={handleUpdateEmployee}
                worker={e}
                index={i}
                key={e._id + "rerererrr"}
                delete={handleDelete}
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
              value={worker.fullName}
              onChange={(e) =>
                handleChange("fullName", e.target.value.toLocaleLowerCase())
              }
              label="Nom complet"
            />

            <TextField
              type="password"
              value={worker.password}
              onChange={(e) =>
                handleChange("password", e.target.value.toLocaleLowerCase())
              }
              label="Mot de passe"
            />
            <FormControl fullWidth>
              <InputLabel>Sélectionnez le rôle</InputLabel>
              <Select
                required
                name="role"
                onChange={(e) => handleChange("role", e.target.value as string)}
                label="Sélectionnez le rôle"
                value={worker.role}
              >
                <MenuItem value="" disabled>
                  Quel est votre rôle
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="secrétaire">Secrétaire</MenuItem>
              </Select>
            </FormControl>
            <button
              onClick={() => handleAddEmployee()}
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

export default EmployeeContainer;
