import { Text, View, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Header from '../../../../../components/dashboard/Header';
import UpcomingScreen from './index';
import CompletedScreen from './completed';
import CancelledScreen from './cancelled';

const Tabs = createMaterialTopTabNavigator();

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../styles/constants';

const BookingsLayout = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const { width, height } = useWindowDimensions();

  return (
    <View style={global.screenContainer}>
      {/* --------------------------------- Header --------------------------------- */}
      <Header 
      background={COLORS.primary} 
      title = {
        <Text style={[global.headingText, {color: '#fff'}]}>Bookings</Text>
      }
      titleAlign = 'center'
      titlePosition = 'relative'
      />

      {/* ------------------------------- Top Tab Bar ------------------------------ */}
      <Tabs.Navigator
        initialLayout={{ width: width }}
        screenOptions={{
          lazy: true,
          // pagerEnabled: false,
          // lazyPlaceholder = {},
        }}
        tabBar={(props) => <BookingTabBar {...props} />}
      >
        <Tabs.Screen name="Upcoming" component={UpcomingScreen}/>
        <Tabs.Screen name="Completed" component={CompletedScreen}/>
        <Tabs.Screen name="Cancelled" component={CancelledScreen}/>
      </Tabs.Navigator>
      
    </View>
  )
}

const BookingTabBar = ({ state, descriptors, navigation, position, active }) => {
  return (
    <>
      <View style={{
        flexDirection: 'row',
        height: 36,
        backgroundColor: COLORS.primary,
        gap: 12,
      }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ 
                flex: 1 ,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: (isFocused)? '#fff' :  'transparent',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
              }}
            >
              <Text 
                style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.sm,
                  color: (isFocused)? COLORS.accent : '#fff'
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
        
      </View>
      <View 
      style={{
        height: 8,
        backgroundColor: '#fff'
      }}
      />
    </>
    
  )
}

export default BookingsLayout
