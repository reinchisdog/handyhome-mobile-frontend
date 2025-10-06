// Layout: Client-Tabs Layout

// Imports
// ---- React and Expo components
import { TouchableOpacity, Pressable } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInbox } from "../../../../context/InboxContext";
// ---- Styles and Icons
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";

const StarterTabLayout = () => {
   const {inbox} = useInbox();

   const [badge, setBadge] = useState(0);
   
      useEffect(() => {
         const unreadCount = inbox.reduce((count, item) =>
            item.has_unread ? count + 1 : count
         , 0);

         setBadge(unreadCount === 0 ? null : unreadCount > 9 ? '...' : unreadCount);
      }, [inbox]); 

   return (
      <Tabs
      screenOptions={{
         headerShown: false,
         tabBarLabelStyle: {
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.xs,
         },
         tabBarInactiveTintColor: COLORS.lettersicons,
         tabBarActiveTintColor: COLORS.primary,
         // tabBarStyle: isHomeIndex ? undefined : { display: "none" },
         
      }}
      backBehavior='fullHistory'
      >
         <Tabs.Screen 
            name="home"
            options={{
               title: "Home",
               tabBarIcon: ({ focused, color, size }) => {
                  const iconName = focused ? 'home' : 'home-outline';
                  return <Icons1 name={iconName} color={color} size={size + 2} />;
               },
               href: "/dashboard/client/(tabs)/home"
            }}
         />

         <Tabs.Screen 
            name="bookings"
            options={{
               title: "Bookings",
               tabBarIcon: ({ focused, color, size }) => {
                  const iconName = focused ? 'calendar-account' : 'calendar-account-outline';
                  return <Icons1 name={iconName} color={color} size={size} />;
               },
               href: "/dashboard/client/(tabs)/bookings"
            }}
         />

         <Tabs.Screen 
            name="inbox"
            options={{
               title: "Inbox",
               tabBarIcon: ({ focused, color, size }) => {
                  const iconName = focused ? 'message-reply-text' : 'message-reply-text-outline';
                  return <Icons1 name={iconName} color={color} size={size} />;
               },
               href: "/dashboard/client/(tabs)/inbox",
               tabBarBadge: badge,
               tabBarBadgeStyle: {
                  backgroundColor: COLORS.red,
                  fontFamily: FONTS.nunito700,
                  fontSize: FONT_SIZES.xs,
                  position: 'absolute',
                  marginRight: -2
               }
            }}
         />

         <Tabs.Screen 
            name="diy"
            options={{
               title: "DIY",
               tabBarIcon: ({ focused, color, size }) => {
                  const iconName = focused ? 'wrench' : 'wrench-outline';
                  return <Icons1 name={iconName} color={color} size={size} />;
               },
               href: "/dashboard/client/(tabs)/diy"
            }}
         />

         <Tabs.Screen 
            name="profile"
            options={{
               title: "Profile",
               tabBarIcon: ({ focused, color, size }) => {
                  const iconName = focused ? 'person' : 'person-outline';
                  return <Icons2 name={iconName} color={color} size={size} />;
               },
               href: "/dashboard/client/(tabs)/profile"
            }}
         />

      </Tabs>
   )
}

export default StarterTabLayout;