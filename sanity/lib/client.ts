import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token, useCdn } from "../env";
import { Appointments, Client, doctor, service } from "@/Types/types";
import { redirect } from "next/navigation";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  token: token,
  useCdn,
});

export const getServices = async () => {
  const services: service[] = await client.fetch(
    '*[_type == "services" && !isDeleted && defined(doctors) ]',
    {},
    {
      cache: "no-store",
    }
  );
  return services;
};
export const getDoctors = async () => {
  const doctors: doctor[] = await client.fetch(
    '*[_type == "unite" && !isDeleted ]',
    {},
    {
      cache: "no-store",
    }
  );
  return doctors;
};
// this fetch also the doctors that are inactive
export const getAllDoctors = async () => {
  const doctors: doctor[] = await client.fetch(
    '*[_type == "unite" && !isDeleted]',
    {},
    {
      cache: "no-store",
    }
  );
  return doctors;
};
export const getClients = async () => {
  const clients: Client[] = await client.fetch(
    '*[_type == "client" && !isDeleted ]',
    {},
    {
      cache: "no-store",
    }
  );
  return clients;
};

export const getAllAppointments = async () => {
  return getAppointments60DaysOld();
};

export const getAppointments60DaysOld = async () => {
  let sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const appointments: Appointments[] = await client.fetch(
    `*[_type == "reservation" && defined(doctors) && defined(client) && defined(service) && dateTime(end) > dateTime('${sixtyDaysAgo.toISOString()}') ]`,
    {},
    {
      cache: "no-store",
    }
  );
  return appointments;
};

export const getOneClient = async (id: string) => {
  const Client: Client = await client.fetch(
    `*[_type == 'client' && _id == '${id}' && !isDeleted   ][0]`,
    {},
    {
      cache: "no-store",
    }
  );
  return Client;
};

export const getBasedOnClient = async (id: string) => {
  const appointments: Appointments[] = await client.fetch(
    `*[_type == 'reservation'  && client._ref == '${id}'  ]`,
    {},
    {
      cache: "no-store",
    }
  );
  return appointments;
};
// no filter for states

export const getServicesNoFilter = async () => {
  const services: service[] = await client.fetch(
    '*[_type == "services"  && defined(doctors) ]',
    {},
    {
      cache: "no-store",
    }
  );
  return services;
};
export const getDoctorsNoFilter = async () => {
  const doctors: doctor[] = await client.fetch(
    '*[_type == "unite"  ]',
    {},
    {
      cache: "no-store",
    }
  );
  return doctors;
};

export const getClientsNoFilter = async () => {
  const clients: Client[] = await client.fetch(
    '*[_type == "client" ]',
    {},
    {
      cache: "no-store",
    }
  );
  return clients;
};

export const getAllAppointmentsNoFilter = async () => {
  // const appointments: Appointments[] = await client.fetch(
  //   `*[_type == "reservation" ]`,
  //   {},
  //   {
  //     cache: "no-store",
  //   }
  // );
  return getAppointments60DaysOld();
};
export const getBasedOnClientNoFilter = async (id: string) => {
  const appointments: Appointments[] = await client.fetch(
    `*[_type == 'reservation'  && client._ref == '${id}'  ]`,
    {},
    {
      cache: "no-store",
    }
  );
  return appointments;
};
export const validateSanityLimit = async () => {
  const count = await client.fetch(
    "count(*[_type in ['reservation', 'unite', 'client','services']])"
  );
  console.log({ count });
  if (count > 8000) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
    console.log(threeMonthsAgo);
    const date = threeMonthsAgo.toISOString();
    console.log(date);
    const data = await client.delete({
      query: `*[_type == "reservation" && dateTime(end) <= dateTime("${date}") ]`,
    });
    console.log(data);
    if (data.documentIds.length < 200) {
      redirect("/you_reach_sanity_limit");
    }
  }
  return console.log("valid");
};
