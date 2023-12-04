"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { BsCalendarDate } from "react-icons/bs";
import { FaHandHoldingMedical, FaUserDoctor } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io";
import { MdManageAccounts, MdMedicalServices } from "react-icons/md";

function SideBar() {
  const path = usePathname();
  const styles = `  flex items-center gap-3 p-4 cursor-pointer hover:bg-blue-500 transition-all ease-linear duration-200 `;
  const { data } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (data) {
      if (data.user) {
        const user = data.user as { role: "admin" | "secrétarie" };
        const role = user.role === "admin";
        setIsAdmin(role);
      }
    }
  }, [data]);

  return (
    <aside className="max-w-[200px] flex-grow bg-neutral w-full  transition-all ease-linear py-4 text-white duration-300">
      <ul className="my-4 flex flex-col gap-4 text-xl">
        {data && (
          <>
            <Link
              href="/"
              className={`${styles} ${path === "/" && "bg-blue-500"}`}
            >
              <BsCalendarDate />
              <span>Calendrier</span>
            </Link>

            <Link
              href="/patients"
              className={`${styles} ${
                path.startsWith("/patients") && "bg-blue-500"
              }`}
            >
              <FaHandHoldingMedical />
              <span>Patients</span>
            </Link>
          </>
        )}
        {isAdmin && (
          <Link
            href="/doctors"
            className={`${styles} ${
              path.startsWith("/doctors") && "bg-blue-500"
            }`}
          >
            <FaUserDoctor />
            <span>Medecins</span>
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/services"
            className={`${styles} ${
              path.startsWith("/services") && "bg-blue-500"
            }`}
          >
            <MdMedicalServices />
            <span>Services</span>
          </Link>
        )}
        {isAdmin && (
          <Link
            href={`/rapport`}
            className={`${styles} ${path === "/rapport" && "bg-blue-500"}`}
          >
            <IoIosStats />
            <span>Rapports</span>
          </Link>
        )}
        {isAdmin && (
          <Link
            href={`/employee`}
            className={`${styles} ${path === "/employee" && "bg-blue-500"}`}
          >
            <MdManageAccounts />
            <p className="capitilize"> employés</p>
          </Link>
        )}
        {data && (
          <li className="flex-grow flex-col p-4 transition-all ease-linear duration-200 h-full flex items-end justify-end ">
            <button
              className="btn btn-wide btn-primary"
              onClick={() => signOut()}
            >
              Déconnexion
            </button>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default SideBar;
