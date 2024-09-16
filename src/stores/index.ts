// src/store/index.ts
import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { AppleSlice, createAppleSlice } from "./slice/apple";

type StoreState = AppleSlice;

export const useStore = create<StoreState>()(
  devtools(
    immer((...args) => ({
      ...createAppleSlice(...args),
    })),
  ),
);

export type ImmerStateCreator<T extends Partial<StoreState>> = StateCreator<
  StoreState,
  [["zustand/immer", never], never],
  [],
  T
>;
