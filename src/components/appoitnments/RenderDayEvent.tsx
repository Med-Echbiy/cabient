"use client";

import { ThemeProvider, Tooltip, createTheme } from "@mui/material";

import React from "react";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { EventRendererProps } from "../schedular/types";
import { MdOutlineAttachMoney, MdOutlineMoneyOff } from "react-icons/md";

interface props {
  data: EventRendererProps;
}

function RenderDayEvent(props: props) {
  const { event, ...other } = props.data;
  const color = "black";
  return (
    <div
      className="event_day_container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div
        className="border-2 border-solid text-x lg:text-sm rounded-md capitalize"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: `${event.color}`,
          padding: "4px",
        }}
        onClick={event.onClick}
      >
        <div className="flex-grow flex text-neutral justify-center gap-1 flex-col">
          <div className="paid-status  self-start max-h-fit">
            {event.paid ? (
              <MdOutlineAttachMoney color={color} />
            ) : (
              <MdOutlineMoneyOff color={color} />
            )}
          </div>
          {/* <div className="flex flex-grow items-start gap-2 text-[10px]">
          <span>
            {new Date(props.data.event.start).toLocaleDateString("fr", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            {new Date(props.data.event.start).toLocaleTimeString("fr", {
              timeStyle: "short",
            })}
          </span>
        </div> */}
          <h1> {event.title} </h1>
          <div className="flex gap-1 text-[10px] 3xl:text-xs ">
            <span>
              {new Date(props.data.event.start).toLocaleTimeString("fr", {
                timeStyle: "short",
              })}
              {" - "}
              {new Date(props.data.event.end).toLocaleTimeString("fr", {
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RenderDayEvent;
