const employee = {
  title: "Employé",
  name: "employee",
  type: "document",
  description: "Les informations sur les employés de l'entreprise.",
  fields: [
    {
      name: "fullName",
      title: "Nom et Prénom",
      type: "string",
      description: "Le nom complet de l'employé.",
    },
    {
      name: "password",
      title: "Mot de passe",
      type: "string",
      description: "Le mot de passe de l'employé.",
    },
    {
      name: "role",
      title: "Rôle",
      type: "string",
      description: "Le rôle de l'employé dans l'entreprise.",
      options: {
        list: [
          { title: "Administrateur", value: "admin" },
          { title: "Secrétaire", value: "secrétaire" },
        ],
      },
    },
  ],
};

export default employee;
