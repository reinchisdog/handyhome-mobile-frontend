import { Animated, StyleSheet, Text, View, Easing} from 'react-native'
import React, {useRef, useEffect} from 'react'
import SuccessCheck from '../assets/images/illustrations/SuccessCheck';
import SuccessAndy from '../assets/images/illustrations/SuccessAndy';
import FailedAndy from '../assets/images/illustrations/FailedAndy';
import NeutralAndy from '../assets/images/illustrations/NeutralAndy';
import { launchStyles as launch } from '../styles/launchStyles';

const SuccessMessage = ({
   title, 
   body, 
   type = "check" // "andy", "neutral", "check", "fail"
}) => {
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
    <View
    style={{
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 24
    }}>
      <Animated.View style={type !== "fail" && {
         ...{transform: [{rotate: imageRotation}]}
      }}>
         {type === "check" ?
            <SuccessCheck /> :
         type === "andy" ?
            <SuccessAndy /> :
         type === "fail" ?
            <FailedAndy /> :
         type === "neutral" ?
            <NeutralAndy /> :
         null
         }
      </Animated.View>
      <Text 
      style={[
         launch.title, {
         marginBottom: 0, 
         marginTop: type === "andy" || type === "fail" ? 32 : 4,
      }]}>
         {title}
      </Text>
      <Text style={[launch.description, {paddingHorizontal: 0}]}>
         {body}
      </Text>
    </View>
  )
}

export default SuccessMessage

const styles = StyleSheet.create({})