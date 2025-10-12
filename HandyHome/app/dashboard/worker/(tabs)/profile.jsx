// Screen: Profile

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image, Pressable } from 'react-native';
import React, {useState} from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../components/Header';
import ProfileTab from '../../../../components/ProfileTab';
import GeneralModal from '../../../../components/GeneralModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
// ---- Other Libs
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';


const ProfileScreen = () => {
   // Hooks and States
   const router = useRouter();
   const {user, logout} = useAuth();

   const [logoutModal, setLogoutModal] = useState(false);

   return (
      <>
         <GeneralModal 
         visible={logoutModal}
         setVisible={setLogoutModal}
         title={"Log Out"}
         message={"Are you sure you want to log out?"}
         isAlert={true}
         primaryText={"Log Out"}
         primaryFunction={logout}
         secondaryText={"Cancel"}
         secondaryFunction={() => setLogoutModal(false)}
         />

         <ScrollView
         style={[global.screenContainer, {backgroundColor: '#fff'}]}>
            <Header hasBack={false}/>
            <ImageBackground
            source={require('../../../../assets/images/backgrounds/graphic-bg2.png')}
            style={{
               width: '100%',
               height: 138,
               overflow: 'hidden',
               position: 'relative',
            }}
            imageStyle={{
               borderBottomLeftRadius: 24,
               borderBottomRightRadius: 24,
            }}>
               <View
               style={{
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
               }}>
                  {/* ---- Image */}
                  <Image
                  source={{uri: user?.profile_photo_url}}
                  style={{
                     height: 82,
                     width: 82,
                     aspectRatio: 1/1,
                     justifyContent: 'flex-end',
                     alignItems: 'flex-end',
                     position: 'relative',
                     borderRadius: 41,
                     backgroundColor: COLORS.se
                  }} />

                  {/* ---- Details */}
                  <View style={{ gap: 6, flex: 1 , alignItems: 'flex-start'}}>
                     <Text numberOfLines={1}
                     style={{
                        flexShrink: 1,
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.lettersicons
                     }}>
                        {user?.full_name}
                     </Text>
                     
                     {user?.is_verified ? 
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                           <Icons2 name='check-decagram' size={20} color={COLORS.primary}/>
                           <Text
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons
                           }}>
                              Verified
                           </Text>
                        </View>
                        :
                        <Pressable
                        onPress={() => {router.push('dashboard/client/verify/user')}}
                        style={({pressed}) => [{
                           flexShrink: 1,
                           paddingHorizontal: 12,
                           paddingVertical: 4,
                           borderRadius: 12,
                           backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary
                        }]}
                        >
                           <Text
                           style={{
                              fontFamily: FONTS.roboto700,
                              fontSize: FONT_SIZES.md,
                              color: '#fff'
                           }}>
                              Verify Now
                           </Text>
                        </Pressable>
                     }
                     
                  </View>

                  <TouchableOpacity
                  onPress={() => {router.push('/dashboard/worker/settings/profile/view')}}
                  style={{
                     height: '100%',
                     justifyContent: 'center'
                  }}>
                     <Arrows name='chevron-right' size={24} color={'#fff'}/>
                  </TouchableOpacity>
               </View>
            </ImageBackground>

            <View
            style={{
               // gap: 12,
               padding: 12
            }}>
               {/* Account and Security */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/account')}}
               icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
               title="Account and Security"
               />

               {/* My Addresses */}
               {/* <ProfileTab 
               onPress={() => {router.push('/dashboard/client/settings/address')}}
               icon={<Icons1 name="location-on" size={24} color={COLORS.primary} />}
               title="My Addresses"
               /> */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/availability')}}
               icon={<Icons2 name="clock" size={24} color={COLORS.primary} />}
               title="Availability"
               />

               {/* Emergency Contact */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/contacts')}}
               icon={<Icons1 name="contact-emergency" size={24} color={COLORS.primary} />}
               title="Emergency Contact"
               />

               {/* FAQs */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/faqs')}}
               icon={<Icons2 name="message-question" size={24} color={COLORS.primary} />}
               title="FAQs"
               />

               {/* Terms and Conditions */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/terms')}}
               icon={<Icons2 name="file-document" size={24} color={COLORS.primary} />}
               title="Terms and Conditions"
               />

               {/* Privacy Policy */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/policies')}}
               icon={<Icons2 name="shield-check" size={24} color={COLORS.primary} />}
               title="Privacy Policy"
               />

               {/* About Us */}
               <ProfileTab 
               onPress={() => {router.push('/dashboard/worker/settings/about')}}
               icon={<Icons2 name="key" size={24} color={COLORS.primary} />}
               title="About Us"
               />
               
               {/* Account and Security */}
               <ProfileTab 
               onPress={() => {setLogoutModal(true)}}
               icon={<Icons2 name="logout" size={24} color={COLORS.primary} />}
               title="Log Out"
               hasArrow={false}
               />
            </View>
         </ScrollView>
      </>
   )
}

export default ProfileScreen

const styles = StyleSheet.create({})