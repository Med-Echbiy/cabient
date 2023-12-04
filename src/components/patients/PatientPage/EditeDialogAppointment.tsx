import state, {
  Appointments,
  assets,
  Client,
  doctor,
  events,
  service,
} from "@/Types/types";
import { submitValidation } from "@/components/validation";
import useDataStore from "@/store/data";
import useOverlay from "@/store/overlayToggle";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getRandomHexCode,
  updateAppointment as UpdateAppointment,
} from "@/components/Crud";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DialogActions } from "@mui/material";
import DetailFormEdite from "@/components/appoitnments/edite/DetailFormEdite";
import EditeAppointmentForm from "./EditeAppointmentForm";
import { useRouter } from "next/navigation";
import { client } from "../../../../sanity/lib/client";

interface props {
  appointments: Appointments;
  close: () => void;
}

function EditeDialogAppointment(props: props) {
  const router = useRouter();
  const { getClients, updateAppointment, getAppointments } = useDataStore();
  const { toggleOverlayStatu } = useOverlay();
  const event = props.appointments;
  // const [component, setComponent] = useState<"detail" | "client">("detail");
  const [error, setError] = useState("");
  const [state, setState] = useState<state>({
    title: event.title || "",
    client: event.title || "",
    doctors: event.doctors._ref || "",
    start: {
      value: new Date(event.start),
      validity: true,
      type: "date",
    },
    end: {
      value: new Date(event.end),
      validity: true,
      type: "date",
    },
    service: (event.service._ref as string) || "",
    assets: event.assets || [],
    color: event.color || "#06b6d4",
    assetsBlob: [],
    paid: event.paid || false,
  });

  const handelUpdateDetail = async () => {
    toggleOverlayStatu();
    try {
      handleChangeDetail(state.client, "client");
      const appointments: Appointments[] = await client.fetch(
        `*[_type == 'reservation' && dateTime(end) > dateTime(now())]`
      );
      console.log(appointments, "\n");
      if (appointments.length < 1 || appointments.length > 2) {
        return;
      }
      const events: events[] = appointments.map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      })) as unknown as events[];
      const validate = await submitValidation(state, events, "edite");
      if (!validate.approved) {
        setError(validate.msg);
        throw Error(validate.msg);
      }
      toast.loading("Chargement en cours...");
      const appointment = await UpdateAppointment(
        props.appointments._id,
        state,
        getClients()
      );
      if (!!appointment) {
        console.log(appointment);
        const id = event.event_id as string;
        updateAppointment(id, {
          ...state,
          start: new Date(state.start.value),
          client: appointment.client._ref,
          end: new Date(state.end.value),
          _id: id,
          event_id: id,
          _type: "reservation",
        } as events);
      }

      toast.dismiss();
      toast.success("Terminé");
      props.close();
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error("Oops !");
      console.log(error);
    } finally {
      toggleOverlayStatu();
    }
  };

  const handleChangeDetail = (
    value: string | Date | string[] | assets[] | number,
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
      const client_id = getClients().find((e) => e.fullName === value);
      console.log({ value, client_id });
      setState((pre) => {
        return {
          ...pre,
          title: value as string,
          client: client_id?._id || "",
        };
      });

      return;
    } /* else if(name === "assetsBlob"){
      //   setState((pre)=> ({
      //     ...pre,
      //     assetsBlob: 
      //   }))
      //   return
       }*/ else {
      setState((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  useEffect(() => {
    console.log("run effect", state.doctors);
    setError("");
  }, [state]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="p-6 min-w-[900px] overflow-x-hidden flex flex-col gap-y-8">
        <section>
          <div className="flex items-center justify-between">
            <div className="operation flex items-center gap-5">
              <p className="text-xl uppercase font-semibold">
                Modifre une réservation
              </p>
            </div>
            <div className="icon">
              <DialogActions>
                <button
                  onClick={() => props.close()}
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
            className={`btn no-animation bg-primary hover:bg-primary text-white  capitalize  rounded-full flex-grow `}
          >
            Détail
          </button>
        </div>
        <div className={`detail_component flex flex-col gap-8 justify-center`}>
          <EditeAppointmentForm
            state={state}
            handleChangeDetail={handleChangeDetail}
            close={props.close}
            event_id={props.appointments._id}
          />
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
              onClick={props.close}
            >
              Annuler Réservation
            </button>
            <button
              className="bg-primary btn btn-wide capitalize hover:bg-primary text-white rounded-full"
              onClick={() => handelUpdateDetail()}
            >
              Modifier un rendez-vous
            </button>
          </DialogActions>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default EditeDialogAppointment;
