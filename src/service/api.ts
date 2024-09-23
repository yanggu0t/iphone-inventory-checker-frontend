export type BasicResponse<T> = {
  data: T;
  msg: string;
  status: "success" | "error";
};
