import { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import React, { useEffect, useState } from "react";

import useDataStore from "@/store/data";
import { Client, doctor, service } from "@/Types/types";
import toast from "react-hot-toast";
import ShowCase from "./show/ShowCase";
import AddAppointment from "./add/AddAppointment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Lottie from "lottie-react";
import Medical from "../../asset/loading.json";
interface props {
  sch: SchedulerHelpers;
}

function Container(props: props) {
  const { clients, services, doctors } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    client: Client;
    service: service;
    doctor: doctor;
  } | null>(null);
  useEffect(() => {
    if (props.sch.edited?.service) {
      const client = clients.find(
        (e: Client) => e._id === props.sch.edited?.client
      );
      const service = services.find((e) => e._id === props.sch.edited?.service);
      const doctor = doctors.find((e) => e._id === props.sch.edited?.doctors);
      if (
        client === undefined ||
        doctor === undefined ||
        service === undefined
      ) {
        toast.error("oops");
      } else {
        setData({ client, service, doctor });
      }
    }
    setLoading(false);
  }, [clients, doctors, props.sch, services]);

  if (loading) {
    return <></>;
  }

  if (data !== null) {
    // const newDate = new Date();
    // const date = props.sch.edited?.end;

    return (
      <ShowCase
        sch={props.sch}
        client={data.client}
        service={data.service}
        doctor={data.doctor}
      />
    );
  }
  return (
    <AddAppointment
      sch={props.sch}
      clients={clients}
      doctors={doctors}
      services={services}
    />
  );
}

export default Container;
