import { supabase } from "@/lib/supabase";

export type ProximitySession = {
  session_token: string;
  expires_at: string;
};

export async function startProximitySession(): Promise<ProximitySession> {
  const { data, error } = await supabase.rpc("start_proximity_session" as any);

  if (error) {
    throw new Error(error.message);
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("FAILED_TO_CREATE_PROXIMITY_SESSION");
  }

  return {
    session_token: data[0].session_token,
    expires_at: data[0].expires_at,
  };
}
