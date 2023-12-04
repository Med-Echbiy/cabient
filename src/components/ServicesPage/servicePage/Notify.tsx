"use client";
import React, { useEffect } from "react";
import { client } from "../../../../sanity/lib/client";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { MdOutlineUpdate } from "react-icons/md";

function Notify() {
  const { id } = useParams();
  useEffect(() => {
    // Ensure the subscription is canceled when the component unmounts
    const sub = client
      .listen('*[_type == "reservation" && service._ref == $id]', {
        id,
      })
      .subscribe((update) => {
        const result = update.result;
        console.log(result);
        toast.loading("Nouvelle mise à jour. Rechargez la page", {
          icon: "🔔",
          position: "top-right",
          style: {
            padding: "10px",
          },
        });
      });

    // Clean up the subscription when the component unmounts
    return () => sub.unsubscribe();
  }, [id]);
  return <></>;
}

export default Notify;
