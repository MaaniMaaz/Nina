"use client";

import { createContext, useContext } from "react";

/** When true, SmartImage loads eagerly so warm-mounted home sections cache assets before unlock. */
const HomeImageWarmContext = createContext(false);

export function HomeImageWarmProvider({
  warm,
  children,
}: {
  warm: boolean;
  children: React.ReactNode;
}) {
  return (
    <HomeImageWarmContext.Provider value={warm}>{children}</HomeImageWarmContext.Provider>
  );
}

export function useHomeImageWarm(): boolean {
  return useContext(HomeImageWarmContext);
}
