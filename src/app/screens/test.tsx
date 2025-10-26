import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/liYSWlbOv5/rgmv7byd_expires_30_days.png",
          }}
          resizeMode={"stretch"}
          style={styles.image}
        />
        <Text style={styles.text}>{"Photos "}</Text>
        <View style={styles.view}>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/liYSWlbOv5/mbvzekg1_expires_30_days.png",
            }}
            resizeMode={"stretch"}
            style={styles.image2}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.view2}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.view3}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.view4}>
            <View style={styles.box}></View>
          </View>
        </View>
        <View style={styles.row2}>
          <View style={styles.view2}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.view3}>
            <View style={styles.box}></View>
          </View>
          <View style={styles.view4}>
            <View style={styles.box}></View>
          </View>
        </View>
        <View style={styles.view5}>
          <View style={styles.view6}>
            <Text style={styles.text2}>{"Next"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  box: {
    width: 70,
    height: 70,
    backgroundColor: "#8F8F8F",
    borderRadius: 10,
  },
  image: {
    width: 16,
    height: 16,
    marginTop: 67,
    marginBottom: 55,
    marginLeft: 23,
  },
  image2: {
    width: 45,
    height: 45,
    marginTop: 20,
    marginBottom: 230,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 11,
    marginHorizontal: 40,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 27,
    marginHorizontal: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#050505",
    fontSize: 20,
    marginBottom: 21,
    marginLeft: 31,
  },
  text2: {
    color: "#5C5B5B",
    fontSize: 14,
  },
  view: {
    alignItems: "flex-end",
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    paddingRight: 26,
    marginBottom: 15,
    marginHorizontal: 39,
  },
  view2: {
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  view3: {
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 10,
    marginRight: 19,
  },
  view4: {
    backgroundColor: "#D9D9D9",
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 11,
  },
  view5: {
    alignItems: "center",
    marginBottom: 96,
  },
  view6: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 19,
    paddingHorizontal: 76,
  },
});
