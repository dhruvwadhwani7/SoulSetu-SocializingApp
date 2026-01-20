# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Eject to expo dev client

   ```bash
   npx expo prebuild --clean
   ```

3. Add the below given code in the listed directories

   #### directory: android/app/src/main/java/com/anonymous/SoulSetuSocializingApp/ble/BleAdvertiserModule.kt

   ```kotlin
   package com.anonymous.SoulSetuSocializingApp.ble

   import android.bluetooth.BluetoothAdapter
   import android.bluetooth.BluetoothManager
   import android.bluetooth.le.AdvertiseCallback
   import android.bluetooth.le.AdvertiseData
   import android.bluetooth.le.AdvertiseSettings
   import android.bluetooth.le.BluetoothLeAdvertiser
   import android.content.Context
   import android.os.ParcelUuid
   import com.facebook.react.bridge.Promise
   import com.facebook.react.bridge.ReactApplicationContext
   import com.facebook.react.bridge.ReactContextBaseJavaModule
   import com.facebook.react.bridge.ReactMethod
   import java.util.UUID

   class BleAdvertiserModule(
   private val reactContext: ReactApplicationContext
   ) : ReactContextBaseJavaModule(reactContext) {

   private var advertiser: BluetoothLeAdvertiser? = null
   private var advertiseCallback: AdvertiseCallback? = null

   override fun getName(): String = "BleAdvertiser"

   @ReactMethod
   fun start(options: com.facebook.react.bridge.ReadableMap, promise: Promise) {
      try {
         val bluetoothManager =
         reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager

         val adapter: BluetoothAdapter = bluetoothManager.adapter
         if (!adapter.isEnabled) {
         promise.reject("BLUETOOTH_OFF", "Bluetooth is turned off")
         return
         }

         advertiser = adapter.bluetoothLeAdvertiser
         if (advertiser == null) {
         promise.reject(
            "ADVERTISING_UNSUPPORTED",
            "BLE Advertising is not supported on this device"
         )
         return
         }

         val serviceUUID =
         UUID.fromString(options.getString("serviceUUID"))
         val payload =
         options.getString("payload") ?: ""

         val settings = AdvertiseSettings.Builder()
         .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
         .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
         .setConnectable(false)
         .build()

         val data = AdvertiseData.Builder()
         .addServiceUuid(ParcelUuid(serviceUUID))
         .addServiceData(
            ParcelUuid(serviceUUID),
            payload.toByteArray(Charsets.UTF_8)
         )
         .setIncludeDeviceName(false)
         .build()

         advertiseCallback = object : AdvertiseCallback() {
         override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
            promise.resolve(true)
         }

         override fun onStartFailure(errorCode: Int) {
            promise.reject(
               "ADVERTISE_FAILED",
               "Advertising failed with error code: $errorCode"
            )
         }
         }

         advertiser?.startAdvertising(settings, data, advertiseCallback)

      } catch (e: Exception) {
         promise.reject("ADVERTISE_EXCEPTION", e.message, e)
      }
   }

   @ReactMethod
   fun stop() {
      advertiser?.stopAdvertising(advertiseCallback)
      advertiseCallback = null
      advertiser = null
   }
   }


   ```

   #### directory: android/app/src/main/java/com/anonymous/SoulSetuSocializingApp/BlePackage.kt

   ```kotlin
   package com.anonymous.SoulSetuSocializingApp

   import com.facebook.react.ReactPackage
   import com.facebook.react.bridge.NativeModule
   import com.facebook.react.bridge.ReactApplicationContext
   import com.facebook.react.uimanager.ViewManager
   import com.anonymous.SoulSetuSocializingApp.ble.BleAdvertiserModule

   class BlePackage : ReactPackage {

   override fun createNativeModules(
      reactContext: ReactApplicationContext
   ): List<NativeModule> {
      return listOf(
         BleAdvertiserModule(reactContext)
      )
   }

   override fun createViewManagers(
      reactContext: ReactApplicationContext
   ): List<ViewManager<*, *>> {
      return emptyList()
   }
   }

   ```

4. Update MainApplication.kt

   ```kotlin
   import com.anonymous.SoulSetuSocializingApp.BlePackage
   ....
   ....
   ....
   PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(BlePackage())
            }
   ```

5. IOS implementation

   #### directory: ios/BleAdvertiser.swift

   ```swift
   import Foundation
   import CoreBluetooth

   @objc(BleAdvertiser)
   class BleAdvertiser: NSObject, RCTBridgeModule, CBPeripheralManagerDelegate {

   static func moduleName() -> String! {
      return "BleAdvertiser"
   }

   static func requiresMainQueueSetup() -> Bool {
      return true
   }

   private var peripheralManager: CBPeripheralManager?
   private var advertiseData: [String: Any]?

   @objc
   func start(_ options: NSDictionary,
               resolver resolve: @escaping RCTPromiseResolveBlock,
               rejecter reject: @escaping RCTPromiseRejectBlock) {

      let serviceUUID = CBUUID(string: options["serviceUUID"] as! String)
      let payload = options["payload"] as? String ?? ""

      let data = payload.data(using: .utf8)!

      advertiseData = [
         CBAdvertisementDataServiceUUIDsKey: [serviceUUID],
         CBAdvertisementDataServiceDataKey: [serviceUUID: data]
      ]

      peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
      resolve(true)
   }

   @objc
   func stop() {
      peripheralManager?.stopAdvertising()
      peripheralManager = nil
   }

   func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
      if peripheral.state == .poweredOn {
         if let advertiseData = advertiseData {
         peripheral.startAdvertising(advertiseData)
         }
      }
   }
   }

   ```

6. Rebuild Expo Dev Client

   ```bash
   npx expo run:android
   npx expo run:ios
   ```

   In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
