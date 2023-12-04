"use client";
import { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import Header from "./Header";
import { Appointments, Client, doctor, events, service } from "@/Types/types";
import useDataStore from "@/store/data";
import { ThemeProvider, createTheme } from "@mui/material";
import Container from "../appoitnments/Container";
import CellRendrer from "../appoitnments/CellRendrer";
import RenderedEvent from "../appoitnments/RenderedEvent";
import useOverlay from "@/store/overlayToggle";
import { Scheduler } from "../schedular";
import { DayProps } from "../schedular/views/Day";
import { WeekProps } from "../schedular/views/Week";
import { ProcessedEvent } from "../schedular/types";
import RenderDayEvent from "../appoitnments/RenderDayEvent";

//----------

interface props {
  appointments: Appointments[];
  events: events[];
  doctors: doctor[];
  clients: Client[];
  services: service[];
}
//----------

function Calendar(props: props) {
  const [windowClient, setWindow] = useState(false);
  useEffect(() => {
    if (window !== undefined) {
      setWindow(true);
    }
  }, []);
  const [step, setStep] = useState<30 | 60 | 45>(60);
  const handleStep = (e: 30 | 60 | 45) => {
    setStep(e);
  };
  const {
    setAppointments,
    setDoctors,
    setClients,
    setServices,
    getAppointments,
    appointments,
  } = useDataStore();
  // ---- -----
  //Effect
  useEffect(() => {
    // console.log("EVENTS: ", props.events);
    setAppointments(props.events);
    setDoctors(props.doctors);
    setClients(props.clients);
    setServices(props.services);
  }, [
    props.clients,
    props.doctors,
    props.events,
    props.services,
    setAppointments,
    setClients,
    setDoctors,
    setServices,
  ]);

  const [events, setEvents] = useState(props.events);
  const [filtering, setFiltring] = useState("all");
  useEffect(() => {
    setEvents(
      getAppointments().map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }))
    );
    filterEvents(filtering);
  }, [appointments, getAppointments]);
  // do not include the filtering in dependecies

  const filterEvents = (id: string, target?: string) => {
    setFiltring(id);
    console.log(getAppointments().find((e) => e.doctors === id));
    if (id === "all") {
      setEvents(getAppointments());
      return null;
    }
    if ((id.startsWith("0") || id.startsWith("1")) && id.length === 2) {
      let appoint;
      switch (id) {
        case "01":
          appoint = getAppointments().filter((e) => !e.confirmed && e.paid);
          break;
        case "11":
          appoint = getAppointments().filter((e) => e.confirmed && e.paid);
          break;
        case "10":
          appoint = getAppointments().filter((e) => e.confirmed && !e.paid);
          break;
        case "00":
          appoint = getAppointments().filter((e) => !e.confirmed && !e.paid);
          break;
        default:
          break;
      }
      setEvents(appoint || []);
      return;
    }
    if (id !== "all") {
      const appoint = getAppointments().filter(
        (e) => e.service === id || e.doctors == id
      );
      setEvents(appoint);
    }
  };
  //-------------
  // const handleViewChange = (e: "day" | "week" = "day") => {
  //   setView(e);
  // };
  //-------------
  //options
  const day: DayProps = {
    startHour: 9,
    endHour: 19,
    step: step,
  };
  const week: WeekProps = {
    weekStartOn: 1,
    startHour: 9,
    endHour: 19,
    step: step,
    weekDays: [0, 1, 2, 3, 4, 5, 6],
  };
  //----------

  const theme = createTheme({
    palette: {
      primary: {
        main: "#071935",
      },
      secondary: {
        main: "#057AFF",
      },
    },
  });
  if (!windowClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className=" flex items-center gap-3">
          <span className="loading loading-lg loading-infinity"></span>
        </p>
      </div>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="grid w-full overflow-x-hidden grid-cols-1 place-content-center max-w-full p-4">
        <Header
          handelStep={handleStep}
          step={step}
          filterAppointments={filterEvents}
          // handleViewChange={handleViewChange}
          // view={view}
        />
        <Scheduler
          // onDelete={(e) => handelDelete(e)}
          loading={false}
          draggable={true}
          view={"week"}
          locale={fr}
          hourFormat="24"
          height={750}
          day={{
            ...day,
            cellRenderer: (props) => <CellRendrer detail={props} />,
          }}
          week={{
            ...week,
            cellRenderer: (props) => <CellRendrer detail={props} />,
          }}
          events={events as ProcessedEvent[]}
          customEditor={(sch) => <Container sch={sch} />}
          eventRenderer={(props) => {
            return <RenderedEvent data={props} />;
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default Calendar;
