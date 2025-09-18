// Screen: User Verification Success

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

const ApplicationSuccessScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();
   
   const [finished, setFinished] = useState(false);

   useEffect(() => {
      setTimeout(() => {
         setFinished(true);
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
            title={"Application Submitted"}
            body={"Thank you for your interest in applying as a HandyHome Service Provider! You will be notified once your application is reviewed and approved."}/> :
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

export default ApplicationSuccessScreen;


const styles = StyleSheet.create({})