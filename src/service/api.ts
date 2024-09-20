export type BackendResponse<T> = {
  data: T;
  msg: string;
  status: "success" | "error";
};
