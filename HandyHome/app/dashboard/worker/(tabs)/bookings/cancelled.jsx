// Screens: Upcoming Bookings

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext'
// ---- Other Components
import WorkerBookingItem from '../../../../../components/WorkerBookingItem';
import LoadingDots from '../../../../../components/LoadingDots';
import BookingsEmpty from '../../../../../components/BookingsEmpty';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other Libs
import api from '../../../../../lib/api';

const MAX_LIMIT = 10;

const CancelledBooking = () => {
   // Hooks and States
   const {token} = useAuth();
   const router = useRouter();

   const [bookings, setBookings] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [refreshing, setRefreshing] =useState(false);
   const [hasMore, setHasMore] = useState(true);


   const fetchBookings = async (pageNum = 1, isRefresh = false) => {
      if ((loading || loadingMore) && !isRefresh) return;

      try {
         if (!isRefresh) {
            // Only show refresh control for explicit refresh actions
            setPage(pageNum);
         } else {
            setPage(1);
         }

         if (isRefresh) {
            setRefreshing(true);
         } else if (pageNum === 1) {
            // First/initial load - show loading but not refresh control
            setLoading(true);
         } else {
            // Load more pages
            setLoadingMore(true);
         }

         const params = {
            page: pageNum,
            limit: MAX_LIMIT,
         }
         // console.log("---- [Upcoming] Fetching Attempt ----");
         // console.log("[1] Fetching Bookings");
         const bookingResult = await api.get('/worker/bookings/cancelled',{
            headers: {'Authorization': `Bearer ${token}`},
            params: params,
         });

         // console.log("[2] Succesfully Fetched");
         const bookingData = bookingResult?.data?.data?.bookings;
         // console.log(bookingData);
         if (isRefresh) {
            setBookings(bookingData);
         } else {
            setBookings(prev => pageNum === 1 ? bookingData : [...prev, ...bookingData]);
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

   const fetchMore = async () => {
      if (!hasMore || loadingMore || loading || refreshing || bookings.length === 0) return;

      await fetchBookings(page + 1, false);
   }

   const fetchRefresh = async () => {
      if (refreshing) return;

      setBookings([]);
      setPage(1);
      setHasMore(true);
      await fetchBookings(1, true);
   }

   useFocusEffect(
      useCallback(() => {
         if (bookings.length === 0 && !loading) {
            setPage(1);
            fetchBookings(1, false);
         }
      }, [])
   );

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
         {(!hasMore && !loadingMore && !loading && bookings.length !== 0) && (
            <View style={global.divider}/>
         )}
      </View>
   )

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.screenbg}]}>
         <FlatList 
         data={bookings}
         renderItem={({item}) => (
            <WorkerBookingItem 
            booking={item}
            left={{
               text: "Details",
               function: () => {router.push({
                  pathname: `/dashboard/worker/booking/[id]/details`,
                  params: {id: item.id}
               })},
            }}
            />
         )}
         style={{flex: 1}}
         contentContainerStyle={{
            padding: 12,
            gap: 8,
            alignItems: 'stretch',
            flexGrow: 1
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
            (!loading && !refreshing) &&
               <BookingsEmpty 
               title={"No Cancelled Bookings"}
               description={"You don't have any cancelled bookings. Hopefully it stays that way!"}
               />
         )}/>

      </View> 
   )
}

export default CancelledBooking

const styles = StyleSheet.create({})