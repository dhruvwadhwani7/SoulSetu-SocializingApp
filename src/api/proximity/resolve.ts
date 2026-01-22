import { supabase } from "@/lib/supabase";

export type ResolvedProximityProfile = {
  profile_id: string;
  first_name: string;
  age: number;
  photo_url: string | null;
};

export async function resolveProximitySession(tokenPrefix: string) {
  console.log("🌐 Resolving token prefix:", tokenPrefix);

  const { data, error } = await supabase.rpc(
    "resolve_proximity_session" as any,
    { p_session_token_prefix: tokenPrefix },
  );

  if (error) {
    console.warn("❌ Resolve failed:", error.message);
    return null;
  }

  console.log("✅ Resolve success:", data);
  return data?.[0] ?? null;
}
