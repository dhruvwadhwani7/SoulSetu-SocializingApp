import { PermissionsAndroid, Platform } from "react-native";

export async function requestBlePermissions() {
  if (Platform.OS === "ios") {
    // iOS requires adding NSBluetoothPeripheralUsageDescription and NSBluetoothCentralUsageDescription to Info.plist
    // For BLUETOOTH_ADVERTISE equivalent in iOS, check if NSBluetoothPeripheralUsageDescription is set
    // iOS handles permissions through native implementation
    return true;
  }
  if (
    Platform.OS === "android" &&
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ) {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    if (
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
    ) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);

      return (
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_ADVERTISE"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  }

  // this.showErrorToast("Permission have not been granted");

  return false;
}
