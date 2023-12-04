"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

function ClientWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default ClientWrapper;
