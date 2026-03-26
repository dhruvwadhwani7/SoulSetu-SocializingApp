import MapView, { Marker } from "react-native-maps";
import { View, Text } from "react-native";

/** 🎨 Marker colors by place type */
const MARKER_COLORS: Record<string, string> = {
  cafe: "#7454F6",
  restaurant: "#FF7A59",
  fast_food: "#FF7A59",
  park: "#2BB673",
  place: "#7454F6",
};

type Place = {
  id: string | number;
  lat: number;
  lng: number;
  name: string;
  type: string;
};

type Props = {
  lat: number;
  lng: number;
  places: Place[];
};

export default function NearbyMap({ lat, lng, places }: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {places.map((p) => {
        const color = MARKER_COLORS[p.type] ?? MARKER_COLORS.place;

        return (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
          >
            <View style={{ alignItems: "center" }}>
              {/* Banner */}
              <View
                style={{
                  backgroundColor: color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  marginBottom: 4,
                  maxWidth: 120,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {p.name}
                </Text>
              </View>

              {/* Dot */}
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: color,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}