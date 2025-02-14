import React, { useCallback } from 'react';
import {
  Share,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ShareResult = {
  status: 'shared' | 'dismissed';
  platform?: string;
};

export type ShareError = {
  error: Error;
};

export interface ShareButtonProps {
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
  size = 28,
  color = '#007aff',
  style,
  onShareComplete,
  onShareError,
  testID = 'share-button',
}) => {
  const handleShare = useCallback(async () => {
    try {
      // Construct share options based on platform
      const shareOptions =
        Platform.OS === 'android'
          ? { title, message: `${message} ${url}` }
          : { title, message, url };

      // iOS-specific excluded activities
      const excludedActivityTypes =
        Platform.OS === 'ios'
          ? ['com.apple.UIKit.activity.Print', 'com.apple.UIKit.activity.AssignToContact']
          : undefined;

      const result = await Share.share(shareOptions, { excludedActivityTypes });

      if (result.action === Share.sharedAction) {
        onShareComplete?.({
          status: 'shared',
          platform: result.activityType ?? undefined,
        });
      } else if (result.action === Share.dismissedAction) {
        onShareComplete?.({ status: 'dismissed' });
      }
    } catch (error) {
      onShareError?.({
        error: error instanceof Error ? error : new Error('Share failed'),
      });
    }
  }, [title, message, url, onShareComplete, onShareError]);

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={[styles.container, style]}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Share button"
    >
      <Ionicons name="share-outline" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android elevation
    elevation: 2,
  },
});

export default ShareButton;
