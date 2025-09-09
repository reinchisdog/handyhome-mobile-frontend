// Screen: Profile Edit

// Imports
// ---- React Components
import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../components/Header';
import MainButton from '../../../../components/MainButton';
import InputFlat from '../../../../components/InputFlat';
import ErrorModal from '../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
// ---- Other Libs
import { useAuth } from '../../../../context/AuthContext';
import { useConvert } from '../../../../hooks/useConvert';
import api from '../../../../lib/api';

const ProfileEditScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { user, token, tryFetchUser } = useAuth();
   const { convertUriToFile } = useConvert();

   const [info, setInfo] = useState({
      profile_photo: user?.profile_photo_url
   })
   const [infoDisabled, setInfoDisabled] = useState(true);
   const [infoLoading, setInfoLoading] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);

   // Functions
   const formatDate = (dateString) => {
      let date = new Date(dateString);
      date.setDate(date.getDate());

      let formattedDate = date.toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric"
      })

      return formattedDate;
   }

   const handleImageSelect = async () => {
      const uriPath = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         quality: 0.8,
      });

      if(!uriPath.canceled) {
         setInfo(prev => {
            const asset = uriPath.assets[0];

            if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
               setErrorMessage("Image is too large. Please select an image under 5MB.");
               setErrorModal(true);
               return prev;
            }

            return {
               ...prev,
               profile_photo: asset?.uri
            }
         });
      }
   }

   const handleInfoUpdate = async () => {
      try {
         setInfoLoading(true);
         console.log('---- [Edit Profile] Updating Attempt ----');
         console.log('[1] Converting Files');
         const converted =  convertUriToFile(info.profile_photo)

         const formData = new FormData();
         formData.append('profile_photo', converted);

         console.log('[2] Submitting File');
         const updateResult = await api.put('/user', formData, {
            headers: {
               'Authorization' : `Bearer ${token}`, 
               'Content-Type': 'multipart/form-data',
            },
         })

         console.log('[3] Submitting Succesful, Routing Back');
         console.log(updateResult?.data?.data);
         await tryFetchUser(token);
         router.back();
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when updating your profile. Please try again";
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setInfoLoading(false);
      }
   }

   // Effects
   useEffect(() => {
      if (info.profile_photo === user?.profile_photo_url) 
         setInfoDisabled(true);
      else 
         setInfoDisabled(false);
   }, [info])

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title="Something went wrong!"
         message={errorMessage}
         />

         <ScrollView 
         style={[global.screenContainer, {backgroundColor: '#fff'}]}
         contentContainerStyle={{flex: 1}}
         stickyHeaderIndices={[0]}
         > 
            <Header title="Account Information"/>
            <Image
            source={require('../../../../assets/images/backgrounds/graphic-bg2.png')}
            style={{
               width: '100%',
               height: 138,
               overflow: 'hidden',
               position: 'relative',
               borderBottomLeftRadius: 24,
               borderBottomRightRadius: 24,
            }}/>

            <View 
            style={{ 
               alignItems: 'center', 
               marginTop: -74 , 
               paddingHorizontal: 24,
               gap: 32,
               flex: 1,
               justifyContent: 'space-between',
               paddingBottom: insets.bottom
            }}>
               <View style={{gap: 24, width: '100%', alignItems: 'center'}}>
                  {/* ---- Profile */}
                  <Pressable
                  onPress={handleImageSelect}
                  style={{
                     height: 148,
                     width: 148,
                     backgroundColor: COLORS.secondary,
                     borderWidth: 4,
                     borderColor: COLORS.secondary,
                     borderRadius: 74,
                     overflow: 'hidden',
                     position: 'relative',
                  }}>
                  {({ pressed }) => (
                     <>
                        <Image
                        source={{ uri: info?.profile_photo }}
                        style={{
                           width: '100%',
                           height: '100%',
                           resizeMode: 'cover', 
                        }}/>

                        <View
                        style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           height: '100%',
                           width: '100%',
                           backgroundColor: pressed ? '#3A454D80' : COLORS.strokes,
                           justifyContent: 'center',
                           alignItems: 'center',
                           zIndex: 2,
                        }}>
                           <Icons name='image-edit' size={40} color={'#fff'}/>
                        </View>
                     </>
                  )}
                  </Pressable>
                  
                  {/* ---- First Name */}
                  <InputFlat 
                  placeholder='Full Name'
                  value={user?.full_name}
                  disabled
                  />

                  {/* ---- Gender */}
                  <InputFlat 
                  placeholder='Gender'
                  disabled
                  value={user?.gender}
                  />

                  {/* ---- Birthdate */}
                  <InputFlat 
                  placeholder='Birthdate'
                  disabled
                  value={formatDate(user?.birth_date)}
                  />
               </View>
               
               <MainButton 
               type='primary'
               text='Edit Profile'
               disabled={infoDisabled}
               loading={infoLoading}
               onPress={handleInfoUpdate}
               />
            </View>
         </ScrollView>
      </>
      
   )
}

export default ProfileEditScreen

const styles = StyleSheet.create({})