import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Like, PublicProfile } from "./types";

export const useProfiles = (page_size: number = 10) => {
  return useQuery<PublicProfile[]>({
    queryKey: ["profiles", page_size],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_profiles", {
          page_size,
        })
        .returns<PublicProfile[]>();

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useSkipProfile = () => {
  return useMutation({
    mutationFn: async (profile: string) => {
      const { error } = await supabase.rpc("skip_profile", {
        profile,
      });

      if (error) {
        throw error;
      }
    },
  });
};

export const useLikeProfile = () => {
  return useMutation({
    mutationFn: async ({
      profile,
      answer,
      photo,
    }: {
      profile: string;
      answer: string | undefined;
      photo: string | undefined;
    }) => {
      const { error } = await supabase.rpc("like_profile", {
        profile,
        answer,
        photo,
      });

      if (error) {
        throw error;
      }
    },
  });
};

export const useReviewProfiles = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("review_profiles");

      if (error) {
        throw error;
      }
    },
  });
};

export const useLikes = () => {
  return useQuery<Like[]>({
    queryKey: ["likes"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_likes").returns<Like[]>();

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useRemoveLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interaction: string) => {
      const { error } = await supabase.rpc("remove_like", {
        interaction,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
};

export const useMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interaction: string) => {
      const { error } = await supabase.rpc("match", {
        interaction,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
};

export const useUnmatch = () => {
  return useMutation({
    mutationFn: async (interaction: string) => {
      const { error } = await supabase.rpc("unmatch", {
        interaction,
      });

      if (error) {
        throw error;
      }
    },
  });
};