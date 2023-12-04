"use client";
import useOverlay from "@/store/overlayToggle";
import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import {
  client,
  getBasedOnClient,
  getBasedOnClientNoFilter,
} from "../../../sanity/lib/client";
import toast from "react-hot-toast";
import useDataStore from "@/store/data";
import { Appointments } from "@/Types/types";
import { Dialog, DialogTitle, List } from "@mui/material";

interface Props {
  id: string;
  fullName: string;
}

function Button(props: Props) {
  const { toggleOverlayStatu } = useOverlay();
  const { removeClient } = useDataStore();
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    setOpen(false);
    try {
      toggleOverlayStatu();
      toast.loading("Suppression en cours...");
      const currentDate = new Date();
      const getAppointments = await getBasedOnClientNoFilter(props.id);
      const removalPromises = getAppointments
        .filter((e) => currentDate < new Date(e.end))
        .map(async (reservation) => {
          // Remplacez 'deleteReservation' par la fonction réelle pour supprimer une réservation
          return await client.delete(reservation._id);
        });
      // Attendez que toutes les promesses de suppression soient terminées
      await Promise.all(removalPromises);
      console.log(removalPromises);
      const res = await client
        .patch(props.id)
        .set({
          isDeleted: true,
        })
        .commit();
      if (!!res) {
        toast.dismiss();
        toast.success("Terminé");
        removeClient(props.id);
        return;
      } else {
        throw Error("Une erreur s'est produite");
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
      toast.error("Oups !");
    } finally {
      toggleOverlayStatu();
    }
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className=" btn btn-sm flex items-center gap-2 bg-red-600 hover:bg-red-600 rounded-full  text-white "
      >
        Supprimer
        <span>
          <BsTrash />
        </span>
      </button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle className="text-center">
          <span>Confirmer la suppression</span>{" "}
          <span className="text-neutral capitalize">`{props.fullName}`</span>
        </DialogTitle>
        <List>
          <div className="flex items-center gap-4 mb-4 justify-center w-full">
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
          </div>
          <div className="px-6 mb-4 text-red-600">
            Avertissement : Cela supprimera toute réservation associée à ce
            client
          </div>
        </List>
      </Dialog>
    </>
  );
}

export default Button;
