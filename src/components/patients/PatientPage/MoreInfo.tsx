import { Client } from "@/Types/types";
import React from "react";
import { FaFemale, FaMailBulk, FaMale, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAvTimer, MdOutlineMedicalInformation } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaCity } from "react-icons/fa6";
interface props {
  client: Client;
}

function MoreInfo(props: props) {
  const gender = props.client.gender === "male" ? <FaMale /> : <FaFemale />;
  const infoItemClass = "flex items-center gap-2";

  return (
    <div className=" card w-full bg-base-100 shadow-xl h-full p-4">
      <div className="flex justify-around capitalize h-full flex-col max-h-[500px]">
        <div className={infoItemClass}>
          <MdOutlineMedicalInformation />
          <span>Plus d&apos;infos</span>
        </div>
        <p className={infoItemClass}>
          <span>Genre :</span>
          <span className={infoItemClass}>
            {gender}
            <span>{props.client.gender}</span>
          </span>
        </p>
        <p className={infoItemClass}>
          <span className={infoItemClass}>
            {" "}
            <span>
              <FaPhoneAlt />
            </span>{" "}
            Téléphone :
          </span>
          <span>
            <span>{props.client.phone} </span>
          </span>
        </p>
        {props.client.adress && (
          <p className={infoItemClass}>
            <span className={infoItemClass}>
              {" "}
              <span>
                <CiLocationOn />
              </span>{" "}
              <span> Adresse :</span>{" "}
            </span>
            <span>
              <span>{props.client.adress}</span>
            </span>
          </p>
        )}
        {props.client.city && (
          <p className={infoItemClass}>
            <span className={infoItemClass}>
              <span>
                <FaCity />
              </span>
              <span> Ville :</span>
            </span>
            <span>
              <span>{props.client.city}</span>
            </span>
          </p>
        )}
        {props.client.email && (
          <p className={`${infoItemClass} lowercase`}>
            <span className={infoItemClass}>
              <span>
                <FaMailBulk />
              </span>
              <span> Email :</span>
            </span>
            <span>
              <span>{props.client.email}</span>
            </span>
          </p>
        )}
        <p className={infoItemClass}>
          <span className={infoItemClass}>
            <span>
              <MdOutlineAvTimer />
            </span>
            <span>Inscription :</span>
          </span>
          <span className="text-xs">
            {new Date(props.client._createdAt as string).toLocaleDateString(
              "fr-FR",
              {
                dateStyle: "full",
              }
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

export default MoreInfo;
