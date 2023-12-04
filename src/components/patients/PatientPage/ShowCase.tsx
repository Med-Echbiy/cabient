"use client";
import { Appointments, Client, doctor, service } from "@/Types/types";
import { Dialog, DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiLogoGmail, BiTimer } from "react-icons/bi";
import {
  BsCalendar2Date,
  BsCheck2Circle,
  BsPen,
  BsPenFill,
  BsPerson,
  BsXCircle,
} from "react-icons/bs";
import {
  MdOutlineAttachMoney,
  MdOutlineMoneyOff,
  MdOutlinePaid,
} from "react-icons/md";
import { urlForImage } from "../../../../sanity/lib/image";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import useOverlay from "@/store/overlayToggle";
import useDataStore from "@/store/data";
import toast from "react-hot-toast";
import { client } from "../../../../sanity/lib/client";
import { useRouter } from "next/navigation";
import EditeDialogAppointment from "./EditeDialogAppointment";
import { calculateAge } from "@/components/Crud";
import { FcApprove, FcDisapprove } from "react-icons/fc";

interface props {
  appointments: Appointments;
  // doctor: doctor;
  client: Client;
}

function ShowCase(props: props) {
  const currentDate = new Date();
  const router = useRouter();
  const { toggleOverlayStatu } = useOverlay();
  const { removeAppointment, updateAppointment, services, doctors } =
    useDataStore();
  const [doctor, setDoctor] = useState<doctor>();
  const [service, setService] = useState<service>();
  useEffect(() => {
    console.log(props.appointments);
    const service = services.find(
      (e) => e._id === props.appointments.service._ref
    );
    const doctor = doctors.find(
      (e) => e._id === props.appointments.doctors._ref
    );
    console.log("effect: ", { doctor, service });
    setDoctor(doctor);
    setService(service);
  }, [
    doctors,
    props.appointments,
    props.appointments.doctors._ref,
    props.appointments.service._ref,
    services,
  ]);
  const [edite, setEdite] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open === false) {
      setEdite(false);
    }
  }, [open, setEdite]);
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
      toast.loading("removing...");
      const res = await client.delete(e as string);
      if (!!res) {
        toast.dismiss();
        toast.success("Recharger La Page!");
        router.refresh();
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
      setOpen(false);
    }
  };
  const [paid, setPaid] = useState(props.appointments.paid);

  const handlePaidClick = async () => {
    console.log("Début de la gestion...");
    const reversePaid = !paid;
    const id = props.appointments._id;

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
      if (update._id && update.doctors._ref) {
        setPaid((pre) => !pre);
        console.log("we close showcase");
        console.log("start updating");
        updateAppointment(id, {
          client: update.client._ref,
          doctors: { _ref: update.doctors._ref } as unknown as string,
          service: { _ref: update.service._ref } as unknown as string,
          _type: "reservation",
          paid: update.paid,
          _id: update._id,
          event_id: update._id,
          title: update.title,
          color: props.appointments.color,
          assets: update.assets,
          start: update.start,
          end: update.end,
        });
        toast.dismiss();
        toast.success("Recharger La Page!");
      }
      toggleOverlayStatu();
      return true;
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
      toggleOverlayStatu();
    }

    return false;
  };
  //
  const [confirm, setConfirm] = useState(props.appointments.confirmed);
  const handleConfirm = async () => {
    console.log("Début de la gestion...");
    const reverseConfirm = !confirm;
    const id = props.appointments._id;
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour du rendez-vous en cours");
      const colorIs = reverseConfirm
        ? "#22c55e"
        : new Date() > new Date(props.appointments.end as Date)
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
          doctors: { _ref: update.doctors._ref } as unknown as string,
          service: { _ref: update.service._ref } as unknown as string,
          _type: "reservation",
          paid: update.paid,
          _id: update._id,
          event_id: update._id,
          title: update.title,
          color: colorIs,
          assets: update.assets,
          start: props.appointments.start,
          end: props.appointments.end,
          confirmed: update.confirmed,
        });
      }
      toggleOverlayStatu();

      return true;
    } catch (error) {
      toast.dismiss();
      toast.error("Oups !");
      toggleOverlayStatu();
    }

    return false;
  };

  const close = () => {
    setOpen(false);
  };

  if (edite) {
    return (
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <EditeDialogAppointment
          appointments={props.appointments}
          close={close}
        />
      </Dialog>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 z-[100]">
        {paid ? <MdOutlineAttachMoney /> : <MdOutlineMoneyOff />}
        <div onClick={() => setOpen(true)} className="cursor-pointer ">
          <BsPenFill size={12} />
        </div>
      </div>
      {doctor && service && props.appointments && (
        <Dialog maxWidth="md" onClose={() => setOpen(false)} open={open}>
          <div className="showCase min-w-[900px] capitalize p-12 overflow-hidden rounded-2xl">
            <section className="mb-xl">
              <div className="flex items-center justify-between">
                <div className="operation flex items-center gap-5">
                  <p className="text-xl font-semibold uppercase flex items-center gap-2">
                    {" "}
                    <span>Réservation</span>
                    <MdOutlinePaid color={paid ? "green" : "red"} size={25} />
                  </p>
                </div>
                <div className="icon">
                  <DialogActions>
                    <button
                      onClick={() => setOpen(false)}
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
                    : currentDate > new Date(props.appointments.end)
                    ? "#dc2626"
                    : "#fbbf24",
                }}
              >
                <p className="flex items-center gap-2">
                  <span>
                    <BsCalendar2Date />
                  </span>
                  <span>
                    {props.appointments.end &&
                      new Date(props.appointments.end).toDateString()}
                  </span>
                </p>

                <p>
                  {props.appointments.start && props.appointments.end && (
                    <>
                      {`${new Date(props.appointments.start).toLocaleTimeString(
                        "it-IT",
                        {
                          timeStyle: "short",
                        }
                      )} - ${new Date(
                        props.appointments.end
                      ).toLocaleTimeString("it-It", {
                        timeStyle: "short",
                      })}`}
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
                  <p className="flex items-center gap-2">
                    <BsPerson /> <span> {doctor.fullName} </span>
                  </p>
                  <p>
                    <span>🇲🇦 +{doctor.phone}</span>
                  </p>
                  <p className="adress lowercase flex items-center gap-2">
                    <BiLogoGmail />
                    <span>{doctor.email}</span>
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
                    <span>
                      age: {calculateAge(props.client.dateOfBirth as Date)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-3 outline outlne-solid glass outline-gray-100 rounded-md">
                <p className="underline mb-1">Service</p>
                <div className="client_detail flex mt-2 flex-col gap-y-2">
                  <p className="w-full aspect-[7/4] relative">
                    {service.image && (
                      <Image
                        className="w-full"
                        src={`${urlForImage(service.image)}`}
                        alt={service.service_name}
                        fill
                        objectFit="cover"
                        objectPosition="center"
                      />
                    )}
                  </p>
                  <p className="flex items-center mt-2 gap-2">
                    <span>{service.service_name}</span>
                  </p>

                  <p className="adress capitalize flex items-center gap-1">
                    <span>{props.appointments.amount || service.price} Dh</span>
                  </p>
                </div>
              </div>
              {props.appointments.assets.length > 0 && (
                <div className="glass p-3 col-span-2">
                  <p className="underline mb-1">Pièces jointes</p>
                  <div className="grid grid-cols-3 gap-1">
                    <PhotoProvider>
                      {props.appointments.assets.map(
                        (e: SanityImageSource, i: number) => (
                          <PhotoView
                            key={i + "image_dude"}
                            src={`${urlForImage(e)}`}
                          >
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
            <div className="w-full mt-8 flex items-center gap-3 justify-end">
              <button
                className="btn btn-error btn-outline capitalize rounded-full"
                onClick={() => handelDelete(props.appointments._id)}
              >
                supprimer
              </button>
              {currentDate > new Date(props.appointments.end) ? (
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
              <DialogActions>
                <button
                  className={`flex items-center justify-center gap-3 btn rounded-full capitalize ${
                    confirm ? "btn-success" : "btn-error"
                  }`}
                  onClick={handleConfirm}
                >
                  {!confirm ? "affirmer reservation" : "annuler reservation"}{" "}
                  {!confirm ? (
                    <FcApprove size={20} />
                  ) : (
                    <FcDisapprove size={20} />
                  )}
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
        </Dialog>
      )}
    </>
  );
}

export default ShowCase;
