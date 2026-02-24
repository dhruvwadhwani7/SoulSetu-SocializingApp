package com.anonymous.SoulSetuSocializingApp.ble

import android.bluetooth.BluetoothAdapter
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import android.os.ParcelUuid
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.UUID

class BleAdvertiserModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private var advertiseCallback: AdvertiseCallback? = null

  override fun getName(): String = "BleAdvertiser"

  @ReactMethod
  fun start(serviceUUID: String, payload: String, promise: Promise) {
    val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled) {
      promise.reject("BLUETOOTH_OFF", "Bluetooth is disabled")
      return
    }

    val advertiser = bluetoothAdapter.bluetoothLeAdvertiser
    if (advertiser == null) {
      promise.reject("NO_ADVERTISER", "BLE advertiser not available")
      return
    }

    val uuid = UUID.fromString(serviceUUID)
    val manufacturerId = 0x1234 // any fixed 16-bit ID

    Log.d("BLE_ADVERTISER", "Starting advertising")
    Log.d("BLE_ADVERTISER", "Service UUID: $serviceUUID")
    Log.d("BLE_ADVERTISER", "Manufacturer ID: $manufacturerId")
    Log.d("BLE_ADVERTISER", "Payload: $payload")
    Log.d(
      "BLE_ADVERTISER",
      "Payload bytes: ${payload.toByteArray(Charsets.UTF_8).size}"
    )

    val settings = AdvertiseSettings.Builder()
      .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
      .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
      .setConnectable(false)
      .build()

    val data = AdvertiseData.Builder()
      .addManufacturerData(
        manufacturerId,
        payload.toByteArray(Charsets.UTF_8)
      )
      .setIncludeDeviceName(false)
      .build()

    advertiseCallback = object : AdvertiseCallback() {
      override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
        Log.d("BLE_ADVERTISER", "Advertising started successfully")
        promise.resolve(true)
      }

      override fun onStartFailure(errorCode: Int) {
        Log.e("BLE_ADVERTISER", "Advertising failed with error code: $errorCode")
        promise.reject("ADVERTISE_FAILED", "Error code: $errorCode")
      }
    }

    advertiser.startAdvertising(settings, data, advertiseCallback)
  }

  @ReactMethod
  fun stop() {
    val bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
    val advertiser = bluetoothAdapter?.bluetoothLeAdvertiser
    advertiseCallback?.let {
      advertiser?.stopAdvertising(it)
      Log.d("BLE_ADVERTISER", "Advertising stopped")
    }
    advertiseCallback = null
  }
}
