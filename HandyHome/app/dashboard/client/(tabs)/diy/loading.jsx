// Screen: DIY Loading Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import LoadingDots from '../../../../../components/LoadingDots';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other libs
import { useDiy } from '../../../../../context/DiyContext';

const DiyLoadingScreen = () => {
   // Hooks and States
   const router = useRouter();
   const {promptLoading, result} = useDiy();

   // Effects
   useEffect(() => {
      if (promptLoading && !result) return;

      setTimeout(() => {
         router.replace('/dashboard/client/diy/result');
      }, 1500)
   }, [promptLoading, result])

   return (
      <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
         <View style={{gap: 48, alignItems: 'center', padding: 24}}>
            <LoadingDots />
            <Text
            style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               alignItems: 'center'
            }}>
               Hang on tight while we <Text style={{color: COLORS.primary}}>analyze</Text> this issue for you.
            </Text>
         </View>
      </View>
   )
}

export default DiyLoadingScreen

const styles = StyleSheet.create({})