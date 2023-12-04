"use client";
import { Client } from "@/Types/types";
import {
  createClient,
  updateClient as UpdateClientFun,
} from "@/components/Crud";
import { createClientValidation } from "@/components/validation";
import useDataStore from "@/store/data";
import useOverlay from "@/store/overlayToggle";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddClient from "@/components/appoitnments/add/AddClient";
import { DialogActions } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";

interface props {
  patient: Client;
  close: (e: boolean) => void;
}

function UpdatePatient(props: props) {
  const router = useRouter();
  const { toggleOverlayStatu } = useOverlay();
  const { updateClient, getClients } = useDataStore();
  const [client, setClient] = useState<Client>({
    _id: props.patient._id,
    fullName: props.patient.fullName,
    phone: Number(
      props.patient.phone.toString().startsWith("212")
        ? props.patient.phone.toString().slice(3)
        : props.patient.phone.toString()
    ),
    adress: props.patient.adress,
    city: props.patient.city,
    email: props.patient.email,
    age: props.patient.age,
    gender: props.patient.gender,
    dateOfBirth: new Date(props.patient.dateOfBirth as Date),
  });

  const handleChangeClient = (value: string | number | Date, name: string) => {
    setClient((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
  }, [client]);

  const handleSubmitClient = async () => {
    toggleOverlayStatu();
    try {
      const validate = await createClientValidation(
        client,
        getClients(),
        "update"
      );
      if (!validate.isValid) {
        setError(validate.msg);
        return;
      }
      toast.loading("Chargement en cours...");
      const res = await UpdateClientFun(props.patient._id, client);
      if (!res) throw Error("Erreur");
      updateClient(props.patient._id, res);
      console.log(res, client);
      toast.dismiss();
      props.close(false);
      toast.success("Terminé");
    } catch (error) {
      toast.dismiss();
      toast.error("Quelque chose s'est mal passé");
      props.close(false);
      console.log(error);
    } finally {
      window.location.reload();
      toggleOverlayStatu();
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6 min-w-[900px] overflow-x-hidden flex flex-col gap-y-8">
        <section>
          <div className="flex items-center justify-between">
            <div className="operation flex items-center gap-5">
              <p className="text-xl uppercase font-semibold">
                mettez à jour le patient
              </p>
            </div>
            <div className="icon">
              <DialogActions>
                <button
                  onClick={() => props.close(false)}
                  className="btn btn-circle border border-solid border-black p-1 bg-white hover:bg-red-500 hover:text-white"
                >
                  x
                </button>
              </DialogActions>
            </div>
          </div>
          <div className="divider before:bg-primary after:bg-primary my-0.5"></div>
        </section>
        <AddClient client={client} handleClientChange={handleChangeClient} />
        {error && (
          <div className="error w-full">
            <p className="text-error text text-center">{error}</p>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          <DialogActions>
            <button
              className="btn border-gray-500 capitalize rounded-full btn-neutral btn-outline"
              onClick={() => props.close(false)}
            >
              Annuler
            </button>

            <button
              className="bg-violet-600 btn btn-wide capitalize hover:bg-violet-600 text-white rounded-full"
              onClick={() => handleSubmitClient()}
            >
              mettez à jour le patient
            </button>
          </DialogActions>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default UpdatePatient;
