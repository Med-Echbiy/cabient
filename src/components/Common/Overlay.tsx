"use client";
import useOverlay from "@/store/overlayToggle";
import React, { useEffect } from "react";
import { client } from "../../../sanity/lib/client";
import { signOut, useSession } from "next-auth/react";
function Overlay() {
  const { data } = useSession();

  useEffect(() => {
    // Ensure the subscription is canceled when the component unmounts
    if (data) {
      const user = data.user as { id: string };
      const sub = client
        .listen('*[_type == "employee" && _id == $id ] ', {
          id: user.id,
        })
        .subscribe((update) => {
          const result = update.transition;
          if (result === "disappear") {
            signOut();
          }
        });
      return () => sub.unsubscribe();
    }

    // Clean up the subscription when the component unmounts
  }, [data]);
  const { overlayStatu } = useOverlay();
  return (
    <>
      {overlayStatu ? (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center h-screen z-[10000000] bg-slate-900/20"></div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Overlay;
