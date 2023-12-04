export interface Client {
  _id: string;
  fullName: string;
  age: number | null;
  adress: string;
  city: string;
  phone: number;
  email: string;
  gender: "male" | "female" | null;
  _createdAt?: string;
  dateOfBirth?: Date;
  isDeleted?: boolean;
}
export interface assets {
  asset: {
    _ref: string;
    _type: "image";
  };
}
export interface doctor {
  _id: string;
  fullName: string;
  phone?: number;
  email: string;
  isDeleted?: boolean;
  status?: boolean;
  _createdAt?: Date;
}
export interface service {
  _id: string;
  doctors: {
    _ref: string;
    _key?: string;
    _type: "reference";
  }[];
  image: assets;
  service_name: string;
  price: number;
  isDeleted?: boolean;
  status?: boolean;
}
export interface Appointments {
  _type: "reservation";
  _id: string;
  title: string;
  color: string;
  event_id: string;
  assets: {
    _key: string;
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  }[];
  client: {
    _ref: string;
    _type: "reference";
  };
  doctors: {
    _ref: string;
    _type: "reference";
  };
  start: Date;
  end: Date;
  service: {
    _ref: string;
    _type: "reference";
  };
  paid: boolean;
  confirmed?: boolean;
  amount?: number;
}

export interface events {
  _type: "reservation";
  _id: string;
  title: string;
  color: string;
  event_id: string;
  assets: {
    asset: {
      _ref: string;
    };
  }[];
  client: string;
  doctors: string;
  // data: {
  //   client: client;
  //   doctor: doctor;
  //   // service: service;
  // };
  start: Date;
  end: Date;
  service: string;
  paid: boolean;
  confirmed?: boolean;
  amount?: number;
}

export default interface state {
  title: string;
  client: string;
  doctors: string;
  start: {
    value: Date;
    validity: boolean;
    type: string;
  };
  end: {
    value: Date;
    validity: boolean;
    type: string;
  };
  service: string;
  color: string;
  assets?: // | Blob[]
  {
    _key: string;
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  }[];
  assetsBlob: Blob[];
  paid: boolean;
  confirmed?: boolean;
  amount?: number;
}

export interface employee {
  _createdAt?: Date;
  _id: string;
  _rev?: string;
  _type: "employee";
  _updatedAt?: Date;
  fullName: string;
  password: string;
  role?: "secretaire" | "admin";
}
