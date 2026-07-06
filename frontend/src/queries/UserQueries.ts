import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  atualizarPerfil,
  getPerfil,
  type AtualizarPerfilRequest,
} from "../services/userService";

// GET /api/v1/users/me
export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getPerfil,
  });

// PUT /api/v1/users/me
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AtualizarPerfilRequest) => atualizarPerfil(body),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
};
