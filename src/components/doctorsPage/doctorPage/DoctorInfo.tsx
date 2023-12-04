"use client";
import { doctor } from "@/Types/types";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { CgMail } from "react-icons/cg";
import { BsCheck, BsPencil, BsX } from "react-icons/bs";
import { MdOutlineAvTimer } from "react-icons/md";
import { Dialog, Switch, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { validateDoctor } from "@/components/validation";
import { updateDoctor } from "@/components/Crud";
import useOverlay from "@/store/overlayToggle";

function DoctorInfo({ doctor }: { doctor: doctor }) {
  const { toggleOverlayStatu } = useOverlay();
  const [open, setOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(doctor);
  const [docotrEdite, setDoctorEdite] = useState(doctorInfo);
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
  }, [docotrEdite]);

  const handleChange = (
    name: "fullName" | "phone" | "email" | "status",
    value: string | number | boolean
  ) => {
    setDoctorEdite((pre) => ({ ...pre, [name]: value }));
  };
  const updateDoctorFun = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour d'un Médecin...");
      const validation = validateDoctor(doctorInfo, "edite");
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await updateDoctor(doctor);
      if (res) {
        toast.dismiss();
        toast.success("Médecin mis à jour avec succès!");
        setDoctorInfo(docotrEdite);
        // props.update(doctor);
        setOpen(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups!");
    } finally {
      toggleOverlayStatu();
    }
  };

  return (
    <>
      <div className="py-2 px-5 capitalize flex flex-col justify-around list_info card shadow-md">
        <p
          className={"flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"}
        >
          <span
            className={
              "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
            }
          >
            {" "}
            <span>
              <IoPerson />
            </span>{" "}
            Nom complet :
          </span>
          <span>
            <span>{doctorInfo.fullName} </span>
          </span>
        </p>
        <p
          className={"flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"}
        >
          <span
            className={
              "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
            }
          >
            {" "}
            <span>
              <FaPhoneAlt />
            </span>{" "}
            Téléphone :
          </span>
          <span>
            <span>+{doctorInfo.phone} </span>
          </span>
        </p>
        {doctorInfo.email && (
          <p
            className={
              "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
            }
          >
            <span
              className={
                "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
              }
            >
              <span>
                <CgMail size={20} />
              </span>
              Email :
            </span>
            <span>
              <span className=" lowercase">{doctorInfo.email} </span>
            </span>
          </p>
        )}
        <p
          className={"flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"}
        >
          <span
            className={
              "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
            }
          >
            <span>
              <MdOutlineAvTimer />
            </span>
            <span>Inscription :</span>
          </span>
          <span className="text-xs">
            {new Date(doctorInfo._createdAt as Date).toLocaleDateString(
              "fr-FR",
              {
                dateStyle: "long",
              }
            )}
          </span>
        </p>
        <p className="flex items-center justify-between">
          <span>
            {doctorInfo.status ? (
              <span
                className={
                  "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
                }
              >
                <BsCheck /> actif
              </span>
            ) : (
              <span
                className={
                  "flex items-center gap-2 text-xs xl:text-sm 3xl:text-base"
                }
              >
                <BsX /> inactif
              </span>
            )}
          </span>
          <span className=" divider divider-horizontal divider-neutral "></span>
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm bg-violet-600 hover:bg-violet-600 text-white  flex items-center gap-2"
          >
            Mettre à jour
            <span>
              <BsPencil />
            </span>
          </button>
        </p>
      </div>
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
              value={docotrEdite.fullName}
              onChange={(e) =>
                handleChange("fullName", e.target.value.toLocaleLowerCase())
              }
              label="Nom complet"
            />
            <TextField
              value={docotrEdite.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              type="number"
              label="Téléphone"
            />
            <TextField
              value={docotrEdite.email}
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
                checked={docotrEdite.status}
                onChange={(e) => handleChange("status", e.target.checked)}
              />
              <p> {docotrEdite.status ? "actif" : "inactif"} </p>
            </div>
            {/* Bouton pour déclencher la mise à jour du médecin */}
            <button onClick={updateDoctorFun} className="btn btn-primary mt-4">
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
    </>
  );
}

export default DoctorInfo;
