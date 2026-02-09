import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Fetch water quality by PLZ
export function useWaterQuality(plz: string | undefined) {
  return useQuery({
    queryKey: [api.water.getByPlz.path, plz],
    queryFn: async () => {
      if (!plz) return null;
      const url = buildUrl(api.water.getByPlz.path, { plz });
      const res = await fetch(url);
      if (res.status === 404) return []; // Return empty array if not found instead of error for UI handling
      if (!res.ok) throw new Error("Failed to fetch water quality data");
      return api.water.getByPlz.responses[200].parse(await res.json());
    },
    enabled: !!plz && plz.length === 5,
  });
}

// Filter Products List
export function useFilters() {
  return useQuery({
    queryKey: [api.filters.list.path],
    queryFn: async () => {
      const res = await fetch(api.filters.list.path);
      if (!res.ok) throw new Error("Failed to fetch filters");
      return api.filters.list.responses[200].parse(await res.json());
    },
  });
}

// Get Recommendations
export function useFilterRecommendations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { plz: string; householdSize?: number; budget?: number }) => {
      const res = await fetch(api.filters.recommend.path, {
        method: api.filters.recommend.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      return api.filters.recommend.responses[200].parse(await res.json());
    },
  });
}

// Create User Scan (save search history)
export function useCreateScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: string; plz: string; isSaved?: boolean }) => {
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save scan");
      return api.scans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
    },
  });
}

// Get User Scans
export function useUserScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch scans");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}
