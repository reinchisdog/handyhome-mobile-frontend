// Screens: Bookings Layout

// Import 
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { withLayoutContext } from 'expo-router';
// ---- Other Components
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../../../../../components/Header';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const { Navigator } = createMaterialTopTabNavigator();
export const Tabs = withLayoutContext(Navigator);

const BookingsLayout = () => {
   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.screenbg}]}>
         <Header 
         hasBack={false}
         title={"Bookings"}
         textColor='#fff'
         backgroundColor={COLORS.primary}
         />
         
         <Tabs
         initialRouteName='upcoming'
         tabBar={({state, descriptors, navigation}) => (
            <View 
            style={{
               flexDirection: 'row',
               maxHeight: 46,
               backgroundColor: COLORS.primary,
               padding: 6,
               alignItems: 'center',
               width: '100%',
               // backgroundColor: 'green'
            }}>
               {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const label = options.tabBarLabel || options.title || route.name;
                  const isFocused = state.index === index;

                  const onPress = () => {
                     const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                     });

                     if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                     }
                  };

                  return (
                     <View
                     key={route.key}
                     style={{
                        backgroundColor: isFocused ? '#fff' : 'transparent',
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        height: '100%'
                     }}
                     onTouchEnd={onPress}>
                        <Text
                        style={{
                           color: isFocused ? COLORS.accent : '#fff',
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.sm,
                        }}>
                           {label}
                        </Text>
                     </View>
                  )
               })

               }
            </View>
         )}
         >
            <Tabs.Screen 
               name="upcoming" 
               options={{ title: "Upcoming" }} 
            />
            <Tabs.Screen 
               name="completed" 
               options={{ title: "Completed" }} 
            />
         </Tabs>
         
      </View>
   )
}

export default BookingsLayout

const styles = StyleSheet.create({})