import { StyleSheet, Text, View, Animated, TouchableHighlight, useWindowDimensions } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { useEmergency } from '../../../../../../context/EmergencyContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Icons from '@expo/vector-icons/MaterialCommunityIcons'
import {globalStyles as global} from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';

export default EmergencyScreen = () => {
   const router = useRouter();
   const {handleEmergency, clearEmergency} = useEmergency();
   const {id} = useLocalSearchParams();

   const countdown = 5;
   const [timer, setTimer] = useState(countdown);
   const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
      if (timer > 0){
         setTimeout(() => {
            setTimer(prev => prev - 1);
         }, 1000)
      } else {
         handleSubmit();
      }
      // console.log(timer)
    }, [timer])

   const handleSubmit = async () => {
      const result = await handleEmergency(id)

      if (result.status === "success") {
         console.log("[Emergency] success");
      } else if (result.status === "failed") {
         console.log("[Emergency] failed");
         handleCancel();
      }
   }

   const handleCancel = () => {
      clearEmergency();
      router.back();
   }


   const circleLoop = useRef(new Animated.Value(0)).current;
   const circleSize = circleLoop.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 300],
      extrapolate: 'clamp'
   })
   const circleOpacity = circleLoop.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 0],
      extrapolate: 'clamp'
   })

   useEffect(() => {
      circleLoop.setValue(0);
      Animated.loop(
        Animated.timing(circleLoop, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ).start(() => {
         
      });
   }, []);

   return (
      <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#000', position: 'relative', padding: 24}]}> 
         {/* ---- Top */}
         <View style={{position: 'absolute', width: '100%', transform: [{translateY: -164}]}}>
            <Text style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: '#fff',
               textAlign: 'center'
            }}>
               Notifying Admins and Emergency Contacts...
            </Text>
            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: 48,
               color: '#fff',
               textAlign: 'center'
            }}>
               EMERGENCY
            </Text>
         </View>

         {/* ---- Middle */}
         <View style={styles.middleItem}>
            <View style={{
               justifyContent: 'center',
               alignItems: 'center',
               position: 'relative'
            }}>
               {(timer > 0) ? <CountdownCircle timer={timer}/> : <EmergencyMessage />}
               <Animated.View style={[
                  styles.circleItem, {
                  height: circleSize,
                  opacity: circleOpacity,
                  zIndex: 0,
               }]} />
            </View>
         </View>

         {/* ---- Bottom */}
         <View style={[global.buttonsContainer, {position: 'absolute', bottom: 0}]}>
            <TouchableHighlight
            underlayColor={'#ab3232'}
            style={[global.primaryBtn, {backgroundColor: COLORS.red}]}
            onPress={handleCancel}>
               <Text style={global.primaryBtnText}>
                  {(submitted)? "Go Back" : "Cancel"}
               </Text>
            </TouchableHighlight>
         </View>
      </View>
   )
}

const CountdownCircle = ({timer}) => {
   return (
      <View 
      style={[
         styles.circleItem, 
         global.centerContainer, {
         height: 124,
         zIndex: 1,
      }]}>
         <Text style={{
            fontFamily: FONTS.roboto600,
            fontSize: 48,
            color: '#fff'
         }}>
            {timer}
         </Text>
      </View>
   )
}

const EmergencyMessage = () => {
   const [periods, setPeriods] = useState(0);
   useEffect(() => {
      setTimeout(() => {
         if (periods === 3) setPeriods(0)
         else setPeriods(prev => prev + 1)
      }, 500)
      
   }, [periods])

   return (
      <View style={{gap: 12, position: 'absolute', zIndex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <Icons name="alarm-light" size={40} color={COLORS.red} />
         <Text style={{
            fontFamily: FONTS.roboto600,
            fontSize: FONT_SIZES.xxl,
            color: '#fff',
             textAlign: 'center'
         }}>
            {`Sending Location and Booking Details to Admin and Emergency Contacts${".".repeat(periods)}`}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create({
   middleItem: {
      width: '100%',
      position: 'relative'
   },
   circleItem: {
      aspectRatio: '1/1',
      backgroundColor: COLORS.red,
      borderRadius: '50%',
      position: 'absolute',
   },
})