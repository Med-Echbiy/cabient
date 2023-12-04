import { Client } from "@/Types/types";
import React, { useState } from "react";
import Button from "./Button";
import { BsGenderMale, BsGenderFemale, BsPencil } from "react-icons/bs";
import { FaPerson } from "react-icons/fa6";
import Link from "next/link";
import { Dialog } from "@mui/material";
import UpdatePatient from "./client/UpdatePatient";
import { calculateAge } from "../Crud";

interface props {
  client: Client;
  index: number;
}
function PatientCell(props: props) {
  const [open, setOpen] = useState(false);
  const close = (e: boolean) => {
    setOpen(e);
  };
  return (
    <>
      <tr className="capitalize">
        <th>{props.index + 1}</th>
        <td
          className="tooltip tooltip-top cursor-pointer"
          data-tip="cliquez pour visiter"
        >
          {/* Lien vers la page de détails du patient */}
          <Link href={`/patients/${props.client._id}`}>
            {props.client.fullName}
          </Link>
        </td>
        <td>{calculateAge(props.client.dateOfBirth as Date)}</td>
        <td className="flex items-center gap-2">
          <span>
            {props.client.gender === "male" ? (
              <BsGenderMale />
            ) : props.client.gender === "female" ? (
              <BsGenderFemale />
            ) : (
              ""
            )}
          </span>
          {/* Affichage du genre du patient */}
          {props.client.gender === "male" ? "homme" : "femme"}
        </td>
        <td>🇲🇦 +{props.client.phone}</td>
        <td className="flex items-center gap-2">
          {/* Bouton pour afficher les détails du patient */}
          <Button fullName={props.client.fullName} id={props.client._id} />
          {/* Bouton pour ouvrir la boîte de dialogue de mise à jour */}
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm bg-violet-600 hover:bg-violet-600 text-white flex items-center gap-2"
          >
            Mettre à jour
            <span>
              <BsPencil />
            </span>
          </button>
        </td>
      </tr>
      {/* Boîte de dialogue pour mettre à jour les informations du patient */}
      <Dialog maxWidth="md" onClose={() => setOpen(false)} open={open}>
        <UpdatePatient close={close} patient={props.client} />
      </Dialog>
    </>
  );
}

export default PatientCell;
