// Screen: Emergency Contacts

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, TouchableHighlight, useWindowDimensions, Image, Modal, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Header from '../../../../components/Header';
import MainButton from '../../../../components/MainButton';
import InputBasic from '../../../../components/InputBasic';
import BookingsEmpty from '../../../../components/BookingsEmpty';
import LoadingDots from '../../../../components/LoadingDots';
import ErrorModal from '../../../../components/ErrorModal';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
// ---- Other Libs
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/api';

const ProfileContacts = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { user, token } = useAuth()

   const [contacts, setContacts] = useState([]);
   const [contactsLoading, setContactsLoading] = useState(true);
   const [contact, setContact] = useState({
      name: "",
      email: "",
      phone_number: ""
   })
   const [modalLoading, setModalLoading] = useState(false);

   const [contactModal, setContactModal] = useState(false);
   const [contactMode, setContactMode] = useState(null);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const fetchContacts = async () => {
      try {
         setContactsLoading(true);
         console.log("---- [Profile Contacts] Fetch Attempt ----");
         console.log("[1] Fetching Contacts");
         const result = await api.get(`/user/contacts`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log("[2] Fetching Succesful");
         setContacts(result.data.data)
      } catch (err) {
         console.log("[0] Fetching Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when fetching your emergency contacts."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setContactsLoading(false);
      }
   }

   const fetchContact = async (id) => {
      try {
         setContact({
            name: "",
            email: "",
            phone_number: ""
         });

         setModalLoading(true);
         handleOpenModal('view');
         console.log("---- [Profile Contacts] Fetch Attempt ----");
         console.log("[1] Fetching Contact");
         const result = await api.get(`/user/contacts/${id}`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log("[2] Fetching Succesful");
         const formatted = {...result?.data?.data, phone_number: result?.data?.data?.phone_number.replace('+63', '0')}
         setContact(formatted);
         setModalLoading(false);
      } catch (err) {
         console.log("[0] Fetching Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when fetching your emergency contacts."
         setErrorMessage(message);
         setErrorModal(true);
      } 
   }

   const handleOpenModal = (mode) => {
      setContactMode(mode);
      setContactModal(true);
   }

   const verifyInputs = () => {
      const name = contact.name;
      const email = contact.email;
      const phone = contact.phone_number;

      if (
         !name || name.trim() === "" ||
         !email || email.trim() === "" ||
         !phone || phone.trim() === ""
      ) throw new Error("All fields must be filled to proceed.")

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         throw new Error("Please enter a valid email address.");
      }

      if (!email.endsWith("@gmail.com")) {
         throw new Error("Email must be a Gmail address (e.g., handyh@gmail.com)");
      }

      if (phone.length !== 11) {
         throw new Error("Phone number must be 11 digits long.");
      }

      if (!/^09\d{9}$/.test(phone)) {
         throw new Error("Please enter a valid phone number starting with 09 and followed by 9 digits.");
      }
   }
   
   const handleAdd = async () => {
      try {
         setModalLoading(true);
         console.log("---- [Profile Contacts] Add Attempt ----");
         console.log("[1] Verifying Inputs");
         verifyInputs();

         console.log("[2] Adding Contact");
         const addResult = await api.post('/user/contacts', contact, {
            headers: {'Authorization': `Bearer ${token}`}
         })

         console.log("[3] Adding Succesful, Fetching New List");
         await fetchContacts();
         setContactModal(false);

      } catch (err) {
         console.log("[0] Adding Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when adding an emergency contact."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setModalLoading(false);
      }
   }

   const handleUpdate = async (id) => {
      try {
         setModalLoading(true);
         console.log("---- [Profile Contacts] Update Attempt ----");
         console.log("[1] Verifying Inputs");
         verifyInputs();
         const formatted = {
            name: contact?.name,
            email: contact?.email,
            phone_number: contact?.phone_number, 
         }

         console.log("[2] Updating Contact:", id);
         console.log(formatted);

         const updateResult = await api.put(`/user/contacts/${id}`, formatted, {
            headers: {'Authorization': `Bearer ${token}`}
         })

         console.log("[3] Updating Succesful, Fetching New List");
         await fetchContacts();
         setContactModal(false);

      } catch (err) {
         console.log("[0] Updating Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when updating an emergency contact."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setModalLoading(false);
      }
   }

   const handleDelete = async (id) => {
      try {
         setModalLoading(true);
         console.log("---- [Profile Contacts] Update Attempt ----");
         console.log("[1] Deleting Contact:", id);
         const deleteResult = await api.delete(`/user/contacts/${id}`, {
            headers: {'Authorization': `Bearer ${token}`}
         })

         console.log("[3] Deleting Succesful, Fetching New List");
         await fetchContacts();
         setContactModal(false);

      } catch (err) {
         console.log("[0] Deleting Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when deleting an emergency contact."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setModalLoading(false);
      }
   }

   // Effects
   useFocusEffect(
      useCallback(() => {
         if (user && token) {
            setTimeout(() => {
               fetchContacts();
            }, 1000)
         }

      }, [user, token])
   )

   // Renders
   const renderFooter = () => (
      <View
      style={{
         width: '100%',
         paddingVertical: 32,
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         {(contactsLoading && contacts.length === 0) && (
            <LoadingDots size={12} />
         )}
      </View>
   )

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong!"}
         message={errorMessage}
         />

         <ContactModal 
         mode={contactMode}
         visible={contactModal}
         setVisible={setContactModal}
         contact={contact}
         setContact={setContact}
         loading={modalLoading}
         handleAdd={handleAdd}
         handleUpdate={handleUpdate}
         handleDelete={handleDelete}
         />

         <View style={[global.screenContainer, {position: 'relative', backgroundColor: COLORS.screenbg}]}>
            <Header 
            hasBack
            title={"Emergency Contacts"}
            />

            <FlatList 
            data={contacts}
            contentContainerStyle={{
               paddingTop: 24,
               paddingHorizontal: 12,
               gap: 8
            }}
            renderItem={({item}) => <ContactItem item={item} onPress={() => fetchContact(item?.id)}/>}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => (
               !contactsLoading &&
                  <BookingsEmpty 
                  title={"No Contacts"}
                  description={"You haven't added any emergency contacts yet. Add them so we can contact someone during an emergency."}
                  />
            )}
            />

            <Pressable
            onPress={() => handleOpenModal('add')}
            style={({pressed}) => [
               global.shadowTop, {
               justifyContent: 'center',
               alignItems: 'center',
               width: 48,
               height: 48,
               aspectRatio: '1/1',
               borderRadius: 8,
               backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary,
               position: 'absolute',
               bottom: insets.bottom + 24,
               right: 24
            }]}>
               <Icons name='add' size={24} color={'#fff'}/>
            </Pressable>
         </View>
      </>
   )
}


const ContactItem = ({item, onPress}) => {
   const colorMap = [
      '#fda1a1',
      '#A4DCFF',
      '#d3e5f1',
      '#ffce94',
      '#9fffc8',
   ];

   const getConsistentColor = (item) => {
      const id = item?.id;
      return colorMap[id % colorMap.length];
   };
   
   return (
      <Pressable
      onPress={onPress}
      style={({pressed}) => [{
         flexDirection: 'row',
         paddingHorizontal: 12,
         paddingVertical: 8,
         borderRadius: 8,
         borderWidth: 2,
         borderColor: pressed ? COLORS.lightblue : '#fff',
         backgroundColor: '#fff',
         gap: 24,
         alignItems: 'center'
      }]}>
         {/* ---- Icon */}
         <View 
         style={[
            global.centerContainer,{
            height: 30, 
            width: 30, 
            borderRadius: 15, 
            aspectRatio: '1/1', 
            overflow: 'hidden',
            backgroundColor: getConsistentColor(item)
         }]}>
            <Icons name='person-outline' size={24} color={COLORS.lettersicons}/>
         </View>
         
         <Text
         numberOfLines={1}
         style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.md,
            color: COLORS.lettersicons,
            flex: 1,
         }}>
            {item?.name}
         </Text>

         <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
      </Pressable>
   )
}

const ContactModal = ({
   mode, // "add", "update"
   visible,
   setVisible,
   contact,
   setContact,
   loading,
   handleAdd,
   handleUpdate,
   handleDelete
}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const { width, height } = useWindowDimensions();

   const [originalContact, setOriginalContact] = useState({
      name: "",
      email: "",
      phone_number: ""
   });
   const [hasChanges, setHasChanges] = useState(false);

   // Functions
   const handleClose = () => {
      setVisible(false);
      // Reset to original values when closing
      if (mode === 'view') {
         setContact(originalContact);
      } else {
         clearModal();
      }
   }

   const clearModal = () => {
      const emptyContact = {
         name: "",
         email: "",
         phone_number: ""
      };
      setContact(emptyContact);
      setOriginalContact(emptyContact);
   }
   
   const checkForChanges = useCallback(() => {
      if (mode === 'add') {
         // For add mode, check if any field has content
         const hasContent = contact.name.trim() !== "" || 
                           contact.email.trim() !== "" || 
                           contact.phone_number.trim() !== "";
         setHasChanges(hasContent);
      } else if (mode === 'view') {
         // For view mode, check if current values differ from original
         const isChanged = contact.name !== originalContact.name ||
                          contact.email !== originalContact.email ||
                          contact.phone_number !== originalContact.phone_number;
         setHasChanges(isChanged);
      }
   }, [contact, originalContact, mode]);

   const isButtonDisabled = () => {
      if (loading) return true;
      
      if (mode === 'add') {
         // For add mode, require all fields to be filled
         return !contact.name.trim() || 
                !contact.email.trim() || 
                !contact.phone_number.trim();
      } else if (mode === 'view') {
         // For view mode, disable if no changes made
         return !hasChanges;
      }
      
      return false;
   };

   // Effects
   useEffect(() => {
      if (visible && mode === 'view' && contact.id) {
         // Store original contact data when opening in view mode
         setOriginalContact({
            name: contact.name || "",
            email: contact.email || "",
            phone_number: contact.phone_number || ""
         });
      } else if (visible && mode === 'add') {
         // Clear everything for add mode
         clearModal();
      }
   }, [visible, mode, contact.id]);

   useEffect(() => {
      checkForChanges();
   }, [checkForChanges]);
   
   return (
      <Modal
      visible={visible}
      statusBarTranslucent={true}
      animationType='slide'
      backdropColor={COLORS.modalbg}
      onRequestClose={handleClose}
      >
         <KeyboardAvoidingView
         behavior='height'
         keyboardVerticalOffset={-insets.bottom + 24}
         style={{
            flex: 1,
            position: 'relative',
            // backgroundColor: 'green'
         }}>
            <Pressable
            onPress={handleClose}
            style={{
               flex: 1,
               // backgroundColor: 'blue'
            }} />

            <View
            style={{
               width: width,
               padding: 24,
               paddingBottom: insets.bottom + 24,
               backgroundColor: '#fff',
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20,
               gap: 24
            }}>
               <Text
               style={{
                  textAlign: 'center',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.primary
               }}>
                  {
                     mode === "add" ? "Add New Contact" : mode === "view" ? "Contact Information":
                     null
                  }
               </Text>

               <View style={global.divider}/>

               <View style={{gap: 12}}>
                  <InputBasic 
                  floatColor='#fff'
                  placeholder='Name'
                  inputMode='text'
                  left={
                     <Icons name='person' size={24} color={COLORS.labels}/>
                  }
                  value={contact.name}
                  onChangeText={(e) => setContact(prev => ({
                     ...prev,
                     name: e
                  }))}/>

                  <InputBasic 
                  floatColor='#fff'
                  placeholder='E-mail'
                  inputMode='email'
                  keyboardType='email-address'
                  left={
                     <Icons name='mail' size={24} color={COLORS.labels}/>
                  }
                  value={contact.email}
                  onChangeText={(e) => setContact(prev => ({
                     ...prev,
                     email: e
                  }))}/>

                  <InputBasic 
                  floatColor='#fff'
                  placeholder='Phone Number'
                  inputMode='numeric'
                  keyboardType='phone-pad'
                  left={
                     <Icons name='phone' size={24} color={COLORS.labels}/>
                  }
                  value={contact.phone_number}
                  onChangeText={(e) => setContact(prev => ({
                     ...prev,
                     phone_number: e
                  }))}/>
               </View>
               
               <View 
               style={{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 8
               }}>
                  {mode === "add" &&
                     <MainButton 
                     type='primary'
                     text={'Save'}
                     loading={loading}
                     onPress={handleAdd}
                     />
                  }
                  {mode === "view" &&
                     <>
                        <MainButton 
                        type='alert'
                        text={'Delete'}
                        size='grow'
                        loading={loading}
                        onPress={() => handleDelete(contact?.id)}
                        />

                        <MainButton 
                        type='secondary'
                        text={'Update'}
                        size='grow'
                        loading={loading}
                        disabled={isButtonDisabled()}
                        onPress={() => handleUpdate(contact?.id)}
                        />
                     </>
                  }
               </View>
            </View>
            
         </KeyboardAvoidingView>
      </Modal>
   )
}

export default ProfileContacts

const styles = StyleSheet.create({})