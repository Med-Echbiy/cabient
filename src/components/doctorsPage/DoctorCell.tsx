import { doctor } from "@/Types/types";
import { Dialog, Switch, TextField } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BsCheck,
  BsGenderFemale,
  BsGenderMale,
  BsPencil,
  BsTrash,
  BsXCircle,
} from "react-icons/bs";
import { validateDoctor } from "../validation";
import toast from "react-hot-toast";
import useOverlay from "@/store/overlayToggle";
import { updateDoctor as updateDoctorFun } from "../Crud";

interface props {
  doctor: doctor;
  index: number;
  update: (update: doctor) => void;
}

function DoctorCell(props: props) {
  const { toggleOverlayStatu } = useOverlay();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [doctor, setDoctor] = useState<doctor>({
    email: props.doctor.email,
    fullName: props.doctor.fullName,
    _id: props.doctor._id,
    isDeleted: false,
    phone: props.doctor.phone,
    status: props.doctor.status,
  });
  useEffect(() => {
    setError("");
  }, [doctor]);
  useEffect(() => {
    setError("");
    setDoctor({
      email: props.doctor.email,
      fullName: props.doctor.fullName,
      _id: props.doctor._id,
      isDeleted: false,
      phone: props.doctor.phone,
      status: props.doctor.status,
    });
  }, [open]);
  const handleChange = (
    name: "fullName" | "phone" | "email" | "status",
    value: string | number | boolean
  ) => {
    setDoctor((pre) => ({ ...pre, [name]: value }));
  };
  const updateDoctor = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour d'un Médecin...");
      const validation = validateDoctor(doctor, "edite");
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await updateDoctorFun(doctor);
      if (res) {
        toast.dismiss();
        toast.success("Médecin mis à jour avec succès!");
        props.update(doctor);
        setOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups!");
    } finally {
      toggleOverlayStatu();
    }
  };

  // Composant DoctorCell représentant une ligne dans le tableau pour un médecin
  return (
    <tr>
      <th>{props.index + 1}</th>
      <td
        className="tooltip tooltip-top cursor-pointer"
        data-tip="cliquez pour visiter"
      >
        {/* Lien vers la page de détails du médecin */}
        <Link className="capitalize" href={`/doctors/${props.doctor._id}`}>
          {props.doctor.fullName.toLowerCase()}
        </Link>
      </td>
      <td>🇲🇦 +{props.doctor.phone}</td>
      <td className="capitalize">
        {/* Affichage du statut du médecin */}
        {props.doctor.status ? (
          <p className="flex items-center gap-2">
            <span>Actif</span>
            <BsCheck />
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <span>Inactif</span>
            <BsXCircle />
          </p>
        )}
      </td>
      <td className="flex items-center gap-2">
        {/* Bouton pour ouvrir la boîte de dialogue de mise à jour */}
        <button
          onClick={() => setOpen(true)}
          className="btn btn-sm bg-violet-600 hover:bg-violet-600 text-white  flex items-center gap-2"
        >
          Mettre à jour
          <span>
            <BsPencil />
          </span>
        </button>
      </td>
      {/* Boîte de dialogue pour mettre à jour les informations du médecin */}
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
              Mettre à jour le médecin
            </div>
            <div className="divider"></div>
            {/* Champs de saisie pour mettre à jour les informations du médecin */}
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
            <div className="flex flex-col gap-1">
              {/* Interrupteur pour basculer le statut du médecin */}
              <Switch
                inputProps={{ "aria-label": "controlled" }}
                checked={doctor.status}
                onChange={(e) => handleChange("status", e.target.checked)}
              />
              <p> {doctor.status ? "actif" : "inactif"} </p>
            </div>
            {/* Bouton pour déclencher la mise à jour du médecin */}
            <button onClick={updateDoctor} className="btn btn-primary mt-4">
              Mettre à jour
            </button>
            {/* Afficher le message d'erreur s'il y a une erreur */}
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

export default DoctorCell;
