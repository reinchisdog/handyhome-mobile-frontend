// Screen: Appointment Queue Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, useWindowDimensions, BackHandler, Animated, StatusBar } from 'react-native'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAppointment } from '../../../../context/AppointmentContext';
// ---- Other Components
import MainButton from '../../../../components/MainButton';
import LoadingDots from '../../../../components/LoadingDots';
import GeneralModal from '../../../../components/GeneralModal';
import SuccessMessage from '../../../../components/SuccessMessage';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const AppointmentQueueScreen = () => {
   // Hooks and States
   const { currentAppointment, queueLoading, rejectAppointment, summary } = useAppointment();
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();

   const [isCheckingStatus, setIsCheckingStatus] = useState(false);

   const [cancelModal, setCancelModal] = useState(false);
   const [cancelLoading, setCancelLoading] = useState(false);

   // Animation refs
   const successLoading = useRef(new Animated.Value(0)).current;
   const hasAnimationStarted = useRef(false);

   // Functions
   const handleRejectAppointment = async () => {
      setCancelLoading(true);
      console.log(summary?.booking?.id);
      const appointmentId = currentAppointment?.id || summary?.booking?.id;

      await rejectAppointment(appointmentId);

      setCancelLoading(false);
   }

   // Animation function with proper guards
   const successAnimation = useCallback(() => {
      // Prevent multiple animations from starting
      if (hasAnimationStarted.current) return;
      
      console.log('Starting success animation');
      hasAnimationStarted.current = true;

      Animated.timing(successLoading, {
         toValue: 1,
         duration: 5000,
         useNativeDriver: false, // width interpolation requires false
      }).start(() => {
         console.log('Animation completed, navigating...');
         router.replace({
            pathname: '/dashboard/client/appointment/addons/',
         });
      });
   }, [successLoading, router, currentAppointment?.id]);

   // Effects
   useFocusEffect(
      useCallback(() => {
         const onBackPress = () => {
            if (queueLoading && currentAppointment?.id && !currentAppointment?.accepted_by) {
               setCancelModal(true);
               return true;
            }
            return false;
         };

         const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
         return () => subscription?.remove();
      }, [queueLoading, currentAppointment?.id, currentAppointment?.accepted_by])
   );

   // Fixed animation trigger logic
   useEffect(() => {
      // Only start animation when:
      // 1. We have an accepted appointment (someone accepted the job)
      // 2. Queue loading is false (real-time update received)
      // 3. Animation hasn't started yet
      if (currentAppointment?.accepted_by && !queueLoading && !hasAnimationStarted.current) {
         successAnimation();
      }
   }, [currentAppointment?.accepted_by, queueLoading, successAnimation]);

   // Reset animation state every time screen mounts
   useFocusEffect(
      useCallback(() => {
         successLoading.setValue(0);
         hasAnimationStarted.current = false;
      }, [successLoading])
   );

   // Animation interpolation
   const loadingWidth = successLoading.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp'
   })

   return (
      <>
         <GeneralModal
         isAlert={true}
         visible={cancelModal}
         setVisible={setCancelModal}
         title={"Cancel Booking?"}
         message={"Are you sure you want to cancel this booking? This action cannot be undone and you'll need to start over if you want to book again."}
         secondaryText={"Keep Booking"}
         secondaryFunction={() => setCancelModal(false)}
         primaryText={"Yes, Cancel"}
         primaryFunction={handleRejectAppointment}
         primaryLoading={cancelLoading}
         />

         <View style={[
            global.screenContainer, 
            global.centerContainer, {
            backgroundColor: '#fff', 
            position: 'relative'
         }]}>
            {queueLoading ? (
               <>
                  <View style={{gap: 48, alignItems: 'center'}}>
                     <LoadingDots size={16}/>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons,
                        alignItems: 'center'
                     }}>
                        Finding the<Text style={{color: COLORS.primary}}> best available provider </Text>for you.
                     </Text>
                  </View>

                  <View 
                  style={{
                     paddingBottom: insets.bottom + 24, 
                     paddingHorizontal: 24, 
                     position: 'absolute', 
                     bottom: 0, 
                     left: 0, 
                     right: 0,
                     width: width,
                  }}>
                     <MainButton
                     type='secondary'
                     text={"Cancel Appointment"}
                     onPress={() => setCancelModal(true)}
                     />
                  </View>
               </>
            ) : (
               <>
                  <SuccessMessage 
                  title={"Service Provider Found!"}
                  body={"A provider has accepted your request. View their profile and confirm your booking."}
                  type='andy'
                  />

                  <View
                  style={{
                     position: 'absolute',
                     top: StatusBar.currentHeight,
                     height: 12,
                     width: width,
                     backgroundColor: COLORS.secondary,
                  }}>
                     <Animated.View 
                     style={{
                        height: '100%',
                        width: loadingWidth,
                        backgroundColor: COLORS.primary,
                     }}/>
                  </View>
               </>
            )}
         </View>
      </>
   )
}

export default AppointmentQueueScreen

const styles = StyleSheet.create({})