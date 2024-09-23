import { Config, Model } from "@/service/types/apple";
import { ImmerStateCreator } from "..";

export interface AppleState {
  config: Config | null;
  langTag: string | null;
  model: Model | null;
  color: string | null;
  capacities: string | null;
  modelToken: string | null;
  isCollapsed: boolean;
}

export interface AppleActions {
  setConfig: (config: Config | null) => void;
  setLangTag: (lang: string | null) => void;
  setModel: (model: Model | null) => void;
  setColor: (color: string | null) => void;
  setCapacities: (capacities: string | null) => void;
  setModelToken: (token: string | null) => void;
  setIsCollapsed(bool: boolean): void;
}

export interface AppleSlice {
  apple: AppleState & AppleActions;
}

const initialState: AppleState = {
  config: null,
  langTag: null,
  model: null,
  color: null,
  capacities: null,
  modelToken: null,
  isCollapsed: false,
};

export const createAppleSlice: ImmerStateCreator<AppleSlice> = (set) => ({
  apple: {
    ...initialState,
    setConfig: (config) => {
      set((state) => {
        state.apple.config = config;
      });
    },
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
    setIsCollapsed: (bool) => {
      set((state) => {
        state.apple.isCollapsed = bool;
      });
    },
  },
});
