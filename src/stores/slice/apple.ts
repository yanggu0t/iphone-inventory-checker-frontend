import { Config, FormSchema, Model } from "@/service/types/apple";
import { ImmerStateCreator } from "..";

export interface AppleState {
  config: Config | null;
  langTag: string | null;
  isCollapsed: boolean;
  formData: FormSchema | null;
  isResetForm: boolean;
}

export interface AppleActions {
  setConfig: (config: Config | null) => void;
  setLangTag: (lang: string | null) => void;
  setIsCollapsed(bool: boolean): void;
  setFormData: (data: FormSchema | null) => void;
  setIsResetForm(bool: boolean): void;
}

export interface AppleSlice {
  apple: AppleState & AppleActions;
}

const initialState: AppleState = {
  config: null,
  langTag: null,
  isCollapsed: false,
  formData: null,
  isResetForm: false,
};

export const createAppleSlice: ImmerStateCreator<AppleSlice> = (set) => ({
  apple: {
    ...initialState,
    setConfig: (config) => {
      set((state) => {
        state.apple.config = config;
      });
    },
    setLangTag: (lang) => {
      set((state) => {
        state.apple.langTag = lang;
      });
    },
    setIsCollapsed: (bool) => {
      set((state) => {
        state.apple.isCollapsed = bool;
      });
    },
    setFormData: (data) => {
      set((state) => {
        state.apple.formData = data;
      });
    },
    setIsResetForm: (bool) => {
      set((state) => {
        state.apple.isResetForm = bool;
      });
    },
  },
});
