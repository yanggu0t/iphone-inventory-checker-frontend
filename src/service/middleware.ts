import axios from "axios";
import { getLocalStorage } from "@/utils/tools";
import { LOCAL_STORAGE } from "@/utils/enums";

const service = axios.create({
  timeout: 10000, // 請求超時秒數
});

service.interceptors.request.use((config) => {
  const lang = getLocalStorage(LOCAL_STORAGE.APPLE_LANG_TAG) as string;
  const url = config.url;
  if (url && url.includes("/api")) {
    config.headers["Accept-Language"] = lang;
  }
  if (url && url.startsWith("/apple") && lang === "cn") {
    config.url = url.replace(/^\/apple/, "/apple-cn");
  }
  return config;
});

service.interceptors.response.use(
  (response) => {
    const url = response.config.url;
    const apple_urls = ["apple", "address-lookup"];

    if (url && apple_urls.some((item) => url.includes(item))) {
      return Promise.resolve({
        data: response.data["body"],
        msg: response.statusText,
        status: "success",
      });
    }

    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服務器回應了錯誤狀態碼
      return Promise.reject({
        data: null,
        msg: error.response.data.msg || "請求失敗",
        status: "error",
      });
    } else if (error.request) {
      // 請求已發出，但沒有收到回應
      return Promise.reject({
        data: null,
        msg: "無法連接到服務器",
        status: "error",
      });
    } else {
      // 其他錯誤
      return Promise.reject({
        data: null,
        msg: error.msg || "未知錯誤",
        status: "error",
      });
    }
  },
);

export default service;
