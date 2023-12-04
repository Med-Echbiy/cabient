"use client";
import { Client } from "@/Types/types";
import { BsGenderMale, BsGenderFemale, BsTrash } from "react-icons/bs";
import {
  Autocomplete,
  Dialog,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import AddPatient from "./client/AddPatient";

interface props {
  clients: Client[];
  handleFilter: (
    filters: {
      lable: "fullName" | "age" | "gender";
      value: string;
    }[]
  ) => void;
  handleSort: (by: string) => void;
}

function PatientsHeader(props: props) {
  const [gender, setGender] = useState("all");
  const [age, setAge] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  useEffect(() => {
    console.log({ search, age, gender });
    props.handleFilter([
      { lable: "fullName", value: search },
      { lable: "gender", value: gender },
      { lable: "age", value: age },
    ]);
  }, [search, age, gender]);
  useEffect(() => {
    console.log(sort);
    props.handleSort(sort);
  }, [sort]);
  const reset = () => {
    setSearch("");
    setAge("all");
    setSort("default");
    setGender("all");
    props.handleFilter([
      { lable: "fullName", value: "" },
      { lable: "gender", value: "all" },
      { lable: "age", value: "all" },
    ]);
  };
  const [open, setOpen] = useState(false);
  const close = (e: boolean) => {
    setOpen(e);
  };
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-3">
      <div className="w-full">
        <FormControl fullWidth>
          <TextField
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            label="rechercher par nom"
            fullWidth
          />
        </FormControl>
      </div>
      <div className="capitalize">
        <FormControl fullWidth>
          <InputLabel>filtrer par genre</InputLabel>
          <Select
            onChange={(e) => {
              setGender(e.target.value);
            }}
            fullWidth
            value={gender}
            label="filtrer par genre"
          >
            <MenuItem value={"all"}>Tous</MenuItem>
            <MenuItem value={"male"} className="flex items-center gap-2">
              <span>homme</span>
            </MenuItem>
            <MenuItem value={"female"} className="flex items-center gap-2">
              <span>femme</span>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="capitalize">
        <FormControl fullWidth>
          <InputLabel>filtrer par âge</InputLabel>
          <Select
            onChange={(e) => {
              setAge(e.target.value);
            }}
            fullWidth
            value={age}
            label="filtrer par âge"
          >
            <MenuItem value={"all"}>Tous</MenuItem>
            <MenuItem
              data-tip="plus jeune que 18 ans"
              value={"&lt;18"}
              className="tooltip tooltip-top flex items-center gap-2"
            >
              <span>3 - 18</span>
            </MenuItem>
            <MenuItem
              data-tip="entre 18 et 35 ans"
              value="18-35"
              className="tooltip tooltip-top flex items-center gap-2"
            >
              <span>18 - 35</span>
            </MenuItem>
            <MenuItem
              value="&gt;35"
              data-tip="plus vieux que 35 ans"
              className="tooltip tooltip-top flex items-center gap-2"
            >
              <span>35 - ♾️</span>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="capitalize">
        <FormControl fullWidth>
          <InputLabel>Trier par</InputLabel>
          <Select
            onChange={(e) => setSort(e.target.value)}
            value={sort}
            label="trier par"
          >
            <MenuItem value="default">par défaut</MenuItem>
            <ListSubheader> âge </ListSubheader>
            <MenuItem value="older-first">plus vieux d&apos;abord</MenuItem>
            <MenuItem value="younger-first">plus jeune d&apos;abord</MenuItem>
            <ListSubheader> genre</ListSubheader>
            <MenuItem value="male-first">homme d&apos;abord</MenuItem>
            <MenuItem value="female-first">femme d&apos;abord</MenuItem>
            <ListSubheader>création</ListSubheader>
            <MenuItem value="last-created">dernier créé d&apos;abord</MenuItem>
            <MenuItem value="new-created" className="">
              nouvellement créé d&apos;abord
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className=" lg:col-span-4 flex items-center lg:justify-center">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={reset}
            className="flex items-center gap-2 btn btn-neutral capitalize"
          >
            <span>réinitialiser</span>
            <span>
              <BsTrash />
            </span>
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 btn-primary btn"
          >
            <span>Ajouter Patient</span>
            <span>+</span>
          </button>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <AddPatient close={close} />
      </Dialog>
    </div>
  );
}

export default PatientsHeader;
