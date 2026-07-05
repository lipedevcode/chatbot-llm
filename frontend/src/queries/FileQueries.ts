import { useQuery } from "@tanstack/react-query";
import { getFiles } from "../services/fileService";
import type { FileMeta } from "../interfaces/database";

// GET /api/v1/files
export const useFiles = () =>
  useQuery({
    queryKey: ["files"],
    queryFn: async (): Promise<FileMeta[]> => {
      const data = await getFiles();
      return Array.isArray(data) ? data : [];
    },
  });
