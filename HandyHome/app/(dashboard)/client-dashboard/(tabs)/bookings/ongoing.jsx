import { FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '../../../../../config';
import { useAuth } from '../../../../../context/AuthContext'

import { COLORS } from '../../../../../styles/constants';

import BookingItem from '../../../../../components/dashboard/booking/BookingItem'

const OngoingScreen = () => {
  const router = useRouter();
  const {token} = useAuth();

  const [bookingList, setBookingList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchBooking = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
        const result = await axios.get(`${API_URL}/user/book/fetch_bookings`, {
          params: {
              status: "Ongoing",
              page: page,
              limit: 5
          },
          headers : {
              'Authorization' : `Bearer ${token}`
          }
        }, );

        
        const newData = result?.data?.data?.bookings || [];
        
        setBookingList(prev => [...prev, ...newData]);
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

  useEffect(() => {
    fetchBooking();
  }, [])

  return (
    <FlatList 
    data={bookingList}
    keyExtractor={(item) => item.id.toString()}
    onEndReached={fetchBooking}
    onEndReachedThreshold={0.5}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={21}
    ListFooterComponent={loading ? <ActivityIndicator color={COLORS.accent} style={{paddingVertical: 24}} /> : null}
    renderItem={({item}) => 
    <BookingItem item={item} 
    left = {{
        name: 'Message',
        function: () => {
          router.push({
          pathname: '/client-dashboard/inbox',
          params: {id: item.id}
          })
        }
    }}
    right = {{
        name: 'Details',
        function: () => {
          router.push({
          pathname: '/client-dashboard/booking-actions/details/[id]',
          params: {id: item.id, status: item.status, data: item}
          })
        }
    }}/>
    }/>
  )
}

export default OngoingScreen