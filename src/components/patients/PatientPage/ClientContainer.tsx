"use client";
import { Client } from "@/Types/types";
import React, { useEffect, useState } from "react";
import Patient from "./Patient";
import MoreInfo from "./MoreInfo";
import { BsPencil, BsTrash } from "react-icons/bs";
import { client } from "../../../../sanity/lib/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogActions, DialogTitle, List } from "@mui/material";
import toast from "react-hot-toast";
import useOverlay from "@/store/overlayToggle";
import useDataStore from "@/store/data";
import UpdatePatient from "../client/UpdatePatient";

interface props {
  client: Client;
}

function ClientContainer(props: props) {
  const { getAppointments } = useDataStore();
  const router = useRouter();
  const [patient, setPatient] = useState(props.client);
  const { toggleOverlayStatu } = useOverlay();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleDelete = async () => {
    toggleOverlayStatu();
    const currentDate = new Date();
    try {
      toast.loading("suppression...");
      // Étape 2 : Supprimer chaque réservation
      const removalPromises = getAppointments()
        .filter((e) => currentDate < new Date(e.end))
        .map(async (reservation) => {
          // Remplacez 'deleteReservation' par la fonction réelle pour supprimer une réservation

          return await client.delete(reservation._id);
        });
      // Attendez que toutes les promesses de suppression soient terminées
      await Promise.all(removalPromises);
      const res = await client
        .patch(patient._id)
        .set({
          isDeleted: true,
        })
        .commit();
      if (res) {
        toast.dismiss();
        toast.success("supprimé");
        router.push("/patients");
      }
    } catch (error) {
      console.log(error);
      toast.error("Oups!");
    } finally {
      toggleOverlayStatu();
    }
  };

  const handleDialogUpdateClose = () => {
    setOpenUpdate(false);
  };

  return (
    <div className="flex w-full flex-col gap-2 max-w-[330px]">
      <div className="card w-full capitalize bg-base-100 shadow-xl">
        <Patient
          dataOfBirth={props.client.dateOfBirth as Date}
          fullName={patient.fullName}
          age={patient.age}
        />
        <div className="flex items-center gap-2 w-full justify-center mb-3">
          <button
            onClick={() => setOpen(true)}
            className="btn capitalize rounded-xl bg-red-500 text-white hover:bg-red-500 flex items-center gap-2"
          >
            <span>supprimer</span>
            <span>
              <BsTrash />
            </span>
          </button>
          <button
            onClick={() => setOpenUpdate(true)}
            className="btn capitalize rounded-xl bg-violet-500 text-white hover:bg-violet-500 flex items-center gap-2"
          >
            <span>modifier</span>
            <span>
              <BsPencil />
            </span>
          </button>
        </div>
      </div>
      <div className="flex-grow">
        <MoreInfo client={patient} />
      </div>
      {/* dialog delete */}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle className="text-center">
          <span>Confirmer la suppression</span>{" "}
          <span className="text-neutral capitalize">`{patient.fullName}`</span>
        </DialogTitle>
        <List>
          <div className="flex items-center gap-4 mb-4 justify-center w-full">
            <DialogActions>
              <button
                onClick={() => setOpen(false)}
                className="btn btn-wide btn-neutral"
              >
                Non
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-wide btn-error btn-outline"
              >
                Oui
              </button>
            </DialogActions>
          </div>
          <div className="px-6 mb-4 text-red-600">
            Avertissement : Cela supprimera toute réservation associée à ce
            client
          </div>
        </List>
      </Dialog>
      {/* end dialog delete */}
      {/* dialog update client */}
      <Dialog maxWidth="md" open={openUpdate} onClose={handleDialogUpdateClose}>
        <UpdatePatient patient={patient} close={handleDialogUpdateClose} />
      </Dialog>
      {/* end dialog update client */}
    </div>
  );
}

export default ClientContainer;
