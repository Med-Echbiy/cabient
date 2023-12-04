"use client";
import { assets, doctor, service } from "@/Types/types";
import useOverlay from "@/store/overlayToggle";
import {
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validateService } from "../validation";
import { createService } from "../Crud";
import Image from "next/image";
import { BsTrash } from "react-icons/bs";
import ServiceCell from "./ServiceCell";

interface props {
  services: service[];
  doctors: doctor[];
}

function ServicesContainer(props: props) {
  const { toggleOverlayStatu } = useOverlay();
  const [services, setServices] = useState(props.services);
  useEffect(() => {
    console.log("services:", services);
  }, [services]);
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(15);
  // Step 2: Calculate the index of the last client on the current page
  const indexOfLastClient = currentPage * servicesPerPage;
  // Calculate the index of the first client on the current page
  const indexOfFirstClient = indexOfLastClient - servicesPerPage;
  // calculate total pages
  const totalPages = Math.ceil(services.length / servicesPerPage);
  // Get the clients for the current page
  const currentClients = services.slice(indexOfFirstClient, indexOfLastClient);

  //
  const [error, setError] = useState("");
  //
  console.log(services);
  const [service, setService] = useState<service>({
    service_name: "",
    _id: `service_${nanoid(20)}`,
    isDeleted: false,
    image: undefined as unknown as assets,
    price: 250,
    doctors: [],
  });
  //

  useEffect(() => {
    setError("");
  }, [service]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const handleChangeSelectedDoctors = (
    event: SelectChangeEvent<typeof selectedDoctors>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedDoctors(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    setService((_pre) => ({
      service_name: "",
      _id: `service_${nanoid(20)}`,
      isDeleted: false,
      image: undefined as unknown as assets,
      price: 250,
      doctors: [],
      status: true,
    }));
    setSelectedDoctors([]);
  }, [open]);
  //
  useEffect(() => {
    const values = selectedDoctors.map((e) => ({
      _ref: e,
      _type: "reference",
      _key: `true.${nanoid(20)}`,
    }));
    setService((pre) => ({ ...pre, doctors: values as any }));
  }, [selectedDoctors]);
  const handleChange = (
    name: "service_name" | "price",
    value: string | number
  ) => {
    setService((pre) => ({ ...pre, [name]: value }));
  };
  const handleAddService = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Création d'un service...");
      const validation = validateService(service);
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      const res = await createService(service);
      if (res) {
        toast.dismiss();
        toast.success("Service créé avec succès");
        console.log(res);
        const image = res.image as assets;
        setServices((e) => [...e, { ...service, image, _id: res._id }]);
        setOpen(false);
      } else {
        throw Error("we got error");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Oups!");
    } finally {
      toggleOverlayStatu();
    }
  };
  const handleUpdateService = (update: service, id: string) => {
    const UpdatedService = services.map((e) => {
      if (e._id === id) {
        return update;
      }
      return e;
    });
    setServices(UpdatedService);
  };

  // State to manage the image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State to manage the selected file
  const [file, setFile] = useState<File | null>(null);

  // Function to handle image changes (add or remove)
  function handleImageChange(event: any, mode: "remove" | "add" = "add") {
    if (mode === "remove") {
      // Remove image preview and file when in remove mode
      setImagePreview(null);
      setFile(null);
      return;
    }

    // Clear existing preview and file when adding a new one
    setImagePreview(null);
    setFile(null);

    // Add new file and update image preview when in add mode
    const newFile = event.target.files[0];
    if (newFile) {
      const imageUrl = URL.createObjectURL(newFile);

      setImagePreview(imageUrl);
      setFile(newFile);
      setService((pre) => ({ ...pre, image: newFile }));
    }
  }

  return (
    <div>
      <div className="my-3 flex items-center lg:justify-center">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 btn-primary btn"
          >
            <span>Ajouter Service</span>
            <span>+</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`table table-zebra table-sm lg:table-md 2xl:table-lg`}
        >
          {/* en-tête */}
          <thead>
            <tr className="">
              <th className=""></th>
              <th>Image du Service</th>
              <th>Nom du Service</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((e, i) => (
              <ServiceCell
                update={handleUpdateService}
                doctors={props.doctors}
                index={i}
                key={e._id + "rererer"}
                service={e}
              />
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center w-full my-4">
          <div className="join">
            <button
              disabled={currentPage === 1}
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage((pre) => pre - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-outline no-animation hover:bg-white hover:text-neutral">
              Page {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((pre) => pre + 1)}
              disabled={currentPage === totalPages}
              className="join-item btn btn-outline"
            >
              »
            </button>
          </div>
        </div>
      )}
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex relative items-center justify-center p-12">
          <section className="flex w-full items-center capitalize gap-3 flex-col ">
            <div
              onClick={() => setOpen(false)}
              className="btn btn-circle btn-sm text-sm absolute top-3 right-2 btn-error btn-outline"
            >
              X
            </div>
            <div className="mb-4 capitalize text-xl">Ajouter Service</div>
            <div className="divider"></div>
            <section className="grid grid-cols-3 w-full gap-3">
              <TextField
                value={service.service_name}
                onChange={(e) =>
                  handleChange(
                    "service_name",
                    e.target.value.toLocaleLowerCase()
                  )
                }
                label="Nom du Service"
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Sélectionnez le Médecin</InputLabel>
                <Select
                  fullWidth
                  multiple
                  value={selectedDoctors}
                  label="Sélectionnez les médecins"
                  onChange={handleChangeSelectedDoctors}
                  sx={{
                    maxHeight: "300px",
                  }}
                >
                  {props.doctors.map((e) => (
                    <MenuItem key={e._id + "lop"} value={e._id}>
                      {e.fullName.toLocaleLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                value={service.price}
                onChange={(e) => handleChange("price", e.target.value)}
                type="number"
                label="Prix"
              />
            </section>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                className="file-input w-full max-w-[236px] text-xs file-input-primary"
              />
              {/* Afficher l'aperçu de l'image */}
              {imagePreview && (
                <div className="flex mt-5 items-center gap-3 flex-wrap">
                  <div className="relative">
                    <div className="max-w-[100px]">
                      <Image
                        src={imagePreview}
                        alt="Aperçu de l'image"
                        width={100}
                        height={100}
                        objectFit="contain"
                      />
                    </div>
                    <p
                      className="absolute btn btn-circle btn-sm bg-white btn-outline btn-error top-1 right-0 z-10 cursor-pointer"
                      onClick={() => handleImageChange(imagePreview, "remove")}
                    >
                      <BsTrash />
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleAddService()}
              className="btn btn-primary mt-4"
            >
              Ajouter +
            </button>
            {error && (
              <p className="text-center max-w-[300px] text-error text-sm">
                {error}
              </p>
            )}
          </section>
        </div>
      </Dialog>
    </div>
  );
}

export default ServicesContainer;
