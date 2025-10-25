import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#EFEFEF",
        }}
      >
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MUMH3eVS3v/9mslgbz1_expires_30_days.png",
          }}
          resizeMode={"stretch"}
          style={{
            height: 321,
            marginTop: 17,
            marginBottom: 21,
            marginHorizontal: 20,
          }}
        />
        <Text
          style={{
            color: "#000000",
            fontSize: 16,
            marginBottom: 8,
            marginLeft: 37,
          }}
        >
          {"Ved"}
        </Text>
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 9,
            marginLeft: 39,
          }}
        >
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MUMH3eVS3v/7z3sqg5k_expires_30_days.png",
            }}
            resizeMode={"stretch"}
            style={{
              width: 4,
              height: 12,
              marginRight: 5,
            }}
          />
          <Text
            style={{
              color: "#999999",
              fontSize: 10,
            }}
          >
            {"Ahmedabad"}
          </Text>
        </View>
        <Text
          style={{
            color: "#000000",
            fontSize: 14,
            marginBottom: 20,
            marginLeft: 39,
          }}
        >
          {"Introvert until our vibes match!!"}
        </Text>
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            marginBottom: 32,
            marginLeft: 34,
          }}
        >
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 10,
              paddingTop: 12,
              paddingBottom: 10,
              paddingHorizontal: 11,
              marginRight: 8,
            }}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MUMH3eVS3v/ysmbxogn_expires_30_days.png",
              }}
              resizeMode={"stretch"}
              style={{
                width: 16,
                height: 14,
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 9,
              marginRight: 6,
            }}
            onPress={() => alert("Pressed!")}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MUMH3eVS3v/d3zmoi40_expires_30_days.png",
              }}
              resizeMode={"stretch"}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 10,
              paddingTop: 9,
              paddingBottom: 7,
              paddingHorizontal: 9,
            }}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/MUMH3eVS3v/pyhn1trh_expires_30_days.png",
              }}
              resizeMode={"stretch"}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </View>
        </View>
        <Text
          style={{
            color: "#000000",
            fontSize: 14,
            marginBottom: 21,
            marginLeft: 38,
          }}
        >
          {"About Ved"}
        </Text>
        <View
          style={{
            marginBottom: 5,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 11,
            }}
          >
            <View
              style={{
                height: 188,
                flex: 1,
                backgroundColor: "#D9D9D9",
                borderRadius: 23,
                marginRight: 12,
              }}
            ></View>
            <View>
              <View
                style={{
                  width: 142,
                  height: 91,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 23,
                  marginBottom: 6,
                }}
              ></View>
              <View
                style={{
                  width: 142,
                  height: 91,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 23,
                }}
              ></View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 142,
                height: 118,
                backgroundColor: "#D9D9D9",
                borderRadius: 23,
                marginRight: 11,
              }}
            ></View>
            <View
              style={{
                height: 118,
                flex: 1,
                backgroundColor: "#D9D9D9",
                borderRadius: 23,
              }}
            ></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
