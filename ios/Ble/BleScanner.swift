import Foundation
import CoreBluetooth
import React

@objc(BleScanner)
class BleScanner: NSObject, CBCentralManagerDelegate {

  private var centralManager: CBCentralManager?
  private var discovered = Set<String>()
  private var eventEmitter: RCTEventEmitter?

  override init() {
    super.init()
    self.centralManager = CBCentralManager(delegate: self, queue: nil)
  }

  @objc(startScan)
  func startScan() {
    guard let manager = centralManager, manager.state == .poweredOn else {
      return
    }

    discovered.removeAll()

    manager.scanForPeripherals(
      withServices: nil,
      options: [CBCentralManagerScanOptionAllowDuplicatesKey: true]
    )
  }

  @objc(stopScan)
  func stopScan() {
    centralManager?.stopScan()
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    // Optional logging
  }

  func centralManager(
    _ central: CBCentralManager,
    didDiscover peripheral: CBPeripheral,
    advertisementData: [String : Any],
    rssi RSSI: NSNumber
  ) {
    guard let manufacturerData =
      advertisementData[CBAdvertisementDataManufacturerDataKey] as? Data
    else { return }

    let payload = manufacturerData.dropFirst(2) // remove manufacturerId
    guard let tokenPrefix = String(data: payload, encoding: .utf8) else { return }

    if discovered.contains(tokenPrefix) { return }
    discovered.insert(tokenPrefix)

    NotificationCenter.default.post(
      name: NSNotification.Name("BleTokenDetected"),
      object: tokenPrefix
    )
  }
}

