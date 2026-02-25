import Foundation
import CoreBluetooth
import React
@objc(BleAdvertiser)
class BleAdvertiser: NSObject, CBPeripheralManagerDelegate {

  private var peripheralManager: CBPeripheralManager?
  private var resolvePromise: RCTPromiseResolveBlock?
  private var rejectPromise: RCTPromiseRejectBlock?

  override init() {
    super.init()
    self.peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
  }

  @objc(start:payload:resolver:rejecter:)
  func start(
    _ serviceUUID: String,
    payload: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {

    guard let manager = peripheralManager else {
      reject("NO_MANAGER", "Peripheral manager not initialized", nil)
      return
    }

    if manager.state != .poweredOn {
      reject("BLUETOOTH_OFF", "Bluetooth is not powered on", nil)
      return
    }

    self.resolvePromise = resolve
    self.rejectPromise = reject

    let uuid = CBUUID(string: serviceUUID)
    let manufacturerId: UInt16 = 0x1234

    var payloadData = Data()
    payloadData.append(UInt8(manufacturerId & 0xFF))
    payloadData.append(UInt8(manufacturerId >> 8))
    payloadData.append(contentsOf: payload.utf8)

    let advertisementData: [String: Any] = [
      CBAdvertisementDataServiceUUIDsKey: [uuid],
      CBAdvertisementDataManufacturerDataKey: payloadData
    ]

    manager.startAdvertising(advertisementData)
  }

  @objc
  func stop() {
    peripheralManager?.stopAdvertising()
  }

  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    if peripheral.state != .poweredOn {
      rejectPromise?("BLUETOOTH_OFF", "Bluetooth unavailable", nil)
    }
  }

  func peripheralManagerDidStartAdvertising(
    _ peripheral: CBPeripheralManager,
    error: Error?
  ) {
    if let error = error {
      rejectPromise?("ADVERTISE_FAILED", error.localizedDescription, error)
    } else {
      resolvePromise?(true)
    }
  }
}
