import state, {
  Appointments,
  assets,
  doctor,
  employee,
  service,
} from "@/Types/types";
import { Client as typeClient } from "@/Types/types";
import { client as Client, client } from "../../sanity/lib/client";
import { nanoid } from "nanoid";

export function getRandomHexCode() {
  const contrastColorsHex = [
    "#65a30d",
    "#facc15",
    "#84cc16",
    "#4d7c0f",
    "#22c55e",
    "#0284c7",
    "#1d4ed8",
    "#7c3aed",
    "#c026d3",
  ];

  // Choose a random index from the array
  const randomIndex = Math.floor(Math.random() * contrastColorsHex.length);

  // Return the hex code at the random index
  return contrastColorsHex[randomIndex];
}

export async function createAppointment(
  clientId: string,
  state: state,
  id: string,
  color?: string
) {
  try {
    const assetRefs = (await addAsset(state)) || [];
    const doc: Appointments = {
      _id: `reservation_${id}`,
      event_id: `reservation_${id}`,
      _type: "reservation",
      start: new Date(state.start.value),
      end: new Date(state.end.value),
      title: state.title, // Replace with your document type in Sanity
      client: {
        _ref: clientId,
        _type: "reference",
      },
      service: {
        _ref: state.service,
        _type: "reference",
      },
      doctors: {
        _ref: state.doctors,
        _type: "reference",
      },
      assets: assetRefs,
      color: state.paid ? "#22c55e" : "#fbbf24",
      paid: state.paid,
      confirmed: state.confirmed,
      amount: state.amount,
    };

    const appoint = await Client.createIfNotExists(doc, {
      autoGenerateArrayKeys: true,
    }).then((done) => done);
    // window.location.reload();
    console.log("appoint: ", appoint);

    return appoint;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export function calculateAge(birthDate: Date) {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
export async function createClient(client: typeClient) {
  const date = new Date(client.dateOfBirth as Date);

  try {
    const res = await Client.createIfNotExists({
      ...client,
      _id: `client_${nanoid(20)}`,
      _type: "client",
      fullName: client.fullName.toLocaleLowerCase(),
      phone: +`212${client.phone}`,
      adress: client.adress,
      city: client.city,
      age: calculateAge(date),
      isDeleted: false,
      dateOfBirth: new Date(date),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
export async function createDoctor(doctor: doctor) {
  try {
    const res = await client.createIfNotExists({
      ...doctor,
      _type: "unite",
      phone: Number(doctor.phone),
    });
    if (res._id) {
      return res;
    }
  } catch (error) {
    return false;
    console.log(error);
  }
}
export async function updateDoctor(update: doctor) {
  try {
    const res = await client
      .patch(update._id)
      .set({
        ...update,
        phone: Number(update.phone),
      })
      .commit();
    return res;
  } catch (error) {
    return false;
  }
}
export async function updateAppointment(
  docId: string,
  state: state,
  clients: typeClient[]
) {
  //update

  try {
    const assetRefs = (await addAsset(state)) || [];
    console.log(assetRefs);
    const clientId = clients.find((e) => e.fullName === state.title);
    console.log("update: ", state);
    const res = await Client.patch(docId)
      .set({
        client: {
          _ref: clientId?._id || state.client,
          _type: "reference",
        },
        start: new Date(state.start.value),
        end: new Date(state.end.value),
        service: {
          _ref: state.service,
          _type: "reference",
        },
        doctors: {
          _ref: state.doctors,
          _type: "reference",
        },
        assets: assetRefs,
        title: state.title,
        color: state.paid ? "#22c55e" : "#fbbf24",
      })
      .commit();
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function addAsset(state: state) {
  const assetRefs: {
    _key: string;
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  }[] = state.assets || [];
  console.log(state.assetsBlob);

  try {
    if (state.assetsBlob && state.assetsBlob.length > 0) {
      for (const assetBlob of state.assetsBlob) {
        const assetsFile = assetBlob as File;
        const asset = await Client.assets.upload("image", assetBlob as Blob, {
          contentType: assetBlob.type,
          filename: assetsFile.name.slice(0, assetsFile.name.indexOf(".")),
        });

        // Check if the asset already exists in assetRefs
        const assetExists = assetRefs.some(
          (existingAsset) => existingAsset.asset._ref === asset._id
        );

        // If the asset doesn't exist, add it to assetRefs
        if (!assetExists) {
          assetRefs.push({
            _key: nanoid(20),
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          });
        } else {
          console.log(
            `One Asset  already exists. Not adding a duplicate. we skipped it`
          );
        }
      }
    }

    return assetRefs;
  } catch (error) {
    console.log(error);
  }
}

export async function updateClient(docId: string, client: typeClient) {
  try {
    const res: typeClient = await Client.patch(docId)
      .set({
        ...client,
        phone: Number(`212${client.phone}`),
        dateOfBirth: new Date(client.dateOfBirth as Date),
        age: calculateAge(client.dateOfBirth as Date),
      })
      .commit();
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteAppointment(docId: string) {
  try {
    const res = await Client.delete(docId);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAsset(
  assets: assets[],
  target: string,
  docId: string
) {
  try {
    const filterTheTargetOut = assets.filter((e) => e.asset._ref !== target);
    console.log(filterTheTargetOut, docId);
    const req = await Client.patch(docId)
      .set({ assets: filterTheTargetOut })
      .commit();
    console.log(req);

    return req;
  } catch (error) {
    console.log(error);
  }
}

export async function createService(service: service) {
  try {
    let assetRef = null;
    const assetsFile = service.image as unknown as File;
    const asset = await Client.assets.upload(
      "image",
      service.image as unknown as Blob,
      {
        contentType: assetsFile.type,
        filename: assetsFile.name.slice(0, assetsFile.name.indexOf(".")),
      }
    );
    assetRef = {
      _key: nanoid(20),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
    const res = await Client.createIfNotExists({
      ...service,
      _type: "services",
      image: assetRef,
      price: +service.price,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export async function updateService(
  service: service,
  imageEdited: boolean,
  priceChange: number
) {
  try {
    let assetRef = null;
    if (imageEdited) {
      const assetsFile = service.image as unknown as File;
      const asset = await Client.assets.upload(
        "image",
        service.image as unknown as Blob,
        {
          contentType: assetsFile.type,
          filename: assetsFile.name.slice(0, assetsFile.name.indexOf(".")),
        }
      );
      assetRef = {
        _key: nanoid(20),
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    }
    console.log(service._id);
    const res = await Client.patch(service._id)
      .set({
        ...service,
        image: assetRef ? assetRef : service.image,
        price: +service.price,
      })
      .commit();
    // if (priceChange !== 0) {
    //   const isExist = await Client.fetch(
    //     "*[_type == 'services' && isDeleted && _id match $id && price == $price ]",
    //     {
    //       id: `${service._id.slice(0, 15)}*`,
    //       price: priceChange,
    //     }
    //   );
    //   console.log(isExist);
    //   const New_res = await Client.create({
    //     ...service,
    //     image: assetRef ? assetRef : service.image,
    //     _id: `${service._id}____V`,
    //     _type: "services",
    //     price: +service.price,
    //   });
    //   return New_res;
    // }
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function createEmployee(worker: employee) {
  try {
    const res = await Client.createIfNotExists({
      ...worker,
    });
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateEmployee(worker: employee) {
  try {
    const res = await Client.patch(worker._id)
      .set({
        ...worker,
      })
      .commit();
    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}
