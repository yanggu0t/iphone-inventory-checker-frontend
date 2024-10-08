import {
  FormatModelStock,
  FormSchema,
  modelStock,
} from "@/service/types/apple";
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
  const pickupEntry = content.pickupMessage.stores[0];
  if (!pickupEntry) return [];
  const deliveryEntry = content.deliveryMessage;
  const models: FormatModelStock[] = [];

  Object.entries(pickupEntry.partsAvailability).forEach(
    ([partNumber, partInfo]) => {
      const compactInfo =
        deliveryEntry[partNumber] && deliveryEntry[partNumber].compact;
      const pickup = content.pickupMessage.stores.map((item) => {
        const storeName = item.storeName;
        const partsAvailability = item.partsAvailability[partNumber];
        const pickupMsg = partsAvailability.pickupSearchQuote;
        const pickupType = partsAvailability.pickupType;
        const isAvailable = partsAvailability.pickupDisplay === "available";
        return {
          storeName,
          isAvailable,
          pickupMsg,
          pickupType,
        };
      });
      const modelStock: FormatModelStock = {
        partNumber,
        productName: partInfo.messageTypes.compact.storePickupProductTitle,
        pickup,
        delivery: { compact: compactInfo },
      };

      models.push(modelStock);
    },
  );

  return models;
};

export const getIsEnable = (formValues: Partial<FormSchema>) => {
  const { model, storage, color, zipCode } = formValues;
  // console.log(formValues, "tool");
  return Boolean(model && storage && color && zipCode);
};
