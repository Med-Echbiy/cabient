import state, { doctor } from "@/Types/types";

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
import { BsTrash } from "react-icons/bs";
import { DateTimeField } from "@mui/x-date-pickers";
import { SchedulerHelpers } from "@/components/schedular/types";

interface props {
  sch: SchedulerHelpers;
  state: state;
  handleChangeDetail: (value: string | Date | string[], name: string) => void;
}

function AppointmentForm(props: props) {
  // Import necessary dependencies
  const { getClients, services, doctors } = useDataStore();
  const [unite, setUnite] = useState<null | doctor[]>(null);

  // Function to handle doctors based on selected service
  const handelDoctors = useCallback(
    (service_id: string) => {
      // Find the selected service
      const selectedService = services.find((e) => e._id === service_id);

      // Handle case where selected service is not found
      if (selectedService === undefined) {
        props.sch.close();
        toast.error("Oops!");
        return;
      }

      // Create a list of doctors associated with the selected service
      const unites: doctor[] = [];
      selectedService?.doctors.forEach((e) => {
        const id = e._ref;
        for (let i = 0; i < doctors.length; i++) {
          if (
            doctors[i]._id === id &&
            doctors[i].status &&
            !e._key?.startsWith("false")
          ) {
            unites.push(doctors[i]);
          }
        }
      });

      // Update state with the list of doctors
      setUnite(unites);
    },
    [doctors, props.sch, services]
  );

  // Effect to handle doctors when the selected service changes
  useEffect(() => {
    if (props.state.service) {
      handelDoctors(props.state.service);
    }
  }, [handelDoctors, props.state.service]);

  // State to manage image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    props.sch.edited?.assetsBlob || []
  );

  // State to manage selected files
  const [Files, setFiles] = useState<File[]>([]);

  // Function to handle image changes (add or remove)
  function handleImageChange(event: any, mode: "remove" | "add" = "add") {
    if (mode === "remove") {
      // Remove image preview and file when in remove mode
      const indexOfPreview = imagePreviews.indexOf(event);
      const filterPreview = imagePreviews.filter((e) => e !== event);
      const filterFiles = Files.filter((e, i) => i !== indexOfPreview);

      setImagePreviews(filterPreview);
      setFiles(filterFiles);
      props.handleChangeDetail(
        filterFiles as unknown as string[],
        "assetsBlob"
      );
      return;
    }

    // Add new files and update image previews when in add mode
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

    setImagePreviews((pre) => [...pre, ...previewUrls]);
    setFiles(combinedFiles as File[]);
    props.handleChangeDetail(combinedFiles as string[], "assetsBlob");
  }

  // Function to filter and return client options
  const filterClients = () => {
    const options = getClients().filter((e) => !e.isDeleted);
    return options.map((e) => e.fullName);
  };

  return (
    <>
      <div className="grid grid-cols-3  items-center justify-between">
        <p className="label text-xl">Client</p>
        <div className="inputs flex col-span-2 items-center gap-4">
          <div className=" capitalize flex-grow relative px-3">
            <Autocomplete
              fullWidth
              ListboxProps={{
                style: {
                  maxHeight: "200px",
                },
              }}
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
                  handelDoctors(e.target.value);
                }}
                fullWidth
                defaultValue={props.state.service}
              >
                <MenuItem disabled selected>
                  Choisissez un service
                </MenuItem>
                {services.map((e, i) => {
                  const findDoctor = e.doctors.filter((a) => {
                    return !!doctors.find((b) => a._ref === b._id && b.status);
                  });
                  if (findDoctor.length === 0 || !e.status) return <></>;
                  return (
                    <MenuItem key={e._id + i} value={e._id}>
                      <div className="flex capitalize items-center w-full gap-3">
                        <img
                          className="w-[30px] aspect-square object-cover"
                          src={`${urlForImage(e.image)}`}
                          alt="service image"
                        />
                        <span>{e.service_name}</span>
                        <div className="flex-grow flex items-center justify-end text-sm">
                          <span className=" justify-end text-gray-700">
                            {e.price} Dh
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
                data-tip="choisissez d'abord un service"
                className={`${!!!unite && "tooltip"}`}
                fullWidth
                label="Choisissez un Médecin"
                disabled={unite === null ? true : false}
                onChange={(e) => {
                  props.handleChangeDetail(e.target.value as string, "doctors");
                }}
                value={props.state.doctors}
              >
                <MenuItem disabled selected>
                  Choisissez un Médecin
                </MenuItem>
                {unite &&
                  unite.map((e, i) => {
                    // if (!e.status) return <></>;
                    return (
                      <MenuItem
                        className=" capitalize"
                        key={e._id + i}
                        value={e._id}
                      >
                        {e.fullName}
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
          <span>Heure de début</span>
          <span className="mb-1 text-error"> *</span>
        </p>
        <div className="inputs flex col-span-2 items-center">
          <div className=" relative px-3 grid grid-cols-2 gap-2 flex-grow">
            <DateTimeField
              defaultValue={props.state.start.value}
              onChange={(e) => e && props.handleChangeDetail(e, "start")}
              ampm={false}
              fullWidth
              label="Date de début"
              minTime={new Date("2023/11/02 9:00")}
              maxTime={new Date("2023/11/02 19:00")}
            />
            <DateTimeField
              ampm={false}
              fullWidth
              defaultValue={props.state.end.value}
              onChange={(e) => e && props.handleChangeDetail(e, "end")}
              label="Date de fin"
              minTime={new Date("2023/11/02 9:30")}
              maxTime={new Date("2023/11/02 19:00")}
            />
          </div>
        </div>
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
          className="file-input w-full max-w-xs file-input-primary"
          multiple // Allow multiple file selection
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

export default AppointmentForm;
