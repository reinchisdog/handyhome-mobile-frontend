// Screens: Upcoming Bookings

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, RefreshControl, Modal, Pressable } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext'
// ---- Other Components
import UserBookingItem from '../../../../../components/UserBookingItem';
import LoadingDots from '../../../../../components/LoadingDots';
import BookingsEmpty from '../../../../../components/BookingsEmpty';
import MainButton from '../../../../../components/MainButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other Libs
import api from '../../../../../lib/api';

const MAX_LIMIT = 10;

const UpcomingBooking = () => {
   // Hooks and States
   const {token} = useAuth();
   const router = useRouter();
   const insets = useSafeAreaInsets();

   const [bookings, setBookings] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [refreshing, setRefreshing] =useState(false);
   const [hasMore, setHasMore] = useState(true);

   const [manageModal, setManageModal] = useState(false);
   const [managedId, setManagedId] = useState(null);

   const fetchBookings = async (pageNum = 1, isRefresh = false) => {
      if ((loading || loadingMore) && !isRefresh) return;

      try {
         if (isRefresh) {
            // Only show refresh control for explicit refresh actions
            setRefreshing(true);
            setLoading(false);
         } else if (pageNum === 1) {
            // First/initial load - show loading but not refresh control
            setLoading(true);
            setRefreshing(false);
         } else {
            // Load more pages
            setLoadingMore(true);
         }

         console.log("---- [Upcoming] Fetching Attempt ----");
         console.log("[1] Fetching Bookings");
         const bookingResult = await api.get('/user/book/Upcoming',{
            params: {
               page: pageNum,
               limit: MAX_LIMIT,
            },
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         console.log("[2] Succesfully Fetched");
         const bookingData = bookingResult?.data?.data?.bookings;
         console.log(bookingData);
         if (isRefresh || pageNum === 1) {
            setBookings(bookingData);
         } else {
            setBookings(prev => [...prev, ...bookingData]);
         }

         setHasMore(bookingData.length === MAX_LIMIT);

         if (!isRefresh) {
            setPage(pageNum);
         }

      } catch (err) {

      } finally {
         setLoading(false);
         setLoadingMore(false);
         setRefreshing(false);
      }
   }

   const fetchMore = useCallback(async () => {
      if (!hasMore || loadingMore || loading) return;

      await fetchBookings(page + 1, false);
   }, [hasMore, loadingMore, loading, page])

   const fetchRefresh = useCallback(async () => {
      setPage(1);
      setHasMore(true);
      await fetchBookings(1, true);
   }, [])

   useFocusEffect(
      useCallback(() => {
         if (bookings.length === 0 && !loading) {
            setPage(1);
            fetchBookings(1, false);
         }
      }, [])
   );

   const openManageModal = (id) => {
      setManagedId(id);
      setManageModal(true);
   }

   // Renders
   const renderFooter = () => (
      <View style={{
         width: '100%',
         paddingVertical: 32,
         // backgroundColor: COLORS.accent
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         {(loadingMore || (loading && bookings.length === 0)) && (
            <LoadingDots size={12} />
         )}

         {/* Show divider only when done and no more data */}
         {(!hasMore && !loadingMore && !loading) && (
            <View style={global.divider}/>
         )}
      </View>
   )

   const canManageBooking = (bookingDate) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const booking = new Date(bookingDate + 'T00:00:00');

      const timeDiff = booking - today;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      return daysDiff > 1;
   };

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.screenbg}]}>
         <Modal
         visible={manageModal}
         onRequestClose={() => setManageModal(false)}
         animationType='slide'
         statusBarTranslucent={true}
         backdropColor={COLORS.modalbg}
         style={{flex: 1}}
         >  
            <Pressable style={{flex: 1}} onPress={() => setManageModal(false)}/>
            <View
            style={[
               global.shadowBottom, {
               paddingTop: 24,
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               borderWidth: StyleSheet.hairlineWidth,
               borderColor: COLORS.strokes,
               backgroundColor: '#fff',
               borderTopLeftRadius: 24,
               borderTopRightRadius: 24,
               flexDirection: 'column',
               gap: 16,
               alignItems: 'stretch'
            }]}>
               <MainButton 
               type='primary'
               text='Reschedule Booking'
               onPress={() => {
                  router.push({
                     pathname: `/dashboard/client/booking/[id]/reschedule`,
                     params: {id: managedId}
                  });
                  setManageModal(false);
               }}
               />

               <MainButton 
               type='secondary'
               text='Cancel Booking'
               onPress={() => {
                  router.push({
                     pathname: `/dashboard/client/booking/[id]/cancel`,
                     params: {id: managedId}
                  });
                  setManageModal(false);
               }}
               />
            </View>
         </Modal>

         <FlatList 
         data={bookings}
         renderItem={({item}) => (
            <UserBookingItem 
            data={item}
            left={canManageBooking(item.date) ? {
               text: "Manage",
               function: () => {openManageModal(item.id)},
            } : null}
            right={{
               text: "Details",
               function: () => {router.push({
                  pathname: '/dashboard/client/booking/[id]/details',
                  params: {id: item.id}
               })},
            }}
            />
         )}
         style={{flex: 1}}
         contentContainerStyle={{
            padding: 12,
            gap: 8,
            alignItems: 'stretch'
         }}
         onEndReachedThreshold={0.5}
         onEndReached={fetchMore}
         refreshing={refreshing}
         onRefresh={fetchRefresh}
         refreshControl={
            <RefreshControl 
            refreshing={refreshing}
            colors={[COLORS.lightblue, COLORS.primary]}
            onRefresh={fetchRefresh}
            />
         }
         showsVerticalScrollIndicator={false}
         ListFooterComponent={renderFooter}
         ListEmptyComponent={() => (
            !loading &&
               <BookingsEmpty 
               title={"No Upcoming Bookings"}
               description={"You don't have any bookings scheduled yet. Browse and book your next appointment to get started!"}
               />
         )}/>

      </View> 
   )
}

export default UpcomingBooking

const styles = StyleSheet.create({})