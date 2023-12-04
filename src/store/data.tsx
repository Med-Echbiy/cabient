import { Appointments, Client, doctor, events, service } from "@/Types/types";
import { create } from "zustand";

interface STATE {
  clients: Client[];
  services: service[];
  doctors: doctor[];
  appointments: events[];
  setDoctors: (doctors: doctor[]) => void;
  setClients: (clients: Client[]) => void;
  setServices: (services: service[]) => void;
  setAppointments: (app: events[]) => void;
  adddAppointment: (app: events) => void;
  removeAppointment: (id: string) => void;
  addClient: (client: Client) => void;
  getClients: () => Client[];
  getAppointments: () => events[];
  updateAppointment: (id: string, update: events) => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, update: Client) => void;
}

const useDataStore = create<STATE>((set, get) => ({
  clients: [],
  services: [],
  doctors: [],
  appointments: [],
  setDoctors: (doctors) => {
    set((pre) => ({
      ...pre,
      doctors: doctors,
    }));
  },
  setServices: (services) => {
    set((pre) => ({
      ...pre,
      services: services,
    }));
  },
  setClients(clients) {
    set((pre) => ({
      ...pre,
      clients: clients,
    }));
  },
  setAppointments(app) {
    set((pre) => ({
      ...pre,
      appointments: app,
    }));
  },

  addClient(client) {
    set((pre) => ({
      ...pre,
      clients: [...get().clients, client],
    }));
  },
  getClients() {
    return get().clients;
  },
  getAppointments() {
    return get().appointments;
  },
  adddAppointment(app) {
    set((pre) => ({
      ...pre,
      appointments: [...get().appointments, app],
    }));
  },
  removeAppointment(id) {
    set((pre) => ({
      ...pre,
      appointments: get().appointments.filter((e) => e._id !== id),
    }));
  },
  updateAppointment(id, update) {
    const targetAppoin = get().appointments.map((e) => {
      if (e._id !== id) {
        return e;
      }
      return update;
    });
    if (targetAppoin) {
      set((pre) => ({
        ...pre,
        appointments: targetAppoin,
      }));
    }
  },
  removeClient(id) {
    set((pre) => ({
      ...pre,
      clients: get().clients.filter((e) => e._id !== id),
    }));
  },
  updateClient(id, update) {
    const targetClient = get().clients.map((e) => {
      if (e._id !== id) {
        return e;
      }
      return update;
    });
    if (targetClient) {
      set((pre) => ({
        ...pre,
        clients: targetClient,
      }));
    }
  },
}));
export default useDataStore;
