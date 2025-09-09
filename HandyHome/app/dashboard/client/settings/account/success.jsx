// Screen: Update Success Screen

// Import
// ---- React and React Native Components
import { View, Animated, useWindowDimensions, Easing, Text } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
// ---- Custom Components
import MainButton from '../../../../../components/MainButton'
import SuccessCheck from '../../../../../assets/images/illustrations/SuccessCheck'
import LoadingDots from '../../../../../components/LoadingDots'
// ---- Config and Other Libraries
import {useRouter} from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles'
import { launchStyles as launch } from '../../../../../styles/launchStyles'
import { useAuth } from '../../../../../context/AuthContext'

const SearchingSuccess = () => {
   const route = useRouter();
     const {width, height} = useWindowDimensions();
     const insets = useSafeAreaInsets();
     const {logout} = useAuth();
   
     const imageAnimation = useRef(new Animated.Value(0)).current;
   
     const imageRotation = imageAnimation.interpolate({
       inputRange: [0, 1],
       outputRange: ['-180deg', '0deg'],
       extrapolate: 'clamp'
     })
   
     useEffect(() => {
       Animated.timing(imageAnimation, {
         toValue: 1,
         duration: 1000,
         useNativeDriver: true,
         easing: Easing.bezier(0.22, 1, 0.36, 1)
       }).start();
       
     }, []);

   return (
      <View style={[
         global.centerContainer, {
         flex: 1,
         width,
         zIndex: 4,
         position: 'relative',
         backgroundColor: '#fff',
         gap: 24,
      }]}>
      
         <Animated.View 
         style={{
            transform: [{rotate: imageRotation}]
         }}
         >
         <SuccessCheck />
         </Animated.View>

         <View style={[{height: 96}]}>
         <Text style={[launch.title]}>
               Account Information Updated
         </Text>
         <Text style={launch.description}>
               Your account has been successfully updated. You can now use your new email/phone to log in.
         </Text>
         </View>

         <View style={[global.buttonsContainer, {position: 'absolute', bottom: insets.bottom + 24}]}>
            <MainButton 
            text="Go to Login"
            type="primary"
            onPress={logout}
            />
         </View>
      </View>
   )
}

const ProfileAccountSuccess = () => {
   const [isLoading, setIsLoading] = useState(true);
   const { setUser, setToken } = useAuth();

   const switchToSuccess = async () => {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
   }

  useEffect(() => {
      switchToSuccess();
  }, [])

  return (
    <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
    {(isLoading) ?
      <LoadingDots /> :
      <SearchingSuccess />
    }
    </View>
  );
}

export default ProfileAccountSuccess