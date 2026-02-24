import { SOULSETU_SERVICE_UUID } from "@/constants/ble";
import { NativeModules } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

const { BleAdvertiser } = NativeModules;

/**
 * BLE Service
 *
 * Responsibilities:
 * 1. Advertise a short-lived proximity session token (prefix only)
 * 2. Scan nearby BLE devices
 * 3. Extract and validate SoulSetu proximity tokens
 * 4. Report valid discoveries exactly once per token
 *
 * Design notes:
 * - Uses Manufacturer Data (more reliable than Service Data on Android)
 * - Manufacturer Data layout:
 *     [2 bytes companyId][UTF-8 tokenPrefix]
 * - Token prefix is hex (8–12 chars)
 */
class BleService {
  private manager: BleManager;
  private scanning = false;

  /**
   * Tracks already-processed token prefixes
   * Prevents duplicate resolves & UI spam
   */
  private discovered = new Set<string>();

  constructor() {
    this.manager = new BleManager();

    // clear discovered every 20s so device can reappear
    setInterval(() => {
      this.discovered.clear();
    }, 20000);
  }

  // -----------------------
  // BLUETOOTH STATE CHECK
  // -----------------------

  /**
   * Ensures Bluetooth adapter is powered on
   * BLE operations will silently fail otherwise
   */
  async ensureBluetoothOn(): Promise<boolean> {
    const state = await this.manager.state();

    if (state === State.PoweredOn) {
      return true;
    }

    console.warn("⚠️ Bluetooth is OFF. Current state:", state);
    return false;
  }

  // -----------------------
  // ADVERTISING
  // -----------------------

  /**
   * Starts BLE advertising using a short token prefix.
   * The native module handles low-level BLE constraints.
   */
  async startAdvertising(sessionToken: string) {
    // Always stop any previous advertiser first
    BleAdvertiser.stop();

    if (!sessionToken) {
      throw new Error("MISSING_SESSION_TOKEN");
    }

    // BLE-safe prefix (hex, short-lived, privacy-safe)
    const tokenPrefix = sessionToken.slice(0, 12);

    console.log("📡 Advertising BLE token prefix:", tokenPrefix);

    // IMPORTANT:
    // TurboModules require positional arguments, not objects
    await BleAdvertiser.start(SOULSETU_SERVICE_UUID, tokenPrefix);
  }

  stopAdvertising() {
    BleAdvertiser.stop();
    console.log("🛑 Advertising stopped");
  }

  // -----------------------
  // MANUFACTURER DATA DECODING
  // -----------------------

  /**
   * Decodes manufacturer data into a valid token prefix.
   *
   * Manufacturer data format (Android):
   *   [2 bytes companyId][payload bytes]
   *
   * Returns:
   * - tokenPrefix (string) if valid
   * - null if data is not from SoulSetu
   */
  private decodeManufacturerToken(base64: string): string | null {
    try {
      // Decode base64 → binary string
      const binary = atob(base64);

      // Strip 2-byte company identifier
      const payload = binary.slice(2);

      // Validate expected token format (hex)
      if (!/^[a-f0-9]{8,16}$/i.test(payload)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  // -----------------------
  // SCANNING
  // -----------------------

  /**
   * Starts BLE scanning and reports valid proximity tokens.
   */
  async startScan(
    onDeviceFound: (device: Device, tokenPrefix: string) => void,
  ) {
    if (this.scanning) return;

    const bluetoothReady = await this.ensureBluetoothOn();
    if (!bluetoothReady) {
      throw new Error("BLUETOOTH_OFF");
    }

    this.scanning = true;
    this.discovered.clear();

    this.manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          console.error("❌ Scan error:", error);
          return;
        }
        if (!device) return;

        // Manufacturer data is the ONLY thing we care about
        const manufacturerData = device.manufacturerData;
        if (!manufacturerData) return;

        const tokenPrefix = this.decodeManufacturerToken(manufacturerData);

        if (!tokenPrefix) return;

        // Deduplicate discoveries
        if (this.discovered.has(tokenPrefix)) return;
        this.discovered.add(tokenPrefix);

        console.log("🔍 Detected SoulSetu token:", tokenPrefix);

        onDeviceFound(device, tokenPrefix);
      },
    );

    console.log("🔍 BLE scanning started");
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

  /**
   * Enables full proximity mode:
   * - Starts advertising
   * - Starts scanning
   */
  async enable(
    sessionToken: string,
    onDeviceFound: (device: Device, tokenPrefix: string) => void,
  ) {
    await this.startAdvertising(sessionToken);
    await this.startScan(onDeviceFound);
  }

  /**
   * Fully disables proximity mode
   */
  disable() {
    this.stopScan();
    this.stopAdvertising();
  }

  destroy() {
    this.manager.destroy();
  }
}

export const bleService = new BleService();
