const CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = "soulsetusocializingapp://spotify-auth";

export async function exchangeSpotifyCode(
  code: string,
  codeVerifier: string
) {
  console.log("TOKEN FILE RUNNING");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier, // ✅ REQUIRED FOR PKCE
  }).toString();

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await res.text();
  console.log("Spotify token raw response:", text);

  if (!res.ok) {
    throw new Error("Spotify token exchange failed");
  }

  return JSON.parse(text);
}