import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, TouchableHighlight, useWindowDimensions, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { KeyboardProvider, KeyboardAvoidingView } from 'react-native-keyboard-controller'

import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
import Header from '../../../../components/dashboard/Header';
import BasicInput from '../../../../components/authentication/BasicInput';

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const contactList = [
   {
      name: 'Dad',
      phoneNumber: '09123456789'
   },
   {
      name: 'Sister',
      phoneNumber: '09123456789'
   },
   {
      name: 'Brother',
      phoneNumber: '09123456789'
   },
   {
      name: 'Uncle',
      phoneNumber: '09123456789'
   },
   {
      name: 'Aunt',
      phoneNumber: '09123456789'
   },
   
]

const EmergencyContact = ({name}) => {
   const colorIndex = () => {
      const colorMap = [
         '#fda1a1',
         '#A4DCFF',
         '#d3e5f1',
         '#ffce94',
         '#9fffc8',
      ]

      return colorMap[Math.floor(Math.random() * colorMap.length)]
   }

   return (
   <View
   style={[{
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      // backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
      backgroundColor: 'white',
      gap: 24,
      alignItems: 'center'
   }]}>
      <View style={[
         global.centerContainer,{
         height: 30, 
         width: 30, 
         borderRadius: 15, 
         aspectRatio: '1/1', 
         overflow: 'hidden',
         backgroundColor: colorIndex()
      }]}>
         <Icons name='person-outline' size={24} color={COLORS.lettersicons}/>
      </View>

      <Text style={{
         fontFamily: FONTS.roboto500,
         fontSize: FONT_SIZES.md,
         color: COLORS.lettersicons
      }}>{name}</Text>
   </View>
)}

export default ContactsScreen = () => {
   const router = useRouter();

   const [showNewContact, setShowNewContact] = useState(false);

   return (
      <KeyboardProvider>
         <NewContactModal showModal={showNewContact} setShowModal={setShowNewContact} />

         <View style={[global.screenContainer, {position: 'relative'}]}>
            <Header 
            background={'#fff'}
            left={(
               <TouchableOpacity onPress={() => router.back()}>
                  <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
               </TouchableOpacity>
            )}

            title={(
               <Text style={[global.headingText, {color: COLORS.primary}]}>Emergency Contacts</Text>
            )}
            titleAlign='center'
            titlePosition='absolute'
            />
            <FlatList 
            data={contactList}
            contentContainerStyle={{
               paddingTop: 48,
               paddingHorizontal: 24,
               gap: 8
            }}
            renderItem={({item}) => (
               <EmergencyContact 
               image={item.image} 
               name={item.name}/>
            )}/>

            <Pressable
            onPress={() => {setShowNewContact(true)}}
            style={({pressed}) => [{
               justifyContent: 'center',
               alignItems: 'center',
               width: 44,
               height: 44,
               aspectRatio: '1/1',
               borderRadius: 8,
               backgroundColor: pressed ? '#063e60' : COLORS.primary,
               position: 'absolute',
               bottom: 24,
               right: 24
            }]}>
               <Icons name='add' size={24} color={'#fff'}/>
            </Pressable>
         </View>
      </KeyboardProvider>
   )
}

const NewContactModal = ({showModal, setShowModal}) => {
   const [newContact, setNewContact] = useState({
      image: null,
      name: "",
      phoneNumber: ""
   })
   const clearNewContact = () => {
      setNewContact({
         image: null,
         name: "",
         phoneNumber: ""
      })
   }

   const {width, height} = useWindowDimensions()

   const handleCloseModal = () => {
      clearNewContact();
      setShowModal(false);
   }

   const handleNewContact = async () => {
      setShowModal(false);
   }

   return (
      <Modal 
      animationType='slide'
      visible={showModal}
      backdropColor={'rgba(0, 0, 0, 0.2)'}
      statusBarTranslucent={true}
      > 
         <KeyboardAvoidingView 
         behavior='padding'
         keyboardVerticalOffset={0}
         style={{
            width: width,
            height: height,
            position: 'relative'
         }}>
            <Pressable 
            style={{flex: 1}}
            onPress={handleCloseModal}
            />
            <View style={global.bottomModal}>
               <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Icons name='person-add' size={24} color={COLORS.primary}/>
                  <Text style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.primary,
                     textAlign: 'left',
                  }}>
                     Add a new Emergency Contact
                  </Text>
               </View>
               
               <View style={global.divider}/>

               <BasicInput 
               left={<Icons name='person' size={24} color={COLORS.primary}/>}
               placeholder='Contact Name'
               onChangeText={(e) => setNewContact(prev => ({...prev, name: e}))}
               value={newContact.name}
               />

               <BasicInput 
               left={<Icons name='phone' size={24} color={COLORS.primary}/>}
               placeholder='Contact Number'
               onChangeText={(e) => setNewContact(prev => ({...prev, phoneNumber: e}))}
               inputMode= "numeric"
               keyboardType="phone-pad"
               value={newContact.phoneNumber}
               />

               <TouchableHighlight
               underlayColor={'#0072bc'}
               onPress={handleNewContact}
               style={global.primaryBtn}>
                  <Text style={global.primaryBtnText}>
                     Add New Contact
                  </Text>
               </TouchableHighlight>
            </View>
         </KeyboardAvoidingView>  

      </Modal>
   )
}