import { doctor, employee } from "@/Types/types";
import {
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BsCheck,
  BsEye,
  BsEyeSlash,
  BsGenderFemale,
  BsGenderMale,
  BsPencil,
  BsTrash,
  BsXCircle,
} from "react-icons/bs";
import { validateDoctor, validateEmployee } from "../validation";
import toast from "react-hot-toast";
import useOverlay from "@/store/overlayToggle";
import { updateEmployee } from "../Crud";

interface props {
  worker: employee;
  index: number;
  update: (update: employee) => void;
  delete: (id: string) => void;
}

function EmployeeCell(props: props) {
  const { toggleOverlayStatu } = useOverlay();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [worker, setWorker] = useState<employee>({
    fullName: props.worker.fullName,
    _id: props.worker._id,
    password: props.worker.password,
    role: props.worker.role,
    _type: "employee",
  });
  useEffect(() => {
    setError("");
  }, [worker]);
  useEffect(() => {
    setError("");
    setWorker({
      password: props.worker.password,
      fullName: props.worker.fullName,
      _id: props.worker._id,
      _type: "employee",
      role: props.worker.role,
    });
  }, [open]);
  const handleChange = (
    name: "fullName" | "role" | "password",
    value: string | number | boolean
  ) => {
    setWorker((pre) => ({ ...pre, [name]: value }));
  };
  const updateEmployeeFunc = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour de l'employé en cours...");
      const validation = validateEmployee(worker);
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await updateEmployee(worker);
      if (res) {
        toast.dismiss();
        toast.success("Employé mis à jour avec succès !");
        props.update(worker);
        setOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
    } finally {
      toggleOverlayStatu();
    }
  };

  const [show, setShow] = useState(false);

  return (
    <tr>
      <th>{props.index + 1}</th>
      <td
        className="tooltip tooltip-top cursor-pointer"
        data-tip="cliquez pour visiter"
      >
        <p className="capitalize">{props.worker.fullName.toLowerCase()}</p>
      </td>
      <td>{props.worker.role}</td>
      <td className="capitalize ">
        <div className="flex items-center gap-4 ">
          <span>{show ? props.worker.password : "******"}</span>
          <span
            onClick={() => setShow((pre) => !pre)}
            className=" cursor-pointer"
          >
            {!show ? <BsEye /> : <BsEyeSlash />}
          </span>
        </div>
      </td>
      <td className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="btn btn-sm bg-violet-600 hover:bg-violet-600 text-white  flex items-center gap-2"
        >
          Mettre à jour
          <span>
            <BsPencil />
          </span>
        </button>
        <button
          onClick={() => props.delete(props.worker._id)}
          className="btn btn-sm bg-red-600 hover:bg-red-600 text-white  flex items-center gap-2"
        >
          Supprimer
          <span>
            <BsTrash />
          </span>
        </button>
      </td>
      <Dialog maxWidth="xs" open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex relative items-center justify-center p-12">
          <section className="flex max-w-[300px] w-full items-center capitalize gap-3 flex-col ">
            <div
              onClick={() => setOpen(false)}
              className="btn btn-circle btn-sm text-sm absolute top-3 right-2 btn-error btn-outline"
            >
              X
            </div>
            <div className="mb-4 capitalize text-xl">
              Mettre à jour l&apos;employé
            </div>
            <div className="divider"></div>
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
              onChange={(e) => handleChange("password", e.target.value)}
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
              onClick={updateEmployeeFunc}
              className="btn btn-primary mt-4"
            >
              Mettre à jour
            </button>
            {error && (
              <p className="text-center max-w-[300px] text-error text-sm">
                {error}
              </p>
            )}
          </section>
        </div>
      </Dialog>
    </tr>
  );
}

export default EmployeeCell;
