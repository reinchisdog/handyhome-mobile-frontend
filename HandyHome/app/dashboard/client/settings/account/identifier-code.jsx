// Screens: Identifier Code Screen

// Imports
// ---- React and Expo Components
import { Text, View, ImageBackground } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
// ---- Custom Components
import InputBasic from '../../../../../components/InputBasic';
import MainButton from '../../../../../components/MainButton';
import Header from '../../../../../components/Header';
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { authStyles as auth } from '../../../../../styles/authStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Config and Other Libraries
import { useAccountSettings } from '../../../../../context/AccountSettingsContext';

const IdentifierCode = () => {
   // Hooks and States
   const insets = useSafeAreaInsets()
   const { accountLoading, handleVerifyToken } = useAccountSettings();

   const [code, setCode] = useState(null);

   return (
      <View style={[global.screenContainer, {position: 'relative', paddingBottom: insets.bottom + 24}]}>
         <ImageBackground
         source={require('../../../../../assets/images/backgrounds/graphic-bg3.png')}
         style={[auth.stylizedHeader]}>
            <Header hasBack backColor='#fff' backgroundColor='transparent'/>

            <View style={{paddingHorizontal: 24, gap: 12}}>
               <Text style={[auth.headerTitle, {color: '#fff'}]}>
                  VERIFY YOUR ACCOUNT
               </Text>

               <Text style={[auth.headerDescription, {color: '#fff'}]}>
                  Please enter the code we sent to your email/phone.
               </Text>
            </View>
         </ImageBackground>

         <View style={[auth.inputsContainer, {flex: 1}]}>
            <View style={auth.inputSet}>
               {/* ---- Code */}
               <InputBasic 
               placeholder={"Verification Code"}
               inputMode='numeric'
               keyboardType='number-pad'
               onChangeText={(e) => setCode(e)}
               value={code}
               />
            </View>
         </View>

         <View style={[global.buttonsContainer]}>
            <MainButton 
            text="Verify"
            type="primary"
            loading={accountLoading}
            onPress={() => handleVerifyToken(code)}
            />
         </View>
      </View>
   )
}

export default IdentifierCode