// Screen: Account Deletion

// Imports
// ---- React and Expo Components
import { ScrollView, StyleSheet, Text, View, Modal, Pressable, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import InputBasic from '../../../../../components/InputBasic';
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other Libs
import api from '../../../../../lib/api';
import { useAuth } from '../../../../../context/AuthContext';

const AccountDeletion = () => {
   // Hooks and States
   const { token } = useAuth();
   const insets = useSafeAreaInsets();
   const router = useRouter();

   const [confirmModal, setConfirmModal] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);
   const [confirmDisabled, setConfirmDisabled] = useState(true);
   const [confirmInput, setConfirmInput] = useState("");

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const handleDeactivate = async () => {
      try {
         setConfirmLoading(true);
         console.log("---- Deactiovation Attempt ----");
         console.log("[1] Deactivating");
         await api.put('/user/deactivate', {}, {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         console.log("[2] Succesful Deactivation, Routing to Auth Index");
         router.replace("/dashboard/authentication");
      } catch(err) {
         console.log("[0] Failed Deactivation");
         const message = err?.response?.data?.message || err?.message || "An unknown error has ocurred when deactivating your account."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setConfirmLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (confirmInput === 'DELETE') {
         setConfirmDisabled(false);
      } else {
         setConfirmDisabled(true);
      }
   }, [confirmInput])

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={'Something went wrong'}
         message={errorMessage}
         />

         <Modal 
         visible={confirmModal}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setConfirmModal(false)}
         >  
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
               <Pressable
               onPress={() => setConfirmModal(false)}
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
               }}>
                  <View style={global.centerModal}>
                     <Text 
                     style={{
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.red,
                        textAlign: 'center'
                     }}>
                        Final Confirmation
                     </Text>

                     <View style={global.divider}/>

                     <Text 
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'center'
                     }}>
                        This will permanently delete your account and all data. This action cannot be undone.
                     </Text>

                     <InputBasic 
                     placeholder="Type 'DELETE' to confirm"
                     floatLabel={false}
                     value={confirmInput}
                     onChangeText={(e) => setConfirmInput(e)}
                     />

                     <View 
                     style={{
                        flexDirection: 'row',
                        gap: 12,
                        alignItems: 'stretch'
                     }}>
                        <Pressable
                        onPress={() => setConfirmModal(false)}
                        style={({pressed}) => [{
                           backgroundColor: pressed ? COLORS.secondaryPress : '#fff',
                           flex: 1,
                           alignItems: 'center',
                           justifyContent: 'center',
                           borderRadius: 22,
                           paddingHorizontal: 16,
                        }]}>   
                           <Text
                           style={{
                              fontFamily: FONTS.roboto700,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.labels,
                           }}>
                              Cancel
                           </Text>
                        </Pressable>

                        <MainButton 
                        type={'alert'}
                        size='flex'
                        text={'Delete'}
                        onPress={() => {}}
                        loading={confirmLoading}
                        disabled={confirmDisabled}
                        />
                     </View>


                  </View>

               </Pressable>
            </KeyboardAvoidingView>
         </Modal>

         <View style={[global.screenContainer]}>
            <Header hasBack title={"Account Deletion"} />
            <ScrollView contentContainerStyle={{padding: 12, paddingBottom: insets.bottom + 24, flexGrow: 1}}>
               <View
               style={{
                  paddingHorizontal: 12,
                  paddingVertical: 24,
                  borderRadius: 20,
                  backgroundColor: '#fff',
                  justifyContent: 'space-between',
                  flexGrow: 1
               }}>
                  <View>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.primary,
                        textAlign: 'center',
                        marginBottom: 6
                     }}>
                        IMPORTANT
                     </Text>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels,
                        textAlign: 'center',
                        marginBottom: 20
                     }}>
                        Please review the information below before proceeding.
                     </Text>

                     <View style={global.divider}/>

                     <View
                     style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: COLORS.red,
                        borderRadius: 8,
                        marginVertical: 24,
                        backgroundColor: '#ffeded',
                        gap: 8
                     }}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.red,
                           textAlign: 'center'
                        }}>
                           This action cannot be undone
                        </Text>

                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.lettersicons,
                           textAlign: 'justify'
                        }}>
                           Your account and all associated data will be permanently deleted and cannot be retrieved. We will not be responsible for any issues that will come after.
                        </Text>
                     </View>

                     <Text
                     style={{
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        marginBottom: 12
                     }}>
                        What happens when you deactivate:
                     </Text>

                     <View style={{gap: 12, marginBottom: 24}}>
                        <View style={styles.bullet}>
                           <Text>-</Text>
                           <View style={styles.details}>
                              <Text style={styles.title}>All your data will be deleted</Text>
                              <Text style={styles.description}>Including your profile, bookings, messages, and uploaded files.</Text>
                           </View>
                        </View>

                        <View style={styles.bullet}>
                           <Text>-</Text>
                           <View style={styles.details}>
                              <Text style={styles.title}>Your profile will disappear</Text>
                              <Text style={styles.description}>Other users will no longer be able to find or contact you.</Text>
                           </View>
                        </View>

                        <View style={styles.bullet}>
                           <Text>-</Text>
                           <View style={styles.details}>
                              <Text style={styles.title}>Email address will be locked</Text>
                              <Text style={styles.description}>Your email can't be used to create a new account in the future.</Text>
                           </View>
                        </View>
                     </View>
                     
                     <View style={global.divider}/>
                  </View>
                  
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
                     <MainButton 
                     type='secondary'
                     text='Cancel'
                     size='grow'
                     onPress={() => router.back()}
                     />

                     <MainButton 
                     type='alert'
                     text='Continue to Deactivate'
                     size='grow'
                     onPress={() => setConfirmModal(true)}
                     />

                  </View>
               </View>
            </ScrollView>
         </View>
      </>
   )
}

export default AccountDeletion

const styles = StyleSheet.create({
   bullet: {
      flexDirection: 'row',
      gap: 4,
      paddingLeft: 12,
      paddingRight: 18
   },
   details: {
      flexShrink: 1,
      gap: 4,
   },
   title: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.darkblue
   },
   description: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels,
      textAlign: 'justify'
   }

})