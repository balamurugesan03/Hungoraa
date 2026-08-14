import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import RootNavigator from './src/navigation';
import { COLORS } from './src/constants';

// Web/server client ID — this is the audience the backend verifies Google ID
// tokens against, so it must be a "Web application" OAuth client, not the
// Android one. See mobile/.env (EXPO_PUBLIC_GOOGLE_CLIENT_ID).
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  offlineAccess: false,
});

LogBox.ignoreLogs(['Non-serializable values', 'Require cycle']);

// Keep splash screen visible until fonts load
SplashScreen.preventAutoHideAsync();

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // Generate device ID if needed
      let deviceId = await AsyncStorage.getItem('ds_device_id');
      if (!deviceId) {
        deviceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('ds_device_id', deviceId);
      }

      // Register for push notifications
      await registerForPushNotifications();
    } catch (err) {
      console.warn('App init error:', err);
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      const token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem('fcm_token', token.data);
    } catch (err) {
      console.warn('Push notification setup failed:', err);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
        <RootNavigator />
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
