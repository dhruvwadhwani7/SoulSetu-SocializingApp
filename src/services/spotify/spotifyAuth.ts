import * as AuthSession from "expo-auth-session";

const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;

export const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "soulsetusocializingapp",
  path: "spotify-auth",
});
console.log("REDIRECT:", REDIRECT_URI);

const SCOPES = ["user-top-read", "user-read-email"];

export function useSpotifyAuthRequest() {
  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  return AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
      responseType: "code",
    },
    discovery
  );
}