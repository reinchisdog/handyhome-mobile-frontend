// Screen: Application Welcome Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';


const ApplicationWelcome = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
         <Header hasBack={true} />

         <ScrollView 
         contentContainerStyle={{
            flexGrow: 1, 
            paddingHorizontal: 24, 
            paddingBottom: insets.bottom + 24 ,
            gap: 24, 
            justifyContent: 'space-between', 
            alignItems: 'center'
         }}>
            <Text style={{
               fontFamily: FONTS.nunito700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.primary,
               textAlign: 'center'
            }}>
               Become a <Text style={{color: COLORS.accent}}>Handy</Text>Home Service Provider
            </Text>

            <View style={{
               maxWidth: 248,
               maxHeight: 248,
               width: '100%',
               height: '100%',
               aspectRatio: '1/1',
               backgroundColor: COLORS.lightblue,
               borderRadius: '100%',
               justifyContent: 'center',
               alignItems: 'center',
               position: 'relative'
            }}>
               <Image 
               source={require('../../../../../assets/images/illustrations/Onboarding-1.png')}
               style={{
                  position: 'absolute',
                  bottom: -28,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1/1',
                  zIndex: 2
               }}
               />
               <View 
               style={{
                  maxWidth: 200,
                  maxHeight: 200,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '100%',
                  position: 'relative',
                  zIndex: 1,
               }}
               />
            </View>

            <Text style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               textAlign: 'center',
            }}>
               Welcome! Join our growing community of skilled workers and connect with clients who value your expertise. Start your journey with us today.
            </Text>

            <MainButton 
            type='primary'
            text='See Details'
            onPress={() => {router.push('/dashboard/client/verify/worker/preview')}}
            />
         </ScrollView>
      </View>
   )
}

export default ApplicationWelcome

const styles = StyleSheet.create({})