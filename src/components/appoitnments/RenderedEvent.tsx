"use client";

import { ThemeProvider, Tooltip, createTheme } from "@mui/material";

import React from "react";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { EventRendererProps } from "../schedular/types";
import RenderDayEvent from "./RenderDayEvent";
import { MdOutlineAttachMoney, MdOutlineMoneyOff } from "react-icons/md";

interface props {
  data: EventRendererProps;
}

function RenderedEvent(props: props) {
  const { event, view, ...other } = props.data;

  const theme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "1em",
            color: "white",
            backgroundColor: props.data.event.color,
            minWidth: "400px",
            padding: "0px",
          },
        },
      },
    },
  });
  return (
    <>
      {view === "day" ? (
        <RenderDayEvent data={props.data} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
          onClick={props.data.onClick}
        >
          <ThemeProvider theme={theme}>
            <Tooltip
              placement="bottom"
              arrow
              title={
                <div className="flex shadow-xl rounded capitalize text-white flex-col gap-2">
                  <div className="p-3 w-full flex justify-between">
                    <span>{props.data.event.title}</span>
                    <div>
                      {event.paid ? (
                        <MdOutlineAttachMoney />
                      ) : (
                        <MdOutlineMoneyOff />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white text-sm text-black">
                    <BsCalendar2CheckFill />
                    <span>
                      {new Date(props.data.event.start).toLocaleDateString(
                        "fr",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}{" "}
                      {new Date(props.data.event.start).toLocaleTimeString(
                        "fr",
                        {
                          timeStyle: "short",
                        }
                      )}
                    </span>

                    <span>-</span>
                    <span>
                      {new Date(props.data.event.end).toLocaleDateString("fr", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date(props.data.event.end).toLocaleTimeString("fr", {
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              }
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: event.color,
                  border: "1px solid black",
                  // borderRadius: "100%",
                  display: "flex",
                  gap: "2px",
                }}
              ></div>
            </Tooltip>
          </ThemeProvider>
        </div>
      )}
    </>
  );
}

export default RenderedEvent;
