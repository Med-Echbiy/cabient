import { Client } from "@/Types/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DateField, DateTimeField } from "@mui/x-date-pickers";
import React from "react";

interface props {
  handleClientChange: (value: string | number | Date, name: string) => void;
  client: Client;
}

function AddClient(props: props) {
  return (
    <>
      <div className="grid grid-cols-3 items-center justify-between">
        <div className="inputs flex items-center gap-4">
          <div className=" flex-grow relative px-3">
            <TextField
              label="Nom et prénom"
              type="text"
              fullWidth
              onChange={(e) =>
                props.handleClientChange(e.target.value, "fullName")
              }
              value={props.client.fullName}
            />
          </div>
        </div>
        <div className="inputs flex items-center gap-4">
          <div className=" relative flex flex-grow gap-2 items-center px-3">
            <DateField
              onChange={(e) => e && props.handleClientChange(e, "dateOfBirth")}
              fullWidth
              label="date de naissance"
              value={props.client.dateOfBirth}
            />
          </div>
        </div>
        <div className="inputs flex items-center gap-4">
          <div className=" relative flex flex-grow gap-2 items-center px-3">
            <FormControl fullWidth>
              <InputLabel>gener</InputLabel>
              <Select
                label="genre"
                value={props.client.gender}
                onChange={(e) =>
                  props.handleClientChange(
                    (e.target.value as "male") || "female",
                    "gender"
                  )
                }
                fullWidth
                placeholder="Gender"
              >
                <MenuItem value="male">Màle</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center justify-between">
        <div className="inputs  flex items-center gap-4">
          <div className=" relative flex-grow px-3">
            <TextField
              label="Adresse"
              type="text"
              fullWidth
              onChange={(e) =>
                props.handleClientChange(e.target.value, "adress")
              }
              value={props.client.adress}
            />
          </div>
        </div>
        <div className="inputs flex items-center gap-4">
          <div className=" relative flex-grow px-3">
            <TextField
              fullWidth
              label="Ville"
              onChange={(e) => props.handleClientChange(e.target.value, "city")}
              type="text"
              value={props.client.city}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center justify-between">
        <div className="inputs flex items-center gap-4">
          <div className=" relative flex-grow px-3">
            <TextField
              fullWidth
              label="Email"
              onChange={(e) =>
                props.handleClientChange(e.target.value, "email")
              }
              type="text"
              value={props.client.email}
            />
          </div>
        </div>
        <div className="inputs flex items-center gap-4">
          <div className=" relative flex flex-grow gap-2 items-center px-3">
            <p className="text-3xl">🇲🇦</p>
            <TextField
              label="Tele"
              onChange={(e) =>
                props.handleClientChange(e.target.value, "phone")
              }
              type="number"
              fullWidth
              placeholder="6 xx xx xx xx"
              value={props.client.phone}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddClient;
