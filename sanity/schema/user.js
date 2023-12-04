const client = {
  title: "Clients",
  name: "client",
  type: "document",
  readOnly: true,
  description: "Les informations sur les clients de l'entreprise.",
  fields: [
    {
      name: "fullName",
      title: "Nom et prénom",
      type: "string",
      description: "Le nom complet du client.",
    },
    {
      title: "Âge",
      name: "age",
      type: "number",
      description: "L'âge de la personne en années.",
    },
    {
      title: "Date Of Birth",
      name: "dateOfBirth",
      type: "datetime",
    },
    {
      name: "phone",
      title: "Téléphone",
      type: "number",
      description: "Le numéro de téléphone du client.",
    },
    {
      name: "adress",
      title: "Adresse",
      type: "string",
      description: "L'adresse du client.",
    },
    {
      name: "city",
      title: "Ville",
      type: "string",
      description: "La ville de résidence du client.",
    },
    {
      name: "gender",
      title: "Genre",
      type: "string",
      description: "",
      options: {
        list: [
          { title: "mâle", value: "male" },
          { title: "female", value: "female" },
        ],
      },
    },
    {
      name: "email",
      title: "Email",
      type: "email",
      description: "L'adresse e-mail du client.",
    },
    // Plus de champs peuvent être ajoutés au besoin.
    {
      name: "isDeleted",
      title: "isDeleted",
      type: "boolean",
    },
  ],
  initialValue: {
    isDeleted: false,
  },
};

export default client;
