import { CellRenderedProps } from "@aldabil/react-scheduler/types";
import React from "react";

interface props {
  detail: CellRenderedProps;
}

function CellRendrer(props: props) {
  const date = new Date();
  if (date > props.detail.start) {
    return (
      <button
        style={{
          cursor: "not-allowed",
          backgroundColor: "#eee",
        }}
        className="  disabled:bg-gray-50 "
        disabled
        {...props.detail}
      ></button>
    );
  }
  return (
    <button
      {...props}
      style={{ height: "100%" }}
      onClick={props.detail.onClick}
    ></button>
  );
}

export default CellRendrer;
