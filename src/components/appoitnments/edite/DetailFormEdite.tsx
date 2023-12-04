import state, { assets, doctor, events } from "@/Types/types";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import useDataStore from "@/store/data";
import { urlForImage } from "../../../../sanity/lib/image";
import toast from "react-hot-toast";
import Image from "next/image";
import { BsCheck2Circle, BsTrash, BsXCircle } from "react-icons/bs";
import { DateTimeField } from "@mui/x-date-pickers";
import { deleteAsset } from "@/components/Crud";
import useOverlay from "@/store/overlayToggle";
import { SchedulerHelpers } from "@/components/schedular/types";
import { FaUserCheck, FaUserXmark } from "react-icons/fa6";

interface props {
  sch: SchedulerHelpers;
  state: state;
  handleChangeDetail: (
    value: string | Date | string[] | assets[] | number,
    name: string
  ) => void;
}
interface Unite extends doctor {
  serviceStatus: boolean;
}
function DetailFormEdit(props: props) {
  const { getClients, services, doctors, updateAppointment } = useDataStore();
  const { toggleOverlayStatu } = useOverlay();
  const [unite, setUnite] = useState<null | Unite[]>(null);
  const [assets, setAssets] = useState<assets[]>(
    (props.state.assets as unknown as assets[]) || []
  );

  const handleAssetsDelete = async (assetId: string) => {
    toggleOverlayStatu();
    try {
      const filterAssets = assets.filter((el) => el.asset._ref !== assetId);
      toast.loading("Suppression de la ressource...");
      const res = await deleteAsset(
        assets,
        assetId,
        props.sch.edited?.event_id as string
      );
      if (!res) {
        toast.error("Échec de la suppression de la ressource");
        throw Error("Échec de la suppression de la ressource");
      }
      setAssets(filterAssets);
      const update: events = {
        ...props.state,
        _id: res._id as string,
        _type: "reservation",
        title: res.title,
        color: res.color,
        event_id: res?._id as string,
        assets: res.assets,
        client: res.client._ref,
        doctors: res.doctors._ref,
        start: props.state.start.value,
        end: props.state.end.value,
        service: res.service._ref,
        paid: res.paid,
        amount: props.state.amount,
      };
      console.log(update);
      updateAppointment(update._id, update);
      props.handleChangeDetail(update.assets as assets[], "assets");
      toast.dismiss();
      toast.success("Supprimé");
    } catch (error) {
      toast.dismiss();
      toast.error("Oops !");
    } finally {
      toggleOverlayStatu();
    }
  };
  const handleDoctors = useCallback(
    (service_id: string) => {
      // props.handleChangeDetail("", "doctors");
      const selectedService = services.find((e) => e._id === service_id);
      if (selectedService === undefined) {
        props.sch.close();
        toast.error("Oops !");
      }
      // props.handleChangeDetail(selectedService?.price as number, "amount");
      const unites: Unite[] = [];
      selectedService?.doctors.map((e) => {
        const id = e._ref;
        for (let i = 0; doctors.length > i; i++) {
          if (doctors[i]._id === id) {
            unites.push({
              ...doctors[i],
              serviceStatus: !e._key?.startsWith("false"),
            });
          }
        }
      });
      setUnite(unites);
    },
    [doctors, props.sch, services]
  );

  useEffect(() => {
    if (props.state.service) {
      handleDoctors(props.state.service);
    }
  }, [handleDoctors, props.state.service]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [Files, setFiles] = useState<File[]>([]);
  function handleImageChange(event: any, mode: "remove" | "add" = "add") {
    if (mode === "remove") {
      const indexOfPreview = imagePreviews.indexOf(event);
      const filterPreview = imagePreviews.filter((e) => e !== event);
      const filterFiles = Files.filter((e, i) => i !== indexOfPreview);
      console.log({ Files, imagePreviews });
      console.log({ indexOfPreview, filterPreview, filterFiles });
      setImagePreviews(filterPreview);
      setFiles(filterFiles);
      props.handleChangeDetail(
        filterFiles as unknown as string[],
        "assetsBlob"
      );
      return;
    }
    const files = event.target.files;
    const previewUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        previewUrls.push(imageUrl);
      }
    }
    const combinedFiles = [...Array.from(files), ...Array.from(Files)];
    console.log({ combinedFiles, files, previewUrls });
    setImagePreviews((pre) => [...pre, ...previewUrls]);
    setFiles(combinedFiles as File[]);
    props.handleChangeDetail(combinedFiles as string[], "assetsBlob");
  }
  const filterClients = () => {
    const options = getClients().filter((e) => !e.isDeleted);
    return options.map((e) => e.fullName);
  };
  return (
    <>
      <div className="grid grid-cols-3 items-center justify-between">
        <p className="label text-xl">Client</p>
        <div className="inputs flex col-span-2 items-center gap-4">
          <div className=" capitalize flex-grow relative px-3">
            <Autocomplete
              fullWidth
              onChange={(_event: any, newValue: string | null) =>
                newValue &&
                props.handleChangeDetail(newValue?.toLocaleLowerCase(), "title")
              }
              value={props.state.title}
              options={filterClients()}
              renderInput={(params) => (
                <TextField
                  className="capitalize"
                  {...params}
                  label="Choisissez un client"
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center justify-between">
        <p className="label text-xl max-w-fit">
          <span>Service</span>
          <span className="mb-1 text-error"> *</span>
        </p>
        <div className="inputs col-span-2 flex items-center">
          <div className=" relative px-3 flex-grow">
            <FormControl fullWidth>
              <InputLabel>Choisissez un Service</InputLabel>
              <Select
                label="Choisissez un Service"
                onChange={(e) => {
                  props.handleChangeDetail(e.target.value, "service");
                  props.handleChangeDetail("", "doctors");
                  handleDoctors(e.target.value);
                }}
                fullWidth
                defaultValue={props.state.service}
              >
                <MenuItem disabled selected>
                  <div className="w-full flex items-center justify-between">
                    <span> Choisissez un service</span>
                    <p className="flex items-center gap-3">
                      {`( Active )`} <FaUserCheck />
                      {`( Inactive )`} <FaUserXmark />
                    </p>
                  </div>
                </MenuItem>
                {services.map((e, i) => {
                  return (
                    <MenuItem key={e._id + i} value={e._id}>
                      <div className="flex capitalize items-center w-full gap-3">
                        <img
                          className="w-[30px] aspect-square object-cover"
                          src={`${urlForImage(e.image)}`}
                          alt="service image"
                        />
                        <span>{e.service_name}</span>
                        <div className="flex-grow flex items-center justify-end gap-2 text-sm">
                          <span className=" justify-end text-gray-700">
                            {e.price} Dh
                          </span>
                          <span>
                            {e.status ? (
                              <FaUserCheck color="green" />
                            ) : (
                              <FaUserXmark color="red" />
                            )}
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center justify-between">
        <p className="label text-xl max-w-fit">
          <span>Unité</span>
          <span className="mb-1 text-error"> *</span>
        </p>
        <div className="inputs col-span-2 capitalize flex items-center">
          <div className={`relative px-3 flex-grow `}>
            <FormControl fullWidth>
              <InputLabel>Choisissez un Médecin</InputLabel>
              <Select
                data-tip="Choisissez d'abord un service"
                className={`${!!!unite && "tooltip"}`}
                fullWidth
                label="Choisissez un Médecin"
                disabled={unite === null ? true : false}
                onChange={(e) =>
                  props.handleChangeDetail(e.target.value as string, "doctors")
                }
                value={props.state.doctors}
              >
                <MenuItem disabled selected>
                  <div className="w-full flex items-center justify-between">
                    <span>Choisissez un Médecin</span>
                    <p className="flex items-center gap-3">
                      {`( Active )`} <FaUserCheck />
                      {`( Inactive )`} <FaUserXmark />
                    </p>
                  </div>
                </MenuItem>
                {unite &&
                  unite.map((e, i) => (
                    <MenuItem key={e._id + i} value={e._id}>
                      <div className="w-full flex items-center justify-between capitalize">
                        {e.fullName}

                        <span>
                          {e.status && e.serviceStatus ? (
                            <FaUserCheck color="green" />
                          ) : (
                            <FaUserXmark color="red" />
                          )}
                        </span>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center justify-between">
        <p className="label text-xl max-w-fit">
          <span>Prix</span>
          <span className="mb-1 text-error"> *</span>
        </p>
        <div className="inputs col-span-2 capitalize flex items-center">
          <div className={`relative px-3 flex-grow `}>
            <FormControl fullWidth>
              <TextField
                value={props.state.amount as number}
                type="number"
                fullWidth
                onChange={(e) =>
                  props.handleChangeDetail(+e.target.value, "amount")
                }
                label="Edite Prix"
              />
            </FormControl>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center justify-between">
        <p className="label text-xl max-w-fit">
          <span>Heure de début</span>
          <span className="mb-1 text-error"> *</span>
        </p>
        <div className="inputs flex col-span-2 items-center">
          <div className=" relative px-3 grid grid-cols-2 gap-2 flex-grow">
            <DateTimeField
              defaultValue={props.state.start.value}
              fullWidth
              onChange={(e) => e && props.handleChangeDetail(e, "start")}
              ampm={false}
              label="Date de début"
              minTime={new Date("2023/11/02 9:00")}
              maxTime={new Date("2023/11/02 19:00")}
              className="tooltip tooltip-top"
              data-tip="La date de début ne peut pas être modifiée."
            />
            <DateTimeField
              ampm={false}
              fullWidth
              defaultValue={props.state.end.value}
              onChange={(e) => e && props.handleChangeDetail(e, "end")}
              label="Date de fin"
              minTime={new Date("2023/11/02 9:00")}
              maxTime={new Date("2023/11/02 19:00")}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="grid my-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center gap-3">
          {assets.length > 0 &&
            assets.map((e, i: number) => (
              <div key={i + "rrtrz"} className="relative">
                <img src={`${urlForImage(e)}`} alt="asset" />
                <p
                  className=" absolute btn btn-circle btn-sm bg-white btn-outline btn-error top-1 right-0 z-10 cursor-pointer"
                  onClick={() => handleAssetsDelete(e.asset._ref)}
                >
                  <BsTrash />
                </p>
              </div>
            ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
          className="file-input w-full max-w-xs file-input-primary"
          multiple
        />
        {/* Display the image previews */}
        {imagePreviews.length > 0 && (
          <div className="flex mt-5 items-center gap-3 flex-wrap">
            {imagePreviews.map((previewUrl, index) => (
              <div className=" relative" key={index + "ee"}>
                <div className="max-w-[100px]">
                  <Image
                    src={previewUrl}
                    alt={`Aperçu de l'image ${index}`}
                    width={100}
                    height={100}
                    objectFit="contain"
                  />
                </div>
                <p
                  className=" absolute btn btn-circle btn-sm bg-white btn-outline btn-error top-1 right-0 z-10 cursor-pointer"
                  onClick={() => handleImageChange(previewUrl, "remove")}
                >
                  <BsTrash />
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DetailFormEdit;
