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
   const { currentAppointment, appointmentLoading, setAppointmentLoading, rejectAppointment, summary } = useAppointment();
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width} = useWindowDimensions();

   const [cancelModal, setCancelModal] = useState(false);
   const [cancelLoading, setCancelLoading] = useState(false);

   // Animation refs - add animation guard
   const successLoading = useRef(new Animated.Value(0)).current;
   const animationStarted = useRef(false);
   const animationRef = useRef(null);

   // Functions
   const handleRejectAppointment = async () => {
      setCancelLoading(true);
      console.log(summary?.booking?.id);
      const appointmentId = currentAppointment?.id || summary?.booking?.id;

      await rejectAppointment(appointmentId);

      setCancelLoading(false);
   }

   // Effects
   useFocusEffect(
      useCallback(() => {
         const onBackPress = () => {
            // Only prevent back navigation if we're actively waiting for a worker
            if (appointmentLoading && currentAppointment?.id && !currentAppointment?.accepted_by) {
               setCancelModal(true);
               return true;
            }

            return false;
         };

         const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

         return () => subscription?.remove();
      }, [appointmentLoading, currentAppointment?.id, currentAppointment?.accepted_by])
   );

   // Reset animation state when screen focuses
   useFocusEffect(
      useCallback(() => {
         // Reset animation state when component focuses
         animationStarted.current = false;
         successLoading.setValue(0);
         
         // Cleanup any running animation
         if (animationRef.current) {
            animationRef.current.stop();
            animationRef.current = null;
         }
      }, [])
   );

   useEffect(() => {
      console.log('current appointment worker:', currentAppointment?.accepted_by);
      console.log('appointment loading:', appointmentLoading);
      console.log('animation started:', animationStarted.current);
      
      if (!appointmentLoading && 
          currentAppointment?.accepted_by && 
          !animationStarted.current) {
         successAnimation();
      }
   }, [appointmentLoading, currentAppointment?.accepted_by]);

   // Animation
   // Animation with guards
   const loadingWidth = successLoading.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp'
   })

   const successAnimation = useCallback(() => {
      if (animationStarted.current) {
         console.log('Animation already started, skipping');
         return;
      }

      if (!currentAppointment?.id) {
         console.log('No appointment ID, skipping animation');
         return;
      }

      animationStarted.current = true;
      console.log('Starting success animation');
      
      animationRef.current = Animated.timing(successLoading, {
         toValue: 1,
         duration: 5000,
         useNativeDriver: false
      });

      animationRef.current.start((finished) => {
         if (finished) {
            console.log('Animation completed, navigating...');
            router.replace({
               pathname: '/dashboard/client/appointment/summary/[id]',
               params: {id: currentAppointment?.id}
            });
         }
         animationRef.current = null;
      });
   }, [successLoading, router, currentAppointment?.id]);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (animationRef.current) {
            animationRef.current.stop();
         }
      };
   }, []);


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
            {appointmentLoading ? (
               <>
                  <View style={{gap: 48, alignItems: 'center'}}>
                     <LoadingDots />
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
                     paddingBottom: insets.bottom, 
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