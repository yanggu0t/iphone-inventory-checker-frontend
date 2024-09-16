import { ImmerStateCreator } from "..";

export interface AppleState {}

export interface AppleActions {}

export interface AppleSlice {
  apple: AppleState & AppleActions;
}

export const createAppleSlice: ImmerStateCreator<AppleSlice> = (set) => ({
  apple: {},
});
