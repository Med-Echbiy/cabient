import { calculateAge } from "@/components/Crud";
import React from "react";

interface props {
  fullName: string;
  age: number | null;
  dataOfBirth: Date;
}

function Patient({ fullName, age = null, dataOfBirth }: props) {
  return (
    <>
      <figure className="px-10 pt-10">
        <div className="w-20 rounded-full shadow-md bg-gradient-to-tr from-purple-50 to-violet-600 aspect-square"></div>
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title"> {fullName} </h2>
        <p>{calculateAge(dataOfBirth)} Years</p>
      </div>
    </>
  );
}

export default Patient;
