import {
  createExpoClipboardService,
  createExpoFileService,
  createExpoMediaService,
  createExpoNotificationService,
  createExpoPlayerService,
  createExpoRecorderService,
  SendbirdUIKitContainerProps,
} from "@sendbird/uikit-react-native";

import * as ExpoAV from "expo-av";
import * as ExpoClipboard from "expo-clipboard";
import * as ExpoDocumentPicker from "expo-document-picker";
import * as ExpoFS from "expo-file-system";
import * as ExpoImageManipulator from "expo-image-manipulator";
import * as ExpoImagePicker from "expo-image-picker";
import * as ExpoMediaLibrary from "expo-media-library";
import * as ExpoNotifications from "expo-notifications";
import * as ExpoVideoThumbnail from "expo-video-thumbnails";

export const platformServices: SendbirdUIKitContainerProps["platformServices"] =
  {
    clipboard: createExpoClipboardService(ExpoClipboard),
    notification: createExpoNotificationService(ExpoNotifications),
    file: createExpoFileService({
      fsModule: ExpoFS,
      imagePickerModule: ExpoImagePicker,
      mediaLibraryModule: ExpoMediaLibrary,
      documentPickerModule: ExpoDocumentPicker,
    }),
    media: createExpoMediaService({
      avModule: ExpoAV,
      thumbnailModule: ExpoVideoThumbnail,
      imageManipulator: ExpoImageManipulator,
      fsModule: ExpoFS,
    }),
    player: createExpoPlayerService({
      avModule: ExpoAV,
    }),
    recorder: createExpoRecorderService({
      avModule: ExpoAV,
    }),
  };
