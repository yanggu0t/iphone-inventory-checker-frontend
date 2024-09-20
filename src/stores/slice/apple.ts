import { Model } from "@/service/types/apple";
import { ImmerStateCreator } from "..";

export interface AppleState {
  langTag: string | null;
  model: Model | null;
  color: string | null;
  capacities: string | null;
  modelToken: string | null;
}

export interface AppleActions {
  setLangTag: (lang: string | null) => void;
  setModel: (model: Model | null) => void;
  setColor: (color: string | null) => void;
  setCapacities: (capacities: string | null) => void;
  setModelToken: (token: string | null) => void;
}

export interface AppleSlice {
  apple: AppleState & AppleActions;
}

const initialState: AppleState = {
  langTag: null,
  model: null,
  color: null,
  capacities: null,
  modelToken: null,
};

export const createAppleSlice: ImmerStateCreator<AppleSlice> = (set) => ({
  apple: {
    ...initialState,
    setModel: (model) => {
      set((state) => {
        state.apple.model = model;
      });
    },
    setLangTag: (lang) => {
      set((state) => {
        state.apple.langTag = lang;
      });
    },
    setColor: (color) => {
      set((state) => {
        state.apple.color = color;
      });
    },
    setCapacities: (capacities) => {
      set((state) => {
        state.apple.capacities = capacities;
      });
    },
    setModelToken: (token) => {
      set((state) => {
        state.apple.modelToken = token;
      });
    },
  },
});
