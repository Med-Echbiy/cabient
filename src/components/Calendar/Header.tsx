import useDataStore from "@/store/data";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
interface props {
  handelStep: (e: 30 | 60 | 45) => void;
  step: 30 | 60 | 45;
  filterAppointments: (id: string, target?: string) => void;
  // handleViewChange: (e: "day" | "week") => void;
  // view: "day" | "week";
}

function Header(props: props) {
  const { doctors, services } = useDataStore();

  return (
    <div>
      <h1 className=" title text-4xl mb-lg">Calendrier</h1>
      <div className="filters flex items-start gap-3">
        {/* <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            value={props.view}
            label="view"
            onChange={(e) =>
              props.handleViewChange(e.target.value as "day" | "week")
            }
          >
            <MenuItem value={"week"}> week</MenuItem>
            <MenuItem value={"day"}> day</MenuItem>
          </Select>
        </FormControl> */}
        <FormControl>
          <InputLabel>Étape</InputLabel>
          <Select
            defaultValue={props.step}
            label="étape"
            onChange={(e) => props.handelStep(e.target.value as 30 | 45 | 60)}
          >
            <MenuItem value={45}> 45 minutes</MenuItem>
            <MenuItem value={60}> 60 minutes</MenuItem>
            <MenuItem value={30}> 30 minutes</MenuItem>
          </Select>
          <FormHelperText>
            Choisissez {"l'"} intervalle de temps entre chaque étape dans le
            calendrier.
          </FormHelperText>
        </FormControl>
        <button className="btn btn-neutral no-animation text-white h-[56px] btn-wide">
          les filtres :
        </button>
        <FormControl>
          <InputLabel>Filtres</InputLabel>
          <Select
            defaultValue="all"
            label="Médecin"
            className="min-w-[200px] max-h-[200px] capitalize"
            onChange={(e) => props.filterAppointments(e.target.value)}
            MenuProps={{ PaperProps: { sx: { maxHeight: "400px" } } }}
          >
            <MenuItem value={"all"}>All</MenuItem>
            <ListSubheader>Médecin</ListSubheader>
            {doctors.map((e) => (
              <MenuItem className=" capitalize" value={e._id} key={e._id + "e"}>
                {e.fullName}
              </MenuItem>
            ))}
            <ListSubheader>Services</ListSubheader>
            {services.map((e) => (
              <MenuItem className=" capitalize" value={e._id} key={e._id + "e"}>
                {e.service_name}
              </MenuItem>
            ))}
            <ListSubheader>Statut du Rendez-vous</ListSubheader>
            <MenuItem value={"10"}>Confirmé mais non payé</MenuItem>
            <MenuItem value={"11"}>Confirmé et payé</MenuItem>
            <MenuItem value={"00"}>Non confirmé et non payé</MenuItem>
            <MenuItem value={"01"}>Non confirmé et payé</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl>
          <InputLabel>Service</InputLabel>
          <Select
            defaultValue="all"
            label="Serivce"
            className="min-w-[200px]"
            onChange={(e) =>
              props.filterAppointments("service", e.target.value)
            }
          >
            <MenuItem value={"all"}>All</MenuItem>
            {services.map((e) => (
              <MenuItem className=" capitalize" value={e._id} key={e._id + "e"}>
                {e.service_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </div>
    </div>
  );
}

export default Header;
