import { Client } from "@/Types/types";
import { createClient } from "@/components/Crud";
import AddClient from "@/components/appoitnments/add/AddClient";
import { createClientValidation } from "@/components/validation";
import useDataStore from "@/store/data";
import useOverlay from "@/store/overlayToggle";
import { DialogActions } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface props {
  close: (e: boolean) => void;
}
interface patient extends Omit<Client, "phone"> {
  phone: Date | null;
}

function AddPatient(props: props) {
  const { toggleOverlayStatu } = useOverlay();
  const { getClients, addClient } = useDataStore();
  const [client, setClient] = useState<patient>({
    _id: `client_${nanoid(20)}`,
    fullName: "",
    phone: null,
    adress: "",
    city: "",
    email: "",
    age: null,
    gender: null,
    dateOfBirth: new Date(2000, 0, 1),
  });

  const handleChangeClient = (value: string | number | Date, name: string) => {
    setClient((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitClient = async () => {
    toggleOverlayStatu();
    try {
      const validate = await createClientValidation(
        client as unknown as Client,
        getClients()
      );
      if (!validate.isValid) {
        setError(validate.msg);
        return;
      }
      toast.loading("Chargement en cours...");
      const res = await createClient(client as unknown as Client);
      if (!res?._id) throw Error("Erreur");
      addClient(res);
      console.log(res, client);
      toast.dismiss();
      props.close(false);
      toast.success("Terminé");
    } catch (error) {
      toast.dismiss();
      props.close(false);
      toast.error("Quelque chose s'est mal passé");
      console.log(error);
    } finally {
      toggleOverlayStatu();
    }
  };
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [client]);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className=" dialog p-6 min-w-[900px] overflow-x-hidden flex flex-col gap-y-8">
        <section>
          <div className="flex items-center justify-between">
            <div className="operation flex items-center gap-5">
              <p className="text-xl uppercase font-semibold">Créer un client</p>
            </div>
            <div className="icon">
              <DialogActions>
                <button
                  onClick={() => props.close(false)}
                  className="btn btn-circle p-1 bg-white hover:bg-white"
                >
                  x
                </button>
              </DialogActions>
            </div>
          </div>
          <div className="divider before:bg-primary after:bg-primary my-0.5"></div>
        </section>
        <AddClient
          client={client as unknown as Client}
          handleClientChange={handleChangeClient}
        />
        {error && (
          <div className="error w-full">
            <p className="text-error text text-center">{error}</p>
          </div>
        )}
        <div className="w-full flex items-center justify-end">
          <DialogActions>
            <button
              className="btn border-gray-500 capitalize rounded-full btn-outline"
              onClick={() => props.close(false)}
            >
              Annuler
            </button>

            <button
              className="bg-primary btn btn-wide capitalize hover:bg-primary text-white rounded-full"
              onClick={() => handleSubmitClient()}
            >
              Créer un client
            </button>
          </DialogActions>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AddPatient;
