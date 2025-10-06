// Screen: Home Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, Animated, Pressable} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAuth } from "../../../../../context/AuthContext";
import { useAppData } from "../../../../../context/AppDataContext";
import { useAppointment } from '../../../../../context/AppointmentContext';
// ---- Custom Components
import Header from '../../../../../components/Header';
import LogoText from '../../../../../components/LogoText';
import HomeGraphic from '../../../../../components/HomeGraphic';
import HomeGreetings from '../../../../../components/HomeGreetings';
import PromoSlide from '../../../../../components/PromoSlide';
import UnverifiedPrompt from '../../../../../components/UnverifiedPrompt';
import ServiceItem from '../../../../../components/ServiceItem';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';


const HomeScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { user } = useAuth();
   const { services } = useAppData();
   const { currentAppointment } = useAppointment();
   const [showVerify, setShowVerify] = useState(true);

   // Animation
   const buttonY = useRef(new Animated.Value(0)).current;
   const buttonTranslate = buttonY.interpolate({
      inputRange: [0, 1],
      outputRange: [insets.bottom + 200, 0],
      extrapolate: 'clamp'
   })

   const buttonAppear = () => {
      Animated.timing(buttonY, {
         toValue: 1,
         duration: 300,
         useNativeDriver: true
      }).start();
   }

   useEffect(() => {
      if (!currentAppointment) return;

      buttonAppear();
   }, [currentAppointment])

   const workerSearchAnimation = useRef(new Animated.Value(1)).current;

   useEffect(() => {
      if (currentAppointment && !currentAppointment.accepted_by) {
         // Start pulsing animation when looking for worker
         const pulse = () => {
            Animated.sequence([
               Animated.timing(workerSearchAnimation, {
                  toValue: 0.3,
                  duration: 800,
                  useNativeDriver: true,
               }),
               Animated.timing(workerSearchAnimation, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
               }),
            ]).start(() => {
               // Repeat the animation if still looking for worker
               if (currentAppointment && !currentAppointment.accepted_by) {
                  pulse();
               }
            });
         };
         pulse();
      } else {
         // Reset animation when worker is found
         workerSearchAnimation.setValue(1);
      }
   }, [currentAppointment?.accepted_by]);

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <ScrollView
         style={{
            flex: 1,
            backgroundColor: COLORS.screenbg
         }}
         contentContainerStyle={{
            paddingBottom: insets.bottom + currentAppointment ? 120 : 0,
         }}
         stickyHeaderIndices={[0]}
         >
            <Header 
            customTitle={<LogoText size={24}/>}
            hasBack={false}
            rightIcon={
               <TouchableOpacity 
               // onPress={() => {console.log("[Routing] to Notification")}}
               onPress={() => {router.push('/dashboard/client/home/notifications')}}
               style={{position: 'relative', height: 24, width: 24}}
               >
                  {false && (
                     <View 
                     style={{
                        backgroundColor: COLORS.red,
                        aspectRatio: 1/1,
                        borderRadius: 5,
                        width: 10,
                        position: 'absolute',
                        top: 2,
                        right: 0,
                        zIndex: 100
                     }}/>
                  )}
                  <Icons name='bell' size={24} color={COLORS.primary} />
               </TouchableOpacity>
            }/>

            <View style={{position: 'relative'}}>
               {/* ---- Content */}
               <View 
               style={{
                  paddingVertical: 24,
                  flex: 1,
                  gap: 24,
                  zIndex: 1,
               }}>
                  <HomeGreetings name={user?.full_name} />

                  <PromoSlide />

                  {!user?.can_book && showVerify && (
                     <UnverifiedPrompt 
                     hidePrompt={() => setShowVerify(false)} 
                     isPending={user?.identity_status?.status === 'Pending'}
                     />
                  )}

                  <View
                  style={[{
                     width: '100%',
                     gap: 8
                  }]}>
                     <View
                     style={[{
                        paddingHorizontal: 24,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                     }]}>
                        <Text
                        style={[
                           global.headingText, {
                           color: COLORS.primary
                        }]}>
                           Services
                        </Text>

                        <TouchableOpacity
                        onPress={() => router.push('/dashboard/client/home/services')}
                        >
                           <Text
                           style={[global.subheadingText]}
                           >
                              See All
                           </Text>
                        </TouchableOpacity>
                     </View>

                     <FlatList 
                     data={services}
                     renderItem={({item}) => (
                        <ServiceItem 
                        item={item}
                        onPress={() => {router.push({
                           pathname: '/dashboard/client/home/service/[id]',
                           params:  {id: item.id, name: item.name}
                        })}}
                        />
                     )}
                     horizontal
                     showsHorizontalScrollIndicator={false}
                     contentContainerStyle={{
                        paddingHorizontal: 20,
                        gap: 16
                     }}
                     />
                  </View>
               </View>

               <HomeGraphic />
            </View>
         </ScrollView>

         {currentAppointment &&
            <Animated.View
            style={[
               global.shadowBottom, {
               position: 'absolute',
               width: '100%',
               bottom: 0,
               transform: [{translateY: buttonTranslate}],
               zIndex: 99,
               overflow: 'hidden',
            }]}>
               <Pressable
               onPress={() => {
                  !currentAppointment.accepted_by ? 
                     router.push('/dashboard/client/appointment/queue') : 
                     router.push({
                        pathname: `/dashboard/client/appointment/addons`,
                     });
               }}
               style={({pressed}) => [
                  global.shadowBottom, {
                  paddingVertical: 16,
                  paddingHorizontal: 24, 
                  width: '100%',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24, 
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.strokes,
                  overflow: 'hidden',
                  backgroundColor: pressed ? COLORS.summaryPress : '#fff',
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center'
               }]}>
                  <View style={{flex: 1, gap: 6}}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.lettersicons
                     }}>
                        You have a pending appointment
                     </Text>
                     
                     <View
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4
                     }}>
                        <Icons name='account' size={20} color={COLORS.primary}/>

                        <Animated.Text 
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels,
                           opacity: currentAppointment.accepted_by ? 1 : workerSearchAnimation
                        }}>
                           {currentAppointment.accepted_by ?
                              'Worker Found!' :
                              'Looking for Worker...'
                           }
                        </Animated.Text>
                     </View>
                  </View>

                  <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
               </Pressable>
            </Animated.View>
         }
      </View>
   )
}

export default HomeScreen;

const styles = StyleSheet.create({})