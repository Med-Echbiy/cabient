import React from "react";
function loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* <video autoPlay={true} loop={true} src="/loading.webm" /> */}
      <p className=" flex items-center gap-3">
        <span className="loading loading-lg loading-infinity"></span>
      </p>
    </div>
  );
}

export default loading;
