"use client";
import useOverlay from "@/store/overlayToggle";
import React from "react";

function LoadingClient() {
  const { loading } = useOverlay();
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center">
        <p className=" flex items-center gap-3">
          <span className="loading loading-lg loading-infinity"></span>
        </p>
      </div>
    </>
  );
}

export default LoadingClient;
