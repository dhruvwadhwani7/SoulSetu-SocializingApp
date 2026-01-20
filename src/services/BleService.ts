import { SOULSETU_SERVICE_UUID } from "@/constants/ble";
import { NativeModules } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

const { BleAdvertiser } = NativeModules;

class BleService {
  private manager: BleManager;
  private scanning = false;
  private discovered = new Map<string, Device>();

  constructor() {
    this.manager = new BleManager();
  }

  // -----------------------
  // BLUETOOTH STATE CHECK
  // -----------------------
  async ensureBluetoothOn(): Promise<boolean> {
    const state = await this.manager.state();

    if (state === State.PoweredOn) {
      return true;
    }

    console.warn("⚠️ Bluetooth is OFF. Current state:", state);
    return false;
  }

  // -----------------------
  // ADVERTISING (Foreground)
  // -----------------------
  async startAdvertising(userId: string) {
    console.log("📡 Starting BLE advertising with userId:", userId);

    const shortId = userId.slice(-1); // "0015"

    await BleAdvertiser.start({
      serviceUUID: SOULSETU_SERVICE_UUID,
      payload: shortId,
    });
  }

  stopAdvertising() {
    BleAdvertiser.stop();
    console.log("🛑 Advertising stopped");
  }

  // -----------------------
  // SCANNING
  // -----------------------
  async startScan(onDeviceFound: (device: Device, token: string) => void) {
    if (this.scanning) return;

    const bluetoothReady = await this.ensureBluetoothOn();
    if (!bluetoothReady) {
      throw new Error("BLUETOOTH_OFF");
    }

    this.scanning = true;

    this.manager.startDeviceScan(
      [SOULSETU_SERVICE_UUID], // 🔑 CRITICAL CHANGE
      null,
      (error, device) => {
        if (error || !device) return;

        const serviceData = device.serviceData?.[SOULSETU_SERVICE_UUID];

        if (!serviceData) return;

        const userId = Buffer.from(serviceData, "base64").toString("utf-8");

        if (this.discovered.has(userId)) return;

        this.discovered.set(userId, device);
        onDeviceFound(device, userId);
      }
    );

    console.log("🔍 Scanning started");
  }

  stopScan() {
    if (!this.scanning) return;

    this.manager.stopDeviceScan();
    this.scanning = false;
    this.discovered.clear();
    console.log("🛑 Scanning stopped");
  }

  // -----------------------
  // TOGGLE CONTROL
  // -----------------------
  async enable(
    userToken: string,
    onDeviceFound: (device: Device, token: string) => void
  ) {
    await this.startAdvertising(userToken);
    await this.startScan(onDeviceFound);
  }

  disable() {
    this.stopScan();
    this.stopAdvertising();
  }

  destroy() {
    this.manager.destroy();
  }
}

export const bleService = new BleService();
