// Screen: User Verification Failed

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
// Contexts
import { useClientVerification } from '../../../../../context/ClientVerificationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import MainButton from '../../../../../components/MainButton';
import LoadingDots from '../../../../../components/LoadingDots';
import SuccessMessage from '../../../../../components/SuccessMessage';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';

const VerificationFailedScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();

   const { clearClientVerification } = useClientVerification();
   const [finished, setFinished] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setFinished(true);
         clearClientVerification();
      }, 3000)
   }, []);

   return (
      <View
      style={[
         global.screenContainer,
         global.centerContainer, {
         backgroundColor: '#fff',
         position: 'relative'
      }]}>
         {finished ?
            <SuccessMessage 
            title={"Verification Under Review"}
            body={"Thank you for submitting your verification details. Our admin team is currently reviewing your account. You'll receive a notification once the review is complete."}
            type='fail'/> :
            <LoadingDots />
         }

         {finished &&
         <View
         style={{
            width: width,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
         }}>
            <MainButton 
            type='secondary'
            text={"Back to Home"}
            onPress={() => router.replace('/dashboard/client')}
            />
         </View>
         }

         
      </View>
  )
}

export default VerificationFailedScreen

const styles = StyleSheet.create({})