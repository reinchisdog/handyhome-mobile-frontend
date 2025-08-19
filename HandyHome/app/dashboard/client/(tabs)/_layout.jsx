// Layout: Client-Tabs Layout

// Imports
// ---- React and Expo components
import { TouchableOpacity, Pressable } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// ---- Styles and Icons
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { useEffect } from "react";

const StarterTabLayout = () => {
   const segments = useSegments();

   // const inHomeStack = segments[3] === "home";
   // const isHomeIndex = inHomeStack && (segments[4] === undefined || segments[4] === "index");

   return (
      <Tabs
      screenOptions={{
         headerShown: false,
         tabBarLabelStyle: {
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.xs
         },
         tabBarInactiveTintColor: COLORS.lettersicons,
         tabBarActiveTintColor: COLORS.primary,
         // tabBarStyle: isHomeIndex ? undefined : { display: "none" },
      }}
      >
         <Tabs.Screen 
            name="home"
            options={{
               title: "Home",
               tabBarIcon: ({ color, size }) => (
                  <Icons1 
                     name="home" 
                     size={size} 
                     color={color} 
                  />
               ),
               href: "/dashboard/client/(tabs)/home"
            }}
         />


      </Tabs>
   )
}

export default StarterTabLayout;