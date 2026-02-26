import { supabase } from "@/lib/supabase";

type SaveSpotifyParams = {
  userId: string;
  spotifyUserId: string;
  accessToken: string;
  refreshToken: string;
  topArtists: any[];
  genres: string[];
};

export async function saveSpotifyToProfile({
  userId,
  spotifyUserId,
  accessToken,
  refreshToken,
  topArtists,
  genres,
}: SaveSpotifyParams) {
  const { error } = await supabase
    .from("profiles")
    .update({
      spotify_connected: true,
      spotify_user_id: spotifyUserId,
      spotify_access_token: accessToken,
      spotify_refresh_token: refreshToken,
      spotify_top_artists: topArtists,
      spotify_genres: genres,
      spotify_show_on_profile: true, // default ON after connect
    })
    .eq("id", userId);

  if (error) {
    console.error("Spotify save error", error);
    throw error;
  }
}

export async function toggleSpotifyVisibility(
  userId: string,
  value: boolean
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      spotify_show_on_profile: value,
    })
    .eq("id", userId);

  if (error) throw error;
}