// services/spotify/spotifyProfile.ts

export type SpotifyUser = {
  id: string;
  display_name: string;
  image?: string;
};

export type SpotifyArtist = {
  id: string;
  name: string;
  image?: string;
  genres: string[];
};

export async function fetchSpotifyProfile(
  accessToken: string
): Promise<SpotifyUser> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();

  return {
    id: data.id,
    display_name: data.display_name,
    image: data.images?.[0]?.url,
  };
}

export async function fetchTopArtists(
  accessToken: string
): Promise<SpotifyArtist[]> {
  const res = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=10",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await res.json();

  return data.items.map((a: any): SpotifyArtist => ({
    id: a.id,
    name: a.name,
    image: a.images?.[0]?.url,
    genres: a.genres ?? [],
  }));
}