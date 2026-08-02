import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';

// Tab Screens
import HomeScreen from '../screens/customer/HomeScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import BookingsScreen from '../screens/customer/BookingsScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';

// Stack Screens
import RestaurantListScreen from '../screens/customer/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/customer/RestaurantDetailScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import BookingConfirmScreen from '../screens/customer/BookingConfirmScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import BookingSuccessScreen from '../screens/customer/BookingSuccessScreen';
import BookingDetailScreen from '../screens/customer/BookingDetailScreen';
import ReviewScreen from '../screens/customer/ReviewScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import WalletScreen from '../screens/customer/WalletScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import SavedRestaurantsScreen from '../screens/customer/SavedRestaurantsScreen';
import MenuDetailScreen from '../screens/customer/MenuDetailScreen';
import OffersScreen from '../screens/customer/OffersScreen';
import MapViewScreen from '../screens/customer/MapViewScreen';
import PayBillScreen from '../screens/customer/PayBillScreen';
import PayBillSuccessScreen from '../screens/customer/PayBillSuccessScreen';
import BillPaymentHistoryScreen from '../screens/customer/BillPaymentHistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarIcon({ name, color, focused }) {
  return (
    <View style={styles.tabIcon}>
      <Ionicons name={name} size={24} color={color} />
      {focused && <View style={[styles.tabDot, { backgroundColor: color }]} />}
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="MapView" component={MapViewScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PayBill" component={PayBillScreen} />
      <Stack.Screen name="PayBillSuccess" component={PayBillSuccessScreen} />
      <Stack.Screen name="BillPaymentHistory" component={BillPaymentHistoryScreen} />
    </Stack.Navigator>
  );
}

function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Reschedule" component={BookingScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedRestaurants" component={SavedRestaurantsScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            Bookings: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <TabBarIcon name={icons[route.name]} color={color} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsStack} options={{ tabBarLabel: 'My Bookings' }} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  tabIcon: {
    alignItems: 'center',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
