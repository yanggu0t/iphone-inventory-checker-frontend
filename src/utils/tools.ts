import { FormatModelStock, modelStock } from "@/service/types/apple";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 取得 localStorage 的值，如果找不到該值則回傳 null
 * @param key
 * @returns
 */
export const getLocalStorage = <T>(key: string): T | string | null => {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value;
  }
};

// ... 其他現有代碼 ...

/**
 * 設定 localStorage 的值
 * @param key
 * @param value
 */
export const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 移除 localStorage 的值
 * @param key
 */
export const removeLocalStorage = (key?: string) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    localStorage.clear();
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatModelStock = (content: modelStock) => {
  const firstStore = content.pickupMessage.stores[0];
  const models: FormatModelStock[] = [];

  Object.entries(firstStore.partsAvailability).forEach(
    ([partNumber, partInfo]) => {
      const modelStock: FormatModelStock = {
        partNumber,
        productName: partInfo.messageTypes.regular.storePickupProductTitle,
        stores: content.pickupMessage.stores.map((store) => ({
          storeName: store.storeName,
          storeNumber: store.storeNumber,
          city: store.city,
          available:
            store.partsAvailability[partNumber].pickupDisplay !== "unavailable",
          pickupSearchQuote:
            store.partsAvailability[partNumber].pickupSearchQuote,
        })),
      };
      models.push(modelStock);
    },
  );

  return models;
};
