import React from "react";
import { BsCalendarDate } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io";

function Navbar() {
  return (
    <nav className=" flex justify-center mx-auto w-fit gap-4 p-4 mt-2 rounded-2xl bg-blue-950 text-white">
      <li className="flex items-center gap-3 p-4 cursor-pointer bg-blue-500 hover:bg-blue-500 rounded transition-all ease-linear duration-200  ">
        <BsCalendarDate />
        <span>Calendrier</span>
      </li>
      <li className="flex items-center gap-3 p-4 cursor-pointer hover:bg-blue-500 rounded transition-all ease-linear duration-200 ">
        <FaUserDoctor />
        <span>Patients</span>
      </li>
      <li className="flex items-center gap-3 p-4 cursor-pointer hover:bg-blue-500 rounded transition-all ease-linear duration-200 ">
        <IoIosStats />
        <span>Rapports</span>
      </li>
    </nav>
  );
}

export default Navbar;
