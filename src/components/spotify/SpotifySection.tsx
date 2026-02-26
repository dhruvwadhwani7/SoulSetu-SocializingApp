import { View, Text, Image } from "react-native";

type Artist = {
  id: string;
  name: string;
  image?: string;
};

type Props = {
  artists?: Artist[] | null;
  genres?: string[] | null;
};

export default function SpotifySection({ artists, genres }: Props) {
  if (!artists?.length) return null;

  return (
    <View
      className="mt-5 rounded-3xl px-5 py-5 bg-white border border-neutral-200"
      style={{
        shadowColor: "#1DB954",
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 4,
      }}
    >
      {/* Header */}
      <Text className="text-[15px] font-poppins-semibold text-[#1DB954] mb-3">
        Music Vibe
      </Text>

      {/* Artists */}
      <View className="flex-row flex-wrap gap-3 mb-3">
        {artists.slice(0, 6).map((a) => (
          <View key={a.id} className="items-center w-16">
            {a.image && (
              <Image
                source={{ uri: a.image }}
                className="w-14 h-14 rounded-full mb-1"
              />
            )}
            <Text
              numberOfLines={1}
              className="text-[10px] text-center text-neutral-600"
            >
              {a.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Genres */}
      {genres?.length ? (
        <Text className="text-[12px] text-neutral-500">
          {genres.slice(0, 4).join(" • ")}
        </Text>
      ) : null}
    </View>
  );
}