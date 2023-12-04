import React from "react";

interface props {
  children: React.ReactNode;
}

function NoAppointments(props: props) {
  return (
    <div className="flex items-center h-full justify-center">
      {props.children}
    </div>
  );
}

export default NoAppointments;
