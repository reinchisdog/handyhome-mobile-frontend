/* --------------------------------- Imports -------------------------------- */
import { ScrollView, Text, View, TouchableOpacity, TouchableHighlight, FlatList, useWindowDimensions, Animated, Image, Easing, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from 'expo-router'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
/* ------------------------------- Components ------------------------------- */
import Header from '../../../../components/dashboard/Header';
import TextLogo from '../../../../components/logos/TextLogo';

/* ---------------------------- Styles and Icons ---------------------------- */
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo'
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const IncomingItems = [
   {
      id: 1,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 2,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 3,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 4,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
   {
      id: 5,
      image: require('../../../../assets/placeholder-base.png'),
      servCategory: "Service Category ",
      servName: "Service Name (Oldest)",
      location: "Worker's Name",
      price: 300
   },
]

export default HomeScreen = () => {
   /* ----------------------------- Initialization ----------------------------- */
   const {width, height} = useWindowDimensions();
   const [userName, setUsername] = useState('John Doe');
   const router = useRouter();

   /* -------------------------------- Functions ------------------------------- */
   const handleReject = async (id) => {

   }

   const handleAccept = async (id) => {

   }

   return (
      <ScrollView 
      // showsHorizontalScrollIndicator={true}
      showsVerticalScrollIndicator={true}
      style={[global.screenContainer]}
      contentContainerStyle={{ backgroundColor: COLORS.screenbg }}
      stickyHeaderIndices={[0]}
      >
         <Header 
         title={<TextLogo width={140}/>}
         titlePosition='absolute'
         right={
         <TouchableOpacity
         activeOpacity={0.5}
         onPress={() => {}}>
            <Icons1 name="bell" size={24} color={COLORS.primary}/>
         </TouchableOpacity>
         }
         />

         <View 
         style={[{
         width: '100%',
         }]}>
            {/* ------------------------------ Main Content ------------------------------ */}
            <View 
            style={[{
               paddingVertical: 24,
               flex: 1,
               gap: 24,
               zIndex: 1,
            }]}>

               {/* ---- User Greeting */}
               <View 
               style={[{
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  height: 42,
                  width: '100%',
                  alignItems: 'center'
               }]}>
                  <Text 
                  style={[global.headingText, {
                  color: COLORS.lettersicons
                  }]}>
                  Hello, <Text style={[global.headingText, {color: COLORS.primary}]}>{`${userName} !`}</Text>
                  </Text>
               </View>

               {/* ---- Upcoming Booking(s) */}
               <View 
               style={{
                  borderRadius: 20,
                  backgroundColor: '#fff',
                  marginHorizontal: 24,
               }}>
                  {/* ---- Information */}
                  <View
                  style={{
                     flexDirection: 'row',
                     padding: 18,
                     borderBottomWidth: 1,
                     borderColor: COLORS.strokes,
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     gap: 8
                  }}>
                     <View
                     style={{
                        flex: 1,
                        gap: 12
                     }}>
                        {/* ---- Service */}
                        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                           <Icons1 name='pipe-wrench' size={24} color={COLORS.primary}/>
                           <Text numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto500,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons,
                              flexShrink: 1
                           }}>
                              Leak Repair
                           </Text>
                        </View>
                        {/* ---- Location */}
                        <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                           <Icons2 name='location-on' size={24} color={COLORS.red}/>
                           <Text numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.labels,
                              flexShrink: 1
                           }}>
                              Sta. Mesa, Manila
                           </Text>
                        </View>
                     </View>

                     <TouchableOpacity
                     onPress={() => {}}
                     style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        width: 48,
                     }}
                     >
                        <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                     </TouchableOpacity>
                  </View>

                  {/* ---- Date */}
                  <View
                  style={{
                     flexDirection: 'row',
                     padding: 18,
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     gap: 8
                  }}>
                     <Text numberOfLines={1}
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        flexShrink: 1
                     }}>
                        Tomorrow
                     </Text>
                     <Text numberOfLines={1}
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                     }}>
                        10:30 AM
                     </Text>
                  </View>
               </View>

               {/* ---- Incoming Request(s) */}
               <View
               style={{
                  paddingHorizontal: 24,
                  gap: 12
               }}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.primary,
                     textAlign: 'left'
                  }}>
                     Incoming Requests
                  </Text>

                  <FlatList 
                  scrollEnabled={false}
                  data={IncomingItems}
                  renderItem={({item}) => (
                     <IncomingItem 
                     item={item}
                     left = {{
                        name: 'Reject',
                        function: () => handleReject(item.id)
                     }}
                     right = {{
                        name: 'Accept',
                        function: () => handleAccept(item.id)
                     }}/>
                  )}
                  style={{
                     backgroundColor: '#fff',
                     borderRadius: 20
                  }}
                  contentContainerStyle={{
                     gap: 1
                  }}
                  />
               </View>
            </View>
            {/* Background */}
            <Image 
            source={require('../../../../assets/images/backgrounds/graphic-bg1.png')}
            style={{
               width: '100%',
               height: 224,
               backgroundColor: COLORS.lightblue,
               overflow: 'hidden',
               borderBottomLeftRadius: 24,
               borderBottomRightRadius: 24,
               paddingHorizontal: 24,
               position: 'absolute',
               zIndex: 0,
               elevation: 0,
               objectFit: 'cover',
               
            }} />
         </View>
      </ScrollView>
   )
}

