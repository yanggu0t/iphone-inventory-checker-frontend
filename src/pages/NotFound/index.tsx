import { fetchModels, fetchRegions } from "@/service/api/apple";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const NotFound = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchModels(queryClient);
    fetchRegions(queryClient);
  }, []);

  return <div>404</div>;
};

export default NotFound;
