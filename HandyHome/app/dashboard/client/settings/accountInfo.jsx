import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar, Image, TouchableHighlight, TouchableOpacity, TextInput, ImageBackground, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router'
import { KeyboardProvider, KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import Header from '../../../../components/dashboard/Header'

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';


export default AccountInformationScreen = () => {
   const router = useRouter()

   const [profileInfo, setProfileInfo] = useState({
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: ""
   })

   const initializeProfile = async () => {
      setProfileInfo({
         firstName: "John",
         lastName: "Doe",
         gender: "Male",
         birthDate: "September 27, 2004"
      })
   }

   useEffect(() => {
      initializeProfile();
   }, [])

   const handleProfileSave = async () => {
      console.log("Handle Profile Save")
   }

   const scrollY = useRef(new Animated.Value(0)).current;

   const headerColor = scrollY.interpolate({
      inputRange: [0, 72],
      outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
      extrapolate: 'clamp',
    });

   return (
      <KeyboardProvider>
         <View style={global.screenContainer}>

            <Header 
            background={headerColor}
            left={(
               <TouchableOpacity onPress={() => router.back()}>
                  <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
               </TouchableOpacity>
            )}

            title={(
               <Text style={[global.headingText, {color: COLORS.primary}]}>Account Information</Text>
            )}
            titleAlign='center'
            titlePosition='absolute'
            headerPosition='absolute'
            />

            <KeyboardAwareScrollView
            bottomOffset={0}
            style={[global.screenContainer, {backgroundColor: '#fff'}]}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false }
            )}
            >

               {/* --------------------------------- Header --------------------------------- */}
               <Image 
               source={require('../../../../assets/images/backgrounds/graphic-bg1.png')} 
               style={{
                  width: '100%',
                  height: 224 + StatusBar.currentHeight,
                  backgroundColor: COLORS.lightblue,
                  overflow: 'hidden',
                  borderBottomLeftRadius: 42,
                  borderBottomRightRadius: 42,
               }}/>

               <ImageBackground
               source={require('../../../../assets/placeholder-base.png')}
               style={{
                  width: 144,
                  height: 144,
                  borderRadius: 72,
                  overflow: 'hidden',
                  marginTop: -72,
                  marginHorizontal: 'auto'
               }}>

               </ImageBackground>

               <View style={{
                  padding: 24,
                  gap: 24
               }}>
                  {/* ---- First Name */}
                  <EditInput 
                  label={"First Name"}
                  value={profileInfo.firstName}
                  setValue={(e) => {
                     setProfileInfo(prev => ({
                        ...prev,
                        firstName: e
                     }))
                  }}
                  />
                  {/* ---- Last Name */}
                  <EditInput 
                  label={"Last Name"}
                  value={profileInfo.lastName}
                  setValue={(e) => {
                     setProfileInfo(prev => ({
                        ...prev,
                        lastName: e
                     }))
                  }}
                  />
                  {/* ---- Gender */}
                  <EditInput 
                  label={"Gender"}
                  value={profileInfo.gender}
                  setValue={(e) => {
                     setProfileInfo(prev => ({
                        ...prev,
                        gender: e
                     }))
                  }}
                  />
                  {/* ---- Birth Date */}
                  <EditInput 
                  label={"Birthdate"}
                  value={profileInfo.birthDate}
                  setValue={(e) => {
                     setProfileInfo(prev => ({
                        ...prev,
                        birthDate: e
                     }))
                  }}
                  />
               </View>

               
            </KeyboardAwareScrollView>
            <View style={[global.buttonsContainer, {backgroundColor: '#fff'}]}>
               <TouchableHighlight
               underlayColor={'#0072bc'}
               onPress={handleProfileSave}
               style={[global.primaryBtn]}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                     <Icons name='square-edit-outline' size={24} color={'#fff'}/>
                     <Text style={global.primaryBtnText}>
                        Edit Profile
                     </Text>
                  </View>
               </TouchableHighlight>
            </View>
         </View>
      </KeyboardProvider>
   )
}

const EditInput = ({label, value, setValue}) => {
   return (
      <View style={{
         gap: 4,
         width: '100%'
      }}>
         <Text style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.sm,
            color: COLORS.labels
         }}>{label}</Text>
         <TextInput 
         onChangeText={setValue}
         value={value}
         style={{
            height: 40,
            width: '100%',
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.labels,
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons
         }}
         />
      </View>
   )
}