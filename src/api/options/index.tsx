import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const usePrompts = () => {
  return useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("prompts").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useChildren = () => {
  return useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase.from("children").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useCovidVaccine = () => {
  return useQuery({
    queryKey: ["covid_vaccine"],
    queryFn: async () => {
      const { data, error } = await supabase.from("covid_vaccine").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useEthnicities = () => {
  return useQuery({
    queryKey: ["ethnicities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ethnicities").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useFamilyPlans = () => {
  return useQuery({
    queryKey: ["family_plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("family_plans").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useGenders = () => {
  return useQuery({
    queryKey: ["genders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genders").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const usePets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pets").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const usePronouns = () => {
  return useQuery({
    queryKey: ["pronouns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pronouns").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useSexualities = () => {
  return useQuery({
    queryKey: ["sexualities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sexualities").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};

export const useZodiacSigns = () => {
  return useQuery({
    queryKey: ["zodiac_signs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("zodiac_signs").select("*");

      if (error) {
        throw error;
      }

      return data;
    },
    initialData: [],
  });
};