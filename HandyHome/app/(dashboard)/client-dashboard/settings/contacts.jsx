import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, TouchableHighlight, useWindowDimensions, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import {useAuth} from '../../../../context/AuthContext';
import { API_URL } from '../../../../config';
import { KeyboardProvider, KeyboardAvoidingView } from 'react-native-keyboard-controller';
import axios from 'axios'

import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
import Header from '../../../../components/dashboard/Header';
import BasicInput from '../../../../components/authentication/BasicInput';
import MainButton from '../../../../components/MainButton'

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';


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
   const { user, token } = useAuth()

   const requestBody = {
      name: user.full_name,
      email: user.email,
      phone_number: user.phone_number
   }

   console.log(requestBody);

   const [showNewContact, setShowNewContact] = useState(false);

   const [contactList, setContactList] = useState([]);
   const [getContactLoading, setContactLoading] = useState(true);

   const getContactList = async () => {
      try {
         setContactLoading(true);

         const result = await axios.get(`${API_URL}/user/get_contacts`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         setContactList(result.data.data)
      } catch (err) {
         console.log(err);
      } finally {
         setContactLoading(false);
      }
   }

   useEffect(() => {
      setTimeout(() => {
         getContactList();
      }, 1000)
   }, [user, token])

   useEffect(() => {
      if (!showNewContact) {
         const delay = setTimeout(() => {
            getContactList();
         }, 500); 
   
         return () => clearTimeout(delay); // cleanup
      }
   }, [showNewContact]);

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
   const { token } = useAuth()

   const [newContact, setNewContact] = useState({
      email: null,
      name: null,
      phone_number: null
   })

   const [newContactDisabled, setNewContactDisabled] = useState(false);
   const [newContactLoading, setNewContactLoading] = useState(false);

   const clearNewContact = () => {
      setNewContact({
         email: "",
         name: "",
         phone_number: ""
      })
   }
   
   const validateNewContact = () => {
      const email = newContact.email?.trim() || "";
      const phone = newContact.phone_number?.trim() || "";
      const name = newContact.name?.trim() || "";
      
      const isNotEmpty = (email !== "" || phone !== "") && name !== "";
      
      const isValidEmail = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhone = phone === "" || /^09\d{9}$/.test(phone);
      
      return isNotEmpty && isValidEmail && isValidPhone;
   }

   useEffect(() => {
      if (validateNewContact()) {
         setNewContactDisabled(false);
      } else {
         setNewContactDisabled(true);
      }
   }, [newContact])

   const {width, height} = useWindowDimensions()

   const handleCloseModal = () => {
      clearNewContact();
      setShowModal(false);
   }

   const handleNewContact = async () => {
      try {
         setNewContactLoading(true);

         const result = await axios.post(`${API_URL}/user/add_new_contact`, newContact, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log(result.data.status);
      } catch (err) {

      } finally {
         setNewContactLoading(false);
         handleCloseModal();
      }
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
               onChangeText={(e) => setNewContact(prev => ({...prev, phone_number: e}))}
               inputMode= "numeric"
               keyboardType="phone-pad"
               value={newContact.phone_number}
               />

               <BasicInput 
               left={<Icons name='mail' size={24} color={COLORS.primary}/>}
               placeholder='Email (Optional)'
               onChangeText={(e) => setNewContact(prev => ({...prev, email: e}))}
               inputMode= "email"
               keyboardType="email-address"
               value={newContact.email}
               />

               <MainButton 
               text={"Add New Contact"}
               type="primary"
               onPress={handleNewContact}
               loading={newContactLoading}
               disabled={newContactDisabled}
               />
            </View>
         </KeyboardAvoidingView>  

      </Modal>
   )
}