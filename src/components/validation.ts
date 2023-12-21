import state, {
  Client,
  doctor,
  employee,
  events,
  service,
} from "@/Types/types";
import { calculateAge } from "./Crud";

export async function submitValidation(
  state: state,
  appointments: events[],
  mode: "create" | "edite" = "create"
) {
  console.log(state, appointments);
  if (!state.client) {
    return {
      approved: false,
      msg: "Veuillez choisir un client ou en créer un",
    };
  }
  if (!state.service) {
    return { approved: false, msg: "Veuillez choisir un service" };
  }

  if (!state.doctors) {
    return {
      approved: false,
      msg: "Veuillez choisir une unité pour ce service",
    };
  }
  if (
    mode === "edite" &&
    ((state.amount as number) < 100 || state.amount === undefined)
  ) {
    return {
      isValid: false,
      msg: "Le prix du service ne peut pas être inférieur à 100 Dh",
    };
  }
  const currentDate = new Date(); // Get the current date and time

  if (
    state.start.value.getHours() > 18 ||
    state.start.value.getHours() < 9 ||
    state.end.value.getHours() > 19 ||
    state.end.value.getHours() < 9
  ) {
    return {
      approved: false,
      msg: "Veuillez noter que les heures d'ouverture sont de 9 h à 18 h.",
    };
  }

  // Ensure start time is not earlier than the current date and time
  // if (state.start.value < currentDate) {
  //   return {
  //     approved: false,
  //     msg: "La date de début ne peut pas être antérieure à la date actuelle.",
  //   };
  // }

  if (state.start.value >= state.end.value) {
    return {
      isValid: false,
      msg: "La date de début doit être antérieure à la date de fin.",
    };
  }

  // Calculate the duration in hours between start and end
  const startHours = state.start.value.getHours();
  const startMinutes = state.start.value.getMinutes();
  const endHours = state.end.value.getHours();
  const endMinutes = state.end.value.getMinutes();

  if (startHours === endHours) {
    if (startMinutes + 9 >= endMinutes) {
      return {
        isValid: false,
        msg: "Les heures de début et de fin sont trop proches. Veuillez sélectionner une plage horaire d'au moins 10 minutes.",
      };
    }
  }

  const filterIt = appointments.filter(
    (e) =>
      new Date(e.start) < new Date(state.end.value) &&
      new Date(state.start.value) < new Date(e.end)
  );

  if (mode === "create" && filterIt.length > 5) {
    return {
      approved: false,
      msg: "Vous ne pouvez pas ajouter plus de rendez-vous, c'est complet",
    };
  }
  return { approved: true, msg: "Tout est en ordre!" };
}

export async function createClientValidation(
  client: Client,
  users: { fullName: string }[],
  mode: "update" | "create" = "create"
) {
  const fullNamePattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (client.fullName.length < 6 || !fullNamePattern.test(client.fullName)) {
    return {
      isValid: false,
      msg: `"Assurez-vous d'entrer un nom complet avec un espace entre les mots et d'une longueur d'au moins 6 caractères."`,
    };
  }
  if (calculateAge(client.dateOfBirth as Date) < 2) {
    return {
      isValid: false,
      msg: "L'âge du client doit être spécifié et être supérieur à 2.",
    };
  }
  if (!client.gender) {
    return {
      isValid: false,
      msg: "Veuillez spécifier le genre du client.",
    };
  }

  const isUser = users.find(
    (e) =>
      e.fullName.toLocaleLowerCase() === client.fullName.toLocaleLowerCase()
  );
  if (mode === "create" && isUser) {
    return { isValid: false, msg: "Le client est déjà enregistré." };
  }

  const phonePattern = /^[6-7][0-9]{8}/;
  if (
    !phonePattern.test(client.phone.toString()) ||
    client.phone.toString().length !== 9
  ) {
    return {
      isValid: false,
      msg: `"Votre numéro de téléphone n'est pas valide. Assurez-vous qu'il commence par 6 ou 7 et qu'il comporte 9 chiffres."`,
    };
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (client.email && !emailPattern.test(client.email)) {
    return {
      isValid: false,
      msg: "Adresse e-mail non valide. Veuillez entrer une adresse e-mail valide.",
    };
  }

  return {
    isValid: true,
    msg: "Toutes les validations sont passées avec succès.",
  };
}

export function validateDoctor(doctor: doctor, mode: "add" | "edite" = "add") {
  if (
    !doctor.fullName ||
    doctor.fullName.length < 5 ||
    !doctor.fullName.includes(" ")
  ) {
    return {
      msg: "Assurez-vous d'entrer un nom complet avec un espace entre les mots et d'une longueur d'au moins 6 caractères.",
      isApproved: false,
    };
  }
  const phonePattern = /^(2126|2127)\d{8}$/;
  const phone = doctor.phone as number;
  if (
    mode === "add" &&
    (!phonePattern.test(phone.toString()) || phone.toString().length !== 12)
  ) {
    return {
      isValid: false,
      msg: `"Votre numéro de téléphone n'est pas valide. Assurez-vous qu'il commence par 2126 ou 2127 et qu'il comporte 12 chiffres."`,
    };
  }
  console.log(mode);
  if (
    mode === "edite" &&
    (!phonePattern.test(phone.toString() as string) ||
      phone.toString().length !== 12)
  ) {
    return {
      isValid: false,
      msg: `"Votre numéro de téléphone n'est pas valide. Assurez-vous qu'il commence par 2126 ou 2127 et qu'il comporte 12 chiffres."`,
    };
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (doctor.email && !emailPattern.test(doctor.email)) {
    return {
      isValid: false,
      msg: "Adresse e-mail non valide. Veuillez entrer une adresse e-mail valide.",
    };
  }
  return {
    isValid: true,
    msg: "Toutes les validations sont passées avec succès.",
  };
}

export function validateService(update: service) {
  console.log(update.doctors);
  if (update.doctors.filter((e) => e._key?.startsWith("true")).length < 1) {
    return {
      isValid: false,
      msg: "Vous devez avoir au moins un médecin pour proposer le service",
    };
  }
  if (update.service_name.length <= 4) {
    return {
      isValid: false,
      msg: "Le nom du service est trop court, vous avez besoin de plus de 4 caractères",
    };
  }
  if (update.price < 100) {
    return {
      isValid: false,
      msg: "Le prix du service ne peut pas être inférieur à 100 Dh",
    };
  }
  if (!update.image) {
    return {
      isValid: false,
      msg: "Vous devez avoir une image du service",
    };
  }
  return {
    isValid: true,
    msg: "",
  };
}

export function validateEmployee(worker: employee) {
  if (!worker.fullName || worker.fullName.length < 4) {
    return {
      isValid: false,
      msg: "Nom complet invalide. Veuillez entrer un nom complet d'au moins 4 caractères.",
    };
  }
  if (!worker.password || worker.password.length < 5) {
    return {
      isValid: false,
      msg: "Mot de passe invalide. Veuillez entrer un mot de passe d'au moins 5 caractères.",
    };
  }
  if (!worker.role) {
    return {
      isValid: false,
      msg: "Rôle manquant. Veuillez sélectionner un rôle pour l'employé.",
    };
  }
  return {
    isValid: true,
    msg: "",
  };
}
