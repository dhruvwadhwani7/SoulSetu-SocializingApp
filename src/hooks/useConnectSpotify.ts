import { useEffect, useRef } from "react";
import * as WebBrowser from "expo-web-browser";
import { useSpotifyAuthRequest } from "@/services/spotify/spotifyAuth";
import { exchangeSpotifyCode } from "@/services/spotify/spotifyToken";
import {
  fetchSpotifyProfile,
  fetchTopArtists,
} from "@/services/spotify/spotifyProfile";

import { useMyProfile } from "@/api/my-profile";
import { saveSpotifyToProfile } from "@/services/spotify/spotify.supabase";
import { useQueryClient } from "@tanstack/react-query";

WebBrowser.maybeCompleteAuthSession();

export function useConnectSpotify() {
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();


  const [request, response, promptAsync] = useSpotifyAuthRequest();

  /** prevent duplicate auth execution */
  const handledRef = useRef(false);

  useEffect(() => {
    async function handleAuth() {
      if (!response || response.type !== "success") return;
      if (handledRef.current) return;
      handledRef.current = true;

      try {
        const code = response.params.code;

        const tokenData = await exchangeSpotifyCode(
          code,
          request?.codeVerifier!
        );

        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;

        const spotifyUser = await fetchSpotifyProfile(accessToken);
        const artists = await fetchTopArtists(accessToken);

        const genres = Array.from(
          new Set(artists.flatMap((a) => a.genres))
        );

        await saveSpotifyToProfile({
          userId: profile!.id,
          spotifyUserId: spotifyUser.id,
          accessToken,
          refreshToken,
          topArtists: artists,
          genres,
        });

        /** 🔥 refresh profile immediately */
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });

      } catch (e) {
        console.log("Spotify connect error", e);
      }
    }

    handleAuth();
  }, [response]);

  return {
    connect: () => promptAsync(),
    loading: request == null,
    connected: profile?.spotify_connected ?? false,
    artists: profile?.spotify_top_artists ?? [],
    visible: profile?.spotify_show_on_profile ?? false,
  };
}