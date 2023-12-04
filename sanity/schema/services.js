const services = {
  title: "Services",
  name: "services",
  type: "document",
  readonly: true,
  description: "Les informations sur les services offerts.",
  fields: [
    {
      name: "service_name",
      title: "Titre du Service",
      type: "string",
      description: "Le nom du service.",
    },
    {
      name: "image",
      type: "image",
      title: "Image du Service",
      description: "L'image représentant le service.",
    },
    {
      name: "price",
      title: "Prix",
      type: "number",
      description: "Le prix du service.",
    },
    // {
    //   name: "color",
    //   title: "Couleur",
    //   type: "string",
    //   options: {
    //     list: [
    //       { title: "Bleu", value: "#2563eb" },
    //       { title: "Vert", value: "#10b981" },
    //       { title: "Rouge", value: "#e11d48" },
    //       { title: "Jaune", value: "#fbbf24" },
    //       { title: "Orange", value: "#fb923c" },
    //       { title: "Violet", value: "#9333ea" },
    //       { title: "Rose", value: "#f472b6" },
    //       { title: "Gris", value: "#6b7280" },
    //       { title: "Noir", value: "#000000" },
    //       { title: "Blanc", value: "#ffffff" },
    //       { title: "Marron", value: "#7f5539" },
    //       { title: "Turquoise", value: "#06b6d4" },
    //       { title: "Argent", value: "#c0c0c0" },
    //       { title: "Or", value: "#ffd700" },
    //       { title: "Bordeaux", value: "#800020" },
    //       { title: "Beige", value: "#f5f5dc" },
    //       { title: "Magenta", value: "#ff00ff" },
    //       { title: "Cyan", value: "#00ffff" },
    //       { title: "Lavande", value: "#e6e6fa" },
    //       { title: "Olive", value: "#808000" },
    //     ],
    //     description: "La couleur associée au service.",
    //   },
    // },
    {
      name: "doctors",
      title: "Médecins Offrant le Service",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "unite",
            },
          ],
        },
      ],
      description: "Les médecins qui offrent ce service.",
    },
    {
      name: "isDeleted",
      title: "isDeleted",
      type: "boolean",
    },
    {
      name: "status",
      title: "status",
      type: "boolean",
      initialValue: true,
    },
  ],
  initialValue: {
    isDeleted: false,
    status: true,
  },
};

export default services;
