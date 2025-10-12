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

const UpcomingBooking = () => {
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
         const bookingResult = await api.get('/worker/bookings/upcoming',{
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
      if (!hasMore || loadingMore || loading || refreshing) return;

      console.log("FETCHING MORE")

      await fetchBookings(page + 1, false);
   }, [hasMore, loadingMore, loading, page])

   const fetchRefresh = useCallback(async () => {
      console.log("REFRESHING")
      setBookings([])
      setPage(1);
      setHasMore(true);
      await fetchBookings(1, true);
   }, [])

   useFocusEffect(
      useCallback(() => {
         // Refresh data every time screen comes into focus
         setPage(1);
         setHasMore(true);
         fetchBookings(1, false);
      }, []) // Empty dependency array means it runs every time screen is focused
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
         {(!hasMore && !loadingMore && !loading) && (
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
            left={item?.reschedule?.status === 'Pending' ? {
               text: "Manage",
               function: () => {router.push({
                  pathname: `/dashboard/worker/booking/[id]/reschedule`,
                  params: {id: item.id}
               })},
            } : null}
            right={{
               text: "Details",
               function: () => {router.push({
                  pathname: '/dashboard/worker/booking/[id]/details',
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