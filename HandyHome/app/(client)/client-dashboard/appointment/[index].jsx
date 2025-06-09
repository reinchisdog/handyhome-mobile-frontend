import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, useWindowDimensions, Animated, TouchableHighlight, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef } from 'react'
import { useAppointment } from '../../../../context/AppointmentContext'
import { useRouter, useLocalSearchParams } from 'expo-router'
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import Header from '../../../../components/dashboard/Header'
import ModalInput from '../../../../components/authentication/ModalInput'
import BasicMultiline from '../../../../components/authentication/BasicMultiline'
import DismissKeyboardWrapper from '../../../../components/DismissKeyboard'

import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'
import Arrows from '@expo/vector-icons/AntDesign';
import Icons from '@expo/vector-icons/MaterialIcons';

const CientSchedule = () => {
   const router = useRouter();

   const { id } = useLocalSearchParams();
   const { width, height } = useWindowDimensions();
   const {appointment, setAppointment} = useAppointment();

   // Camera
   // const [facing, setFacing] = useState<CameraType>('back');
   // const [permission, requestPermission] = useCameraPermissions();

   // if (!permission) {
   //    // Camera permissions are still loading.
   //    return <View />;
   // }

   const scrollY = useRef(new Animated.Value(0)).current;

   const headerHeight = scrollY.interpolate({
      inputRange: [24, 224],
      outputRange: [224, 24],
      extrapolate: 'clamp',
   });

   return (

   )
}
export default CientSchedule