#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BleScanner, NSObject)

RCT_EXTERN_METHOD(startScan)
RCT_EXTERN_METHOD(stopScan)

@end

