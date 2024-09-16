export type Response<T> = {
  data: T;
  msg: string;
  status: "success" | "error";
};
