import { Client, doctor, events, service } from "@/Types/types";

import {
  BsCalendar2Date,
  BsCheck2Circle,
  BsPerson,
  BsXCircle,
} from "react-icons/bs";
import { FcApprove, FcDisapprove } from "react-icons/fc";
import { BiLogoGmail, BiTimer } from "react-icons/bi";
import { DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { urlForImage } from "../../../../sanity/lib/image";
import Image from "next/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { client } from "../../../../sanity/lib/client";
import useDataStore from "@/store/data";
import toast from "react-hot-toast";
import AddAppointment from "../add/AddAppointment";
import EditeAppointment from "../edite/EditeAppointment";
import { ProcessedEvent, SchedulerHelpers } from "@/components/schedular/types";
import useOverlay from "@/store/overlayToggle";
import { useRouter } from "next/navigation";
import { calculateAge } from "@/components/Crud";
import Link from "next/link";
import {
  MdOutlineAttachMoney,
  MdOutlineMoneyOff,
  MdOutlinePaid,
} from "react-icons/md";

interface props {
  sch: SchedulerHelpers;
  client: Client;
  service: service;
  doctor: doctor;
}

function ShowCase(props: props) {
  const currentDate = new Date();
  const {
    getAppointments,
    updateAppointment,
    getClients,
    doctors,
    services,
    removeAppointment,
  } = useDataStore();
  const { toggleOverlayStatu } = useOverlay();
  const [appointment, setAppointment] = useState<events>();
  const [paid, setPaid] = useState(appointment?.paid);
  const [confirm, setConfirm] = useState(appointment?.confirmed);
  const [edite, setEdite] = useState(false);
  useEffect(() => {
    const appointments = getAppointments().find(
      (e) =>
        e._id === props.sch.edited?._id ||
        e.event_id === props.sch.edited?.event_id
    );
    console.log(appointment);
    if (appointments) {
      setAppointment(appointments);
      setPaid(appointments.paid);
      setConfirm(appointment?.confirmed);
      return;
    }
    setAppointment(props.sch.edited as events);
  }, [
    appointment,
    getAppointments,
    props.sch.edited,
    props.sch.edited?._id,
    props.sch.edited?.event_id,
  ]);

  if (edite) {
    return (
      <EditeAppointment
        sch={props.sch}
        clients={getClients()}
        services={services}
        doctors={doctors}
      />
    );
  }

  const handlePaidClick = async () => {
    console.log("Début de la gestion...");
    const reversePaid = !paid;
    const id = props.sch.edited?._id;
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour du rendez-vous en cours");
      const update = await client
        .patch(id)
        .set({
          paid: reversePaid,
        })
        .commit();
      console.log(update);
      if (update._id) {
        console.log(update.doctors, update.client);
        toast.dismiss();
        toast.success("Terminé !");
        setPaid((pre) => !pre);
        updateAppointment(update._id, {
          client: update.client._ref,
          doctors: update.doctors._ref,
          service: update.service._ref,
          _type: "reservation",
          paid: update.paid,
          _id: update._id,
          event_id: update._id,
          title: update.title,
          color: appointment?.color || update.color,
          assets: update.assets,
          start: props.sch.edited?.start as Date,
          end: props.sch.edited?.end as Date,
          confirmed: update.confirmed,
        });
      }
      toggleOverlayStatu();

      return true;
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
      toggleOverlayStatu();
    } finally {
      props.sch.close();
    }

    return false;
  };

  const handleConfirm = async () => {
    console.log("Début de la gestion...");
    const reverseConfirm = !confirm;
    const id = props.sch.edited?._id;
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour du rendez-vous en cours");
      const colorIs = reverseConfirm
        ? "#22c55e"
        : new Date() > new Date(props.sch.edited?.end as Date)
        ? "#dc2626"
        : "#fbbf24";
      console.log(reverseConfirm, colorIs);
      const update = await client
        .patch(id)
        .set({
          confirmed: reverseConfirm,
          color: colorIs,
        })
        .commit();
      if (update._id) {
        console.log(update.doctors, update.client);
        toast.dismiss();
        toast.success("Terminé !");
        setConfirm((pre) => !pre);
        updateAppointment(update._id, {
          client: update.client._ref,
          doctors: update.doctors._ref,
          service: update.service._ref,
          _type: "reservation",
          paid: update.paid,
          _id: update._id,
          event_id: update._id,
          title: update.title,
          color: colorIs,
          assets: update.assets,
          start: props.sch.edited?.start as Date,
          end: props.sch.edited?.end as Date,
          confirmed: update.confirmed,
        });
      }
      toggleOverlayStatu();

      return true;
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
      toggleOverlayStatu();
    } finally {
      props.sch.close();
    }

    return false;
  };

  const handelDelete = async (e: string | number) => {
    // in case you want to stop already passed appointments from bieng deleted
    // const currentDate = new Date();
    // const appointment = getAppointments().find(
    //   (ev) => e === ev._id || e === ev.event_id
    // );
    // if (appointment && currentDate > appointment.end) {
    //   toast.error("")
    //   return null
    // }
    // console.log(appointment);
    try {
      toggleOverlayStatu();
      toast.loading("suppression...");
      const res = await client.delete(e as string);
      if (!!res) {
        toast.dismiss();
        toast.success("Términe");
        removeAppointment(`${e}`);
        return e;
      } else {
        throw Error("somthing went wrong");
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
      toast.error("oops!");
    } finally {
      toggleOverlayStatu();
      props.sch.close();
    }
  };
  return (
    <div className=" showCase min-w-[900px] p-12 overflow-x-hidden rounded-2xl">
      <section className="mb-xl">
        <div className="flex items-center justify-between">
          <div className="operation flex items-center gap-5">
            <p className="text-xl font-semibold uppercase flex items-center gap-3">
              {" "}
              <span>Réservation</span>
              <MdOutlinePaid color={paid ? "green" : "red"} size={25} />
            </p>
          </div>
          <div className="icon">
            <DialogActions>
              <button
                onClick={() => props.sch.close()}
                className="btn btn-circle p-1 btn-error"
              >
                x
              </button>
            </DialogActions>
          </div>
        </div>
        <div className="divider before:bg-neutral after:bg-neutral my-0.5"></div>
      </section>
      <div className="w-full h-full grid grid-cols-3 gap-6 capitalize">
        <div
          className={`appointment_time_duration p-3 rounded text-white flex flex-col gap-y-4`}
          style={{
            backgroundColor: confirm
              ? "#22c55e"
              : currentDate > new Date(props.sch.edited?.end as Date)
              ? "#dc2626"
              : "#fbbf24",
          }}
        >
          <p className="flex items-center gap-2">
            <span>
              <BsCalendar2Date />
            </span>
            <span>
              {props.sch.edited?.end &&
                new Date(props.sch.edited?.end).toDateString()}
            </span>
          </p>

          <p>
            {props.sch.edited?.start && props.sch.edited?.end && (
              <>
                {`${new Date(props.sch.edited?.start).toLocaleTimeString(
                  "it-IT",
                  {
                    timeStyle: "short",
                  }
                )} - ${new Date(props.sch.edited?.end).toLocaleTimeString(
                  "it-It",
                  {
                    timeStyle: "short",
                  }
                )}`}
              </>
            )}
          </p>

          <p className="flex items-center gap-2">
            <span>
              <BiTimer size={20} />
            </span>
            <span>Le temps passé</span>
          </p>
        </div>

        <div className="p-3 outline outline-solid outline-offset-2 rounded-md">
          <p className="underline">Médecin</p>
          <div className="client_detail flex mt-2 flex-col gap-y-2">
            <Link
              href={`/patients/${props.doctor._id}`}
              className="flex items-center gap-2"
            >
              <BsPerson /> <span> {props.doctor.fullName} </span>
            </Link>
            <p>
              <span>🇲🇦 +{props.doctor.phone}</span>
            </p>
            <p className="adress lowercase flex items-center gap-2">
              <BiLogoGmail />
              <span>{props.doctor.email}</span>
            </p>
          </div>
        </div>
        <div className="p-3 outline outlne-solid glass outline-gray-100 rounded-md">
          <p className="underline">Patient</p>
          <div className="client_detail flex mt-2 flex-col gap-y-2">
            <p className="flex items-center gap-2">
              <BsPerson />
              <span>{props.client.fullName}</span>
            </p>
            <p>
              <span>🇲🇦 +{props.client.phone}</span>
            </p>
            <p className="adress capitalize flex items-center gap-2">
              <span className="">genre: {props.client.gender} / </span>
              <span>age: {calculateAge(props.client.dateOfBirth as Date)}</span>
            </p>
          </div>
        </div>
        <div className="p-3 outline outlne-solid glass outline-gray-100 rounded-md">
          <p className="underline mb-1">Service</p>
          <div className="client_detail flex mt-2 flex-col gap-y-2">
            <p className="w-full aspect-[7/4] relative">
              {props.service.image && (
                <Image
                  className="w-full"
                  src={`${urlForImage(props.service.image)}`}
                  alt={props.service.service_name}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                />
              )}
            </p>
            <p className="flex items-center mt-2 gap-2">
              <span>{props.service.service_name}</span>
            </p>

            <p className="adress capitalize flex items-center gap-1">
              <span>{props.sch.edited?.amount || props.service.price}Dh</span>
            </p>
          </div>
        </div>
        {props.sch.edited?.assets.length > 0 && (
          <div className="glass p-3 col-span-2">
            <p className="underline mb-1">Pièces jointes</p>
            <div className="grid grid-cols-3 gap-1">
              <PhotoProvider>
                {props.sch.edited?.assets.map(
                  (e: SanityImageSource, i: number) => (
                    <PhotoView key={i + "image_dude"} src={`${urlForImage(e)}`}>
                      <img
                        className="  cursor-pointer tooltip tooltip-bottom"
                        data-tip="Cliquez pour prévisualiser"
                        src={`${urlForImage(e)}`}
                        alt="client asset"
                      />
                    </PhotoView>
                  )
                )}
              </PhotoProvider>
            </div>
          </div>
        )}
      </div>
      <div className="w-full mt-8 flex items-center justify-end">
        <DialogActions>
          <button
            onClick={() => handelDelete(props.sch.edited?.event_id as string)}
            className="btn btn-outline btn-error capitalize rounded-full btn-neutral"
          >
            supprimer
          </button>
          {/* {props.canBeModified && ( */}
          {currentDate > new Date(props.sch.edited?.end as Date) ? (
            <button
              disabled
              className="btn bg-violet-600 hover:bg-violet-600 text-white capitalize rounded-full"
            >
              Modifier
            </button>
          ) : (
            <button
              className="btn bg-violet-600 hover:bg-violet-600 text-white capitalize rounded-full"
              onClick={() => setEdite(true)}
            >
              Modifier
            </button>
          )}
          <button
            className={`flex items-center justify-center gap-3 btn rounded-full capitalize ${
              confirm ? "btn-success" : "btn-error"
            }`}
            onClick={handleConfirm}
          >
            {!confirm ? "affirmer reservation" : "annuler reservation"}{" "}
            {!confirm ? <FcApprove size={20} /> : <FcDisapprove size={20} />}
          </button>
          <button
            onClick={handlePaidClick}
            className={`flex tooltip tooltip-top items-center btn-outline text-black justify-center gap-3 btn rounded-full capitalize`}
            data-tip="Basculer l'état de paiement"
          >
            {!paid ? "payé" : "Annuler le paiement"}{" "}
            {!paid ? (
              <MdOutlineAttachMoney size={20} />
            ) : (
              <MdOutlineMoneyOff size={20} />
            )}
          </button>
        </DialogActions>
      </div>
    </div>
  );
}

export default ShowCase;
