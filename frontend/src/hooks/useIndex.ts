import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/api";

export function useIndex() {

    return useMutation({

        mutationFn: async () => {

            const response = await api.get("/index");

            return response.data;

        }

    });

}