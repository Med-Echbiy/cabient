import { assets, doctor, service } from "@/Types/types";
import useOverlay from "@/store/overlayToggle";
import {
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validateService } from "../validation";
import Link from "next/link";
import { urlForImage } from "../../../sanity/lib/image";
import { BsCheck, BsPencil, BsTrash, BsXCircle } from "react-icons/bs";
import Image from "next/image";
import { updateService } from "../Crud";

interface props {
  doctors: doctor[];
  index: number;
  service: service;
  update: (service: service, id: string) => void;
}

function ServiceCell(props: props) {
  const { toggleOverlayStatu } = useOverlay();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  //
  const [service, setService] = useState<service>({
    service_name: props.service.service_name,
    _id: props.service._id,
    isDeleted: false,
    image: props.service.image,
    price: props.service.price,
    doctors: props.service.doctors,
    status: props.service.status,
  });
  //

  useEffect(() => {
    setError("");
  }, [service]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(
    props.service.doctors
      .filter((e) => !e._key?.startsWith("false"))
      .map((e) => e._ref)
  );
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
      service_name: props.service.service_name,
      _id: service._id,
      isDeleted: false,
      image: props.service.image,
      price: props.service.price,
      doctors: props.service.doctors,
      status: props.service.status,
    }));
  }, [open]);
  //
  useEffect(() => {
    const values = props.doctors.map((a) => {
      const find = selectedDoctors.find((e) => e === a._id);
      if (!find) {
        return {
          _ref: a._id,
          _type: "reference",
          _key: `false.${nanoid(20)}`,
        };
      }
      return {
        _ref: a._id,
        _type: "reference",
        _key: `true.${nanoid(20)}`,
      };
    });
    setService((pre) => ({ ...pre, doctors: values as any }));
  }, [selectedDoctors]);
  const handleChange = (
    name: "service_name" | "price" | "status",
    value: string | number | boolean
  ) => {
    setService((pre) => ({ ...pre, [name]: value }));
  };
  const handleAddService = async () => {
    toggleOverlayStatu();
    try {
      toast.loading("Mise à jour d'un service...");
      const validation = validateService(service);
      if (!validation.isValid) {
        setError(validation.msg);
        throw Error(validation.msg);
      }
      console.log(service._id);
      const priceChange =
        props.service.price === service.price ? 0 : props.service.price;
      const res = await updateService(service, imageEdited, priceChange);
      if (res) {
        toast.dismiss();
        toast.success("Service mis à jour avec succès!");
        console.log(res);
        const image = res.image as assets;
        //   setServices((e) => [...e, service]);
        props.update(
          { ...service, image, _id: res._id, price: res.price },
          service._id
        );
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

  // State to manage the image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Function to handle image changes (add or remove)
  function handleImageChange(event: any, mode: "remove" | "add" = "add") {
    if (mode === "remove") {
      // Remove image preview and file when in remove mode
      setImagePreview(null);
      setImageEdited(false);
      setService((pre) => ({ ...pre, image: props.service.image }));
      return;
    }

    // Clear existing preview and file when adding a new one
    setImagePreview(null);

    // Add new file and update image preview when in add mode
    const newFile = event.target.files[0];
    if (newFile) {
      const imageUrl = URL.createObjectURL(newFile);

      setImagePreview(imageUrl);
      setService((pre) => ({ ...pre, image: newFile }));
    }
  }
  const [imageEdited, setImageEdited] = useState(false);
  return (
    <tr>
      <th>{props.index + 1}</th>
      <td>
        <img
          className="max-w-[50px] rounded aspect-square object-cover"
          src={`${urlForImage(props.service.image)}`}
          alt={props.service.service_name}
        />
      </td>
      <td
        className="tooltip tooltip-top cursor-pointer"
        data-tip="cliquez pour visiter"
      >
        {/* Lien vers la page de détails du médecin */}
        <Link className="capitalize" href={`/services/${props.service._id}`}>
          {props.service.service_name.toLowerCase()}
        </Link>
      </td>
      <td>{props.service.price}Dh</td>

      <td className="capitalize">
        {/* Affichage du statut du servce */}
        {props.service.status ? (
          <p className="flex items-center gap-2">
            <span>Actif</span>
            <BsCheck />
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <span>Inactif</span>
            <BsXCircle />
          </p>
        )}
      </td>
      <td className="flex items-center gap-2">
        {/* Bouton pour ouvrir la boîte de dialogue de mise à jour */}
        <button
          onClick={() => setOpen(true)}
          className="btn btn-sm bg-violet-600 hover:bg-violet-600 text-white  flex items-center gap-2"
        >
          Mettre à jour
          <span>
            <BsPencil />
          </span>
        </button>
      </td>
      {/* Boîte de dialogue pour mettre à jour les informations du service */}

      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex relative items-center justify-center p-12">
          <section className="flex w-full items-center capitalize gap-3 flex-col ">
            <div
              onClick={() => setOpen(false)}
              className="btn btn-circle btn-sm text-sm absolute top-3 right-2 btn-error btn-outline"
            >
              X
            </div>
            <div className="mb-4 capitalize text-xl">
              Mettre à jour le Service
            </div>
            <div className="divider"></div>
            <section className="grid grid-cols-2 gap-3 items-center">
              <TextField
                fullWidth
                value={service.service_name}
                onChange={(e) =>
                  handleChange(
                    "service_name",
                    e.target.value.toLocaleLowerCase()
                  )
                }
                label="Nom du Service"
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
              <div className="flex  gap-1 w-full items-center">
                {/* Interrupteur pour basculer le statut du médecin */}
                <Switch
                  inputProps={{ "aria-label": "controlled" }}
                  checked={service.status}
                  onChange={(e) => handleChange("status", e.target.checked)}
                />
                <p> {service.status ? "actif" : "inactif"} </p>
              </div>
            </section>

            <div>
              {imageEdited && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e)}
                  className="file-input w-full text-xs file-input-primary"
                />
              )}
              {/* Afficher l'aperçu de l'image */}
              {imageEdited && imagePreview && (
                <div className="flex mt-5 items-center w-full gap-3 flex-wrap">
                  <div className="max-w-[150px] relative mx-auto">
                    <div className="max-w-[100px] mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Aperçu de l'image"
                        width={100}
                        height={100}
                        objectFit="contain"
                      />
                    </div>
                    <p
                      className=" absolute btn btn-circle btn-xs bg-white btn-outline btn-error top-1 right-0 z-10 cursor-pointer"
                      onClick={() => handleImageChange(imagePreview, "remove")}
                    >
                      <BsTrash />
                    </p>
                  </div>
                </div>
              )}
              {!imageEdited && (
                <div className="flex mt-5 items-center w-full gap-3 flex-wrap">
                  <div className="max-w-[150px] relative mx-auto">
                    <div className="max-w-[100px] mx-auto">
                      <Image
                        src={`${urlForImage(props.service.image)}`}
                        alt="Aperçu de l'image"
                        width={100}
                        height={100}
                        objectFit="contain"
                      />
                    </div>
                    <p
                      className=" absolute btn btn-circle btn-xs bg-white btn-outline btn-error top-1 right-0 z-10 cursor-pointer"
                      onClick={() => setImageEdited(true)}
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
              Mettre à jour
            </button>
            {error && (
              <p className="text-center max-w-[300px] text-error text-sm">
                {error}
              </p>
            )}
          </section>
        </div>
      </Dialog>
    </tr>
  );
}

export default ServiceCell;
