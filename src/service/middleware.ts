import axios from "axios";
import { setLocalStorage, getLocalStorage } from "@/utils/tools";
import { LOCAL_STORAGE } from "@/utils/enums";

const service = axios.create({
  timeout: 10000, // 請求超時秒數
});

service.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = "tw";
  return config;
});

service.interceptors.response.use(
  (response) => {
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