const IncomingItem = ({item, left, right}) => {

   return (
      <View 
      style={{
         width: '100%',
         backgroundColor: '#fff',
         padding: 24,
         gap: 12,
         borderBottomWidth: StyleSheet.hairlineWidth,
         borderColor: COLORS.lettersicons
      }}>
         {/* ------------------------------- Information ------------------------------ */}
         <View 
         style={[
            global.centerContainer, {
            height: 78,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24
         }]}>

            <Image 
            source={item.image}
            style={{
               height: 78,
               width: 70,
               borderRadius: 8,
               objectFit: 'cover',
               resizeMode: 'cover'
            }}/>

            <View 
            style={{
               height: '100%',
               flex: 1,
               alignItems: 'flex-start',
               gap: 8,
            }}>
               <View 
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
               }}>
                  <View
                  style={[
                     global.tagContainer,
                     global.centerContainer, {
                     backgroundColor: '#F2F2F7'
                  }]}>
                     <Text
                     style={[
                        global.tagText,{
                        color: COLORS.primary
                     }]}>
                        {item.servCategory}
                     </Text>
                  </View>

                  <Text
                  style={[{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.lg,
                     letterSpacing: 0.2,
                     color: COLORS.accent
                  }]}>
                     {`\u20B1 ${item.price}`}
                  </Text>
               </View>

               {/* ---- Service Name */}
               <Text
               numberOfLines={1}
               style={[{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  letterSpacing: 0.2,
                  color: 'black',
                  flexShrink: 1
               }]}>
                  {item.servName}
               </Text>

               {/* ---- Location */}
               <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
               }}>
                  <Icons2 name="location-on" size={14} color={COLORS.red} />
                  <Text
                  numberOfLines={1}
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     flexShrink: 1
                  }}>
                     {item.location}
                  </Text>
               </View>
            </View>
         </View>
         
         {/* --------------------------------- Buttons -------------------------------- */}
         {(left || right) &&
            <View style={{
            width: '100%',
            height: 32,
            flex: 3,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12
         }}>
            <View style={{
               height: '100%',
               maxWidth: '33.33%',
               flex: 1,
            }}></View>

         {
            // ---- First Button (Upcoming / Completed)
            (left) &&
            <TouchableHighlight
               underlayColor="#d8d8d8"
               style={[
                  global.centerContainer, {
                  height: '100%',
                  maxWidth: '33.33%',
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: COLORS.strokes,
               }]}
               onPress={left.function}
            >
               <Text
                  style={[{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons
                  }]}
               >
                  {left.name}
               </Text>
            </TouchableHighlight>
         }

         {(right) &&
            // ---- Second Button
            <TouchableHighlight
               style={[
                  global.centerContainer, {
                  height: '100%',
                  maxWidth: '33.33%',
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
               }]}
               underlayColor={'#035082'}
               onPress={right.function}   
            >
               <Text
                  style={[{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.sm,
                     color: '#fff'
                  }]}
               >
                  {right.name}
               </Text>
            </TouchableHighlight>
         }
            </View>
         }

      </View>
   )
}