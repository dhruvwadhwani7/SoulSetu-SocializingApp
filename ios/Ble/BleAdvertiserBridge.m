#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BleAdvertiser, NSObject)

RCT_EXTERN_METHOD(
  start:(NSString *)serviceUUID
  payload:(NSString *)payload
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(stop)

@end
