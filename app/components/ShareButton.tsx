import React from 'react';
import {
  Share,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type ShareResult = {
  status: 'shared' | 'dismissed';
  platform?: string;
};

type ShareError = {
  error: Error;
};

interface ShareButtonProps {
  /**
   * Title to be displayed in the share sheet
   */
  title?: string;
  
  /**
   * Message to be shared
   */
  message?: string;
  
  /**
   * URL to be shared
   */
  url?: string;
  
  /**
   * Size of the share icon
   */
  size?: number;
  
  /**
   * Color of the share icon
   */
  color?: string;
  
  /**
   * Additional styles for the button container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Callback when sharing is completed
   */
  onShareComplete?: (result: ShareResult) => void;
  
  /**
   * Callback when sharing encounters an error
   */
  onShareError?: (error: ShareError) => void;
  
  /**
   * Optional test ID for E2E testing
   */
  testID?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title = '',
  message = '',
  url = '',
  size = 24,
  color = "#002d4e",
  style,
  onShareComplete,
  onShareError,
  testID = 'share-button',
}) => {
  const handleShare = async () => {
    try {
      // Construct share options based on platform
      const shareOptions = Platform.select({
        ios: {
          title,
          message,
          url,
        },
        android: {
          title,
          message: `${message} ${url}`, // Android automatically appends URL to message
        },
        default: {
          title,
          message,
          url,
        },
      });

      const result = await Share.share(shareOptions, {
        // iOS only options
        excludedActivityTypes: Platform.select({
          ios: [
            'com.apple.UIKit.activity.Print',
            'com.apple.UIKit.activity.AssignToContact',
          ],
          default: undefined,
        }),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType (iOS)
          onShareComplete?.({
            status: 'shared',
            platform: result.activityType,
          });
        } else {
          // shared (Android)
          onShareComplete?.({ status: 'shared' });
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        onShareComplete?.({ status: 'dismissed' });
      }
    } catch (error) {
      onShareError?.({ error: error instanceof Error ? error : new Error('Share failed') });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={[styles.container, style]}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Share button"
    >
      <Feather
        name="share-2"
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type { ShareButtonProps, ShareResult, ShareError };
export default ShareButton;
