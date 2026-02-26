import { View, Text, Image } from "react-native";

type Props = {
  artists?: {
    id: string;
    name: string;
    image?: string;
  }[];
};

export function ProfileSpotify({ artists }: Props) {
  if (!artists?.length) return null;

  return (
    <View
      style={{
        marginTop: 6,
        marginBottom: 6,
        borderRadius: 22,
        padding: 14,
        backgroundColor: "#F7F5FF",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: "#7454F6",
          marginBottom: 10,
        }}
      >
        🎵 Music Taste
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {artists.slice(0, 6).map((a) => (
          <View key={a.id} style={{ alignItems: "center", width: 64 }}>
            {a.image && (
              <Image
                source={{ uri: a.image }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  marginBottom: 4,
                }}
              />
            )}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10,
                color: "#1A1A1A",
                textAlign: "center",
              }}
            >
              {a.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}