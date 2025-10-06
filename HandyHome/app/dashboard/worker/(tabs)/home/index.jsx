// Screen: Home Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Pressable, Modal, StatusBar} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
// ---- Contexts
import { useAuth } from "../../../../../context/AuthContext";
import { useAppData } from "../../../../../context/AppDataContext";
import supabase from "../../../../../lib/supabase";
import api from '../../../../../lib/api';
import {useConvert} from '../../../../../hooks/useConvert';
// ---- Custom Components
import Header from '../../../../../components/Header';
import LogoText from '../../../../../components/LogoText';
import HomeGraphic from '../../../../../components/HomeGraphic';
import HomeGreetings from '../../../../../components/HomeGreetings';
import WorkerBookingItem from '../../../../../components/WorkerBookingItem'
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { ServiceIconMap } from '../../../../../components/ServiceIconMap';
import LoadingDots from '../../../../../components/LoadingDots';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainButton from '../../../../../components/MainButton';


const HomeScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const { user, token } = useAuth();
   const {convertDateToFormattedDate} = useConvert();

   const [requests, setRequests] = useState([]);
   const [requestLoading, setRequestLoading] = useState(false);
   const [latest, setLatest] = useState(null);
   const [latestLoading, setLatestLoading] = useState(false);

   const [buttonLoading, setButtonLoading] = useState(false);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("")

   const [refreshing, setRefreshing] = useState(false);

   // Refs
   const subscriptionRef = useRef(null);
   
   // Functions
   const fetchRequests = async (isRefresh = false) => {
      if (requestLoading && !isRefresh) return;

      try {
         setRequestLoading(true);

         // console.log("---- [Home Screen] Fetch Attempt ----");
         // console.log('[1] Fetching for Incoming Requests');
         const requestResult = await api.get('worker/bookings/pending', {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         // console.log("[2] Succesfull Fetched");
         const requestData = requestResult?.data?.data;
         console.log('REQUESTS:', requestData);
   
         // Deduplicate by ID
         const deduplicatedData = requestData.filter((newItem, index, self) => 
            self.findIndex(item => item.id === newItem.id) === index
         );
         
         if (isRefresh) {
            setRequests(deduplicatedData);
         } else {
            setRequests(prev => {
               const combined = [...prev, ...deduplicatedData];
               // Remove duplicates from combined array
               return combined.filter((item, index, self) => 
                  self.findIndex(i => i.id === item.id) === index
               );
            });
         }
      } catch (err) {
         // console.log("[0] Fetching Error:", err);
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when fetching your latest booking.";
         setLatest(null);
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setRequestLoading(false);
      }
   }

   const fetchLatest = async (isRefresh = false) => {
      if (latestLoading && !isRefresh) return;

      try {
         setLatestLoading(true);

         // console.log("---- [Home Screen] Fetch Attempt ----");
         // console.log('[1] Fetching for Latest Booking');
         const latestResult = await api.get('worker/bookings/ongoing', {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         // console.log("[2] Succesfull Fetched");
         const latestData = latestResult?.data?.data?.ongoing 
               || (latestResult?.data?.data?.pending?.length ? latestResult.data.data.pending[0] : null);
         console.log("LATEST DATA:", latestData);
         setLatest(latestData);
      } catch (err) {
         // console.log("[0] Fetching Error:", err);
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when fetching your incoming requests.";
         setLatest([]);
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setLatestLoading(false);
      }
   }

   const fetchRefresh = useCallback(async () => {
      setRefreshing(true);

      await fetchRequests(true);
      await fetchLatest(true);

      setRefreshing(false);
   }, [])

   const cleanupSubscription = () => {
      if (subscriptionRef.current) {
         subscriptionRef.current.unsubscribe();
         subscriptionRef.current = null;
      }
   }
   
   useEffect(() => {
      if (!user?.user_id) {
         cleanupSubscription();
         return;
      }

      cleanupSubscription();

      const changes = supabase
         .channel(`requests-${user?.user_id}`)
         .on(`postgres_changes`, {
            event: '*',
            schema: 'public',
            table: 'initial_bookings',
         },
         async (payload) => {
            console.log('[Realtime]', payload);
            await fetchRequests(true);
            // await fetchLatest(true);
         }
      ).subscribe();  

      subscriptionRef.current = changes;

      return () => {
         cleanupSubscription();
      };

   }, [user?.user_id])
   
   useFocusEffect(
      useCallback(() => {
         if (requests.length === 0 && !requestLoading) {
            fetchRequests(false);
            fetchLatest(false);
         }
      }, [])
   )

   // Renders
   const renderDate = (date) => {
      const bookDate = new Date(date);
      return convertDateToFormattedDate(bookDate, 'short')
   }

   const renderFooter = () => (
      <View style={{
         width: '100%',
         paddingVertical: 32,
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         {(requestLoading && requests.length === 0) && (
            <LoadingDots size={12} slide={false} />
         )}
      </View>
   )

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         <ScrollView
         style={{
            flex: 1,
            backgroundColor: COLORS.screenbg
         }}
         stickyHeaderIndices={[0]}
         refreshControl={
            <RefreshControl 
            refreshing={refreshing}
            colors={[COLORS.lightblue, COLORS.primary]}
            onRefresh={fetchRefresh}
            />
         }>
            <Header 
            customTitle={<LogoText size={24}/>}
            hasBack={false}
            rightIcon={
               <TouchableOpacity 
               // onPress={() => {console.log("[Routing] to Notification")}}
               onPress={() => router.push('/dashboard/worker/home/notifications')}
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

                  {latest ?
                     <View
                     style={[
                        // global.shadowBottom, 
                        {
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        marginHorizontal: 24,
                        borderColor: COLORS.strokes,
                        borderWidth: StyleSheet.hairlineWidth
                     }]}>
                        <View
                        style={{
                           flexDirection: 'row',
                           padding: 12,
                           borderBottomWidth: 1,
                           borderColor: COLORS.strokes,
                           alignItems: 'stretch',
                           justifyContent: 'space-between',
                           gap: 8,
                        }}>
                           <View style={{flexShrink: 1, gap: 6}}>
                              <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                                 <ServiceIconMap serviceId={latest?.service_info?.subServiceId}/>
                                 <Text
                                 numberOfLines={1}
                                 style={{
                                    fontFamily: FONTS.roboto500,
                                    fontSize: FONT_SIZES.md,
                                    color: COLORS.lettersicons,
                                    flexShrink: 1
                                 }}>
                                    {latest?.service_info?.serviceName}
                                 </Text>
                              </View>

                              <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                                 <Icons name='map-marker'  size={24} color={COLORS.red}/>
                                 <Text
                                 numberOfLines={1}
                                 style={{
                                    fontFamily: FONTS.roboto500,
                                    fontSize: FONT_SIZES.md,
                                    color: COLORS.labels,
                                    flexShrink: 1
                                 }}>
                                    {latest?.user?.full_address}
                                 </Text>
                              </View>
                           </View>

                           <Pressable
                           onPress={() => router.push({
                              pathname: '/dashboard/worker/booking/[id]/details',
                              params: {id: latest?.id}
                           })}
                           style={({pressed}) =>[{
                              width: 32,
                              borderRadius: 24,
                              justifyContent: 'center',
                              alignItems: 'center',
                              opacity: pressed ? 0.5 : 1,
                              // backgroundColor: 'green'
                           }]}>
                              <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                           </Pressable>

                        </View>

                        <View
                        style={{
                           flexDirection: 'row',
                           paddingHorizontal: 18,
                           paddingVertical: 16,
                           justifyContent: 'space-between',
                           gap: 12,
                           alignItems: 'center'
                        }}>
                           <Text numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto500,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons,
                              flexShrink: 1
                           }}>
                              {renderDate(latest?.date)}
                           </Text>
                           <Text numberOfLines={1}
                           style={{
                              fontFamily: FONTS.roboto500,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons,
                              flexShrink: 1
                           }}>
                              {latest?.time?.slice(0,5)}
                           </Text>

                        </View>
                     </View>
                     : 
                     latestLoading ? 
                     <View
                     style={{
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        height: 136,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                        padding: 24,
                        marginHorizontal: 24,
                        borderColor: COLORS.strokes,
                        borderWidth: StyleSheet.hairlineWidth
                     }}>
                        <LoadingDots size={12} slide={false} />
                     </View>
                     :
                     <View
                     style={{
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        height: 136,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                        padding: 24,
                        marginHorizontal: 24,
                        borderColor: COLORS.strokes,
                        borderWidth: StyleSheet.hairlineWidth
                     }}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.xxl,
                           color: COLORS.primary
                        }}>
                           No Ongoing Service...
                        </Text>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.labels,
                           textAlign: 'center'
                        }}>
                           You don’t have any ongoing work right now. Stay prepared — your next booking could be just around the corner!
                        </Text>
                     </View>
                  }

                  <FlatList 
                  scrollEnabled={false}
                  data={requests}
                  renderItem={({item}) => (
                     <WorkerBookingItem 
                     request={item}
                     right={{
                        text: "Details",
                        laoding: buttonLoading,
                        function: () => {router.push({
                           pathname: '/dashboard/worker/request/[id]',
                           params: {id: item.id}
                        })},
                     }}
                     />
                  )}
                  contentContainerStyle={{
                     paddingHorizontal: 24,
                     gap: 12
                  }}
                  ListEmptyComponent={() => (
                     !requestLoading &&
                        <View style={{
                           borderRadius: 20,
                           width: '100%',
                           backgroundColor: '#fff',
                           height: 160,
                           justifyContent: 'center',
                           alignItems: 'center',
                           gap: 8,
                           paddingHorizontal: 12,
                           paddingVertical: 24,
                        }}>
                           <Text
                           style={{
                              fontFamily: FONTS.roboto700,
                              fontSize: FONT_SIZES.xxl,
                              color: COLORS.primary
                           }}>
                              No Incoming Requests...
                           </Text>

                           <Text
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.labels,
                              textAlign: 'center'
                           }}>
                              You have no incoming booking requests right now. Take a breather — we’ll notify you as soon as a new one arrives!
                           </Text>
                        </View>
                  )}
                  ListHeaderComponent={
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary,
                        textAlign: 'left',
                        // marginBottom: 0,
                     }}>
                        Incoming Requests
                     </Text>
                  }
                  ListFooterComponent={renderFooter}
                  />
               </View>

               <HomeGraphic />
            </View>
         </ScrollView>
      </>
   )
}

export default HomeScreen;

const styles = StyleSheet.create({})