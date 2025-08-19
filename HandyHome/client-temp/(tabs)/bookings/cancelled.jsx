import { FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {API_URL} from '../../../../../config';
import { useAuth } from '../../../../../context/AuthContext'

import { COLORS } from '../../../../../styles/constants';

import BookingItem from '../../../../../components/dashboard/booking/BookingItem'

const CancelledScreen = () => {
  const router = useRouter();
  const {token} = useAuth();

  const [bookingList, setBookingList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchBooking = async (pageLoad = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
       const result = await axios.get(`${API_URL}/user/book/fetch_bookings`, {
          params: {
             status: "Cancelled",
             page: pageLoad,
             limit: 5
          },
          headers : {
             'Authorization' : `Bearer ${token}`
          }
       }, );

       
       const newData = result?.data?.data?.bookings || [];

       setBookingList(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const filtered = newData.filter(item => !existingIds.has(item.id));
          return [...prev, ...filtered];
        });
       setPage(prev => prev + 1);
       setHasMore(newData.length > 0);
    } catch (err) {
       console.error('Failed to fetch bookings:', err);
    } finally {
       setTimeout(() => {
          setLoading(false);
       }, 1000)
    }


 }

  // useEffect(() => {
  //   console.log("[Cancelled]", bookingList)
  // }, [bookingList])

  useFocusEffect(
    useCallback(() => {
      setBookingList([]);
      setPage(1);
      setHasMore(true);
  
      fetchBooking(1);
  
      return () => {};
    }, [])
  );

  return (
    <FlatList 
    data={bookingList}
    onEndReached={fetchBooking}
    onEndReachedThreshold={0.5}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={21}
    ListFooterComponent={loading ? <ActivityIndicator color={COLORS.accent}  style={{paddingVertical: 24}}/> : null}
    renderItem={({item}) => 
    <BookingItem item={item}/>
    }/>
  )
}
  

export default CancelledScreen