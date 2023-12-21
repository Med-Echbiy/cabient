import state, { Client, doctor, events, service } from "@/Types/types";

import { DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppointmentForm from "./AppointmentForm";
import { nanoid } from "nanoid";
import {
  createClientValidation,
  submitValidation,
} from "@/components/validation";
import toast from "react-hot-toast";
import { createAppointment, createClient } from "@/components/Crud";
import useDataStore from "@/store/data";
import AddClient from "./AddClient";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useOverlay from "@/store/overlayToggle";
import { ProcessedEvent, SchedulerHelpers } from "@/components/schedular/types";
import { EventEmitterAsyncResource } from "stream";
interface props {
  sch: SchedulerHelpers;
  clients: Client[];
  services: service[];
  doctors: doctor[];
}
function AddAppointment(props: props) {
  const { addClient, adddAppointment, getClients, getAppointments, services } =
    useDataStore();
  const { toggleOverlayStatu } = useOverlay();
  const event = props.sch.edited;
  const [component, setComponent] = useState<"detail" | "client">("detail");
  const [error, setError] = useState("");
  const [state, setState] = useState<state>({
    amount: event?.amount || undefined,
    title: event?.title || "",
    client: event?.title || "",
    doctors: (event?.doctors as string) || "",
    start: {
      value: props.sch.state.start.value,
      validity: true,
      type: "date",
    },
    end: {
      value: props.sch.state.end.value,
      validity: true,
      type: "date",
    },
    service: (event?.service as string) || "",
    assets: event?.assets || [],
    color: event?.color || "#06b6d4",
    assetsBlob: [],
    paid: event?.paid || false,
    confirmed: event?.confimed || false,
  });

  const handleSubmitDetail = async () => {
    toggleOverlayStatu();

    try {
      const id = nanoid(30);
      handleChangeDetail(state.client, "client");
      const validate = await submitValidation(state, getAppointments());
      if (!validate.approved) {
        setError(validate.msg);
        throw Error(validate.msg);
      }
      toast.loading("Chargement en cours...");
      const amount = services.find((e) => e._id === state.service)?.price;
      const appointment = await createAppointment(
        state.client,
        { ...state, amount },
        id
      );
      if (appointment && appointment._id) {
        adddAppointment({
          ...state,
          _id: `reservation_${id}`,
          event_id: `reservation_${id}`,
          _type: "reservation",
          start: new Date(state.start.value),
          end: new Date(state.end.value),
          color: state.paid ? "22c55e" : "#fbbf24",
          amount: amount,
        } as events);
      }
      const added_updated_event = (await new Promise((res) => {
        res({
          event_id: props.sch.edited?.event_id || `reservation_${id}`,
          title: `${state.title}`,
          start: state.start.value,
          end: state.end.value,
          doctors: state.doctors,
          service: state.service,
          assets: state.assets,
          client: state.client,
          color: state.paid ? "22c55e" : "#fbbf24",
          paid: state.paid,
          confirmed: state.confirmed,
          amount: amount,
        });
      })) as ProcessedEvent;
      toast.dismiss();
      toast.success("Terminé");

      props.sch.onConfirm(added_updated_event, "create");
      props.sch.close();
    } catch (error) {
      toast.dismiss();
      toast.error("Oops !");
      console.log(error);
    } finally {
      toggleOverlayStatu();
    }
  };

  const handleChangeDetail = (
    value: string | Date | string[],
    name: string
  ) => {
    if (name === "start" || name === "end") {
      setState((prev) => {
        return {
          ...prev,
          [name]: { ...prev[name], value: value },
        };
      });
    } else if (name === "title") {
      const clientName = value as string;
      const client_id = getClients().find(
        (e) => e.fullName.toLocaleLowerCase() === clientName.toLocaleLowerCase()
      );
      console.log({ value, client_id });
      setState((pre) => {
        return {
          ...pre,
          title: value as string,
          client: client_id?._id || "",
        };
      });

      return;
    } else {
      setState((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const [client, setClient] = useState<Client>({
    _id: `client_${nanoid(20)}`,
    fullName: "",
    phone: 600000000,
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
      const validate = await createClientValidation(client, props.clients);
      if (!validate.isValid) {
        setError(validate.msg);
        return;
      }
      toast.loading("Chargement en cours...");
      const res = await createClient(client);
      if (!res?._id) throw Error("Erreur");
      addClient(res);
      console.log(res, client);
      handleChangeDetail(res.fullName, "title");
      setComponent("detail");
      toast.dismiss();
      toast.success("Terminé");
      // reset
      setClient((pre) => ({
        _id: `client_${nanoid(20)}`,
        fullName: "",
        phone: 600000000,
        adress: "",
        city: "",
        email: "",
        age: null,
        gender: null,
        dateOfBirth: new Date(2000, 0, 1),
      }));
    } catch (error) {
      toast.dismiss();
      toast.error("Quelque chose s'est mal passé");
      console.log(error);
    } finally {
      toggleOverlayStatu();
    }
  };

  useEffect(() => {
    setError("");
  }, [state, component, client]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="dialog p-6 min-w-[900px] overflow-x-hidden flex flex-col gap-y-8">
        <section>
          <div className="flex items-center justify-between">
            <div className="operation flex items-center gap-5">
              <p className="text-xl uppercase font-semibold">
                {component === "detail"
                  ? "Créer une réservation"
                  : "Créer un client"}
              </p>
            </div>
            <div className="icon">
              <DialogActions>
                <button
                  onClick={() => props.sch.close()}
                  className="btn btn-circle p-1 bg-white hover:bg-white"
                >
                  x
                </button>
              </DialogActions>
            </div>
          </div>
          <div className="divider before:bg-primary after:bg-primary my-0.5"></div>
        </section>

        <div className="tab-switcher rounded-full  border border-solid flex items-center">
          <button
            onClick={() => setComponent("detail")}
            className={`btn no-animation ${
              component === "detail"
                ? "bg-blue-50 hover:bg-blue-50"
                : "bg-white hover:bg-white border-none"
            } capitalize  rounded-full flex-grow `}
          >
            Détail
          </button>

          <button
            onClick={() => setComponent("client")}
            className={`btn ${
              component !== "client"
                ? "bg-white hover:bg-white border-none"
                : "bg-blue-50 hover:bg-blue-50"
            }  no-animation capitalize  outline-none flex-grow  rounded-full`}
          >
            Client
          </button>
        </div>

        <div className={`detail_component flex flex-col gap-8 justify-center`}>
          {component === "detail" ? (
            <AppointmentForm
              state={state}
              sch={props.sch}
              handleChangeDetail={handleChangeDetail}
            />
          ) : (
            <AddClient
              client={client}
              handleClientChange={handleChangeClient}
            />
          )}
        </div>

        {error && (
          <div className="error w-full">
            <p className="text-error text text-center">{error}</p>
          </div>
        )}

        <div className="w-full flex items-center justify-end">
          <DialogActions>
            <button
              className="btn border-gray-500 capitalize rounded-full btn-outline"
              onClick={props.sch.close}
            >
              Annuler Réservation
            </button>

            <button
              className="bg-primary btn btn-wide capitalize hover:bg-primary text-white rounded-full"
              onClick={() =>
                component === "detail"
                  ? handleSubmitDetail()
                  : handleSubmitClient()
              }
            >
              {component === "detail"
                ? "Ajouter un rendez-vous"
                : "Ajouter un client"}
            </button>
          </DialogActions>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AddAppointment;
