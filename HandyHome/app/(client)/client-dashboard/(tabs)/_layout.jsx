import { TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';

import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontFamily: FONTS.roboto700,
        },
        tabBarStyle: {
          height: 70,
          borderRadius: 18,
          paddingVertical: 10,
        },
        tabBarItemStyle: {
          padding: 4,
          gap: 4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lettersicons,
        tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.5} />,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          unmountOnBlur: true,
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'home' : 'home-outline';
            return <Icons1 name={iconName} color={color} size={size} />;
          },
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'calendar-account' : 'calendar-account-outline';
            return <Icons1 name={iconName} color={color} size={size} />;
          },
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'message-text' : 'message-text-outline';
            return <Icons1 name={iconName} color={color} size={size} />;
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          unmountOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'person' : 'person-outline';
            return <Icons2 name={iconName} color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
}
