// import { StyleSheet, Text, View, FlatList, Image, TouchableHighlight, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState, useCallback } from 'react';
// import { useRouter, useFocusEffect } from 'expo-router';
// import axios from 'axios';
// import { API_URL } from '../../../../../config';
// import { useAuth } from '../../../../../context/AuthContext'
// import { subServiceImages } from '../../../../../components/SubServiceMap';

// import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
// import Icons2 from '@expo/vector-icons/MaterialIcons';
// import { globalStyles as global } from '../../../../../styles/globalStyles';
// import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

// const UpcomingScreen = () => {
//    const router = useRouter();
//    const {token} = useAuth();

//    const [bookingList, setBookingList] = useState([])
//    const [page, setPage] = useState(1);
//    const [loading, setLoading] = useState(false);
//    const [hasMore, setHasMore] = useState(true);
   
//    const fetchBooking = async (pageLoad = page) => {
//       if (loading || !hasMore) return;
//       setLoading(true);

//       try {
//          const result = await axios.get(`${API_URL}/worker/bookings/fetch_bookings`, {
//             params: {
//                status: "Upcoming",
//                page: pageLoad,
//                limit: 5
//             },
//             headers : {
//                'Authorization' : `Bearer ${token}`
//             }
//          }, );

         
//          const newData = result?.data?.data?.bookings || [];

//          setBookingList(prev => {
//             const existingIds = new Set(prev.map(item => item.id));
//             const filtered = newData.filter(item => !existingIds.has(item.id));
//             return [...prev, ...filtered];
//           });
//          setPage(prev => prev + 1);
//          setHasMore(newData.length > 0);
//       } catch (err) {
//          console.error('Failed to fetch bookings:', err);
//       } finally {
//          setTimeout(() => {
//             setLoading(false);
//          }, 1000)
//       }
//    }

//    useFocusEffect(
//       useCallback(() => {
//         setBookingList([]);
//         setPage(1);
//         setHasMore(true);
    
//         fetchBooking(1);
    
//         return () => {};
//       }, [])
//     );
    

//   return (
//    <FlatList 
//    data={bookingList}
//    onEndReached={fetchBooking}
//    onEndReachedThreshold={0.5}
//    initialNumToRender={10}
//    windowSize={21}
//    ListFooterComponent={loading ? <ActivityIndicator color={COLORS.accent} style={{paddingVertical: 24}}/> : null}
//    renderItem={({item}) => 
//    <BookingItem item={item} 
//    right={{
//       name: "Details",
//       function: () => {router.push({
//          pathname: 'worker-dashboard/booking-actions/details/[id]',
//          params: {id: item.id, status: "Ongoing"}
//       })}
//    }}/>
//    }
//    />
//   )
// }
  
// export default UpcomingScreen

// const BookingItem = ({item, left, right}) => {

//    return (
//       <View 
//       style={{
//          width: '100%',
//          backgroundColor: '#fff',
//          padding: 24,
//          gap: 12,
//          borderBottomWidth: StyleSheet.hairlineWidth,
//          borderColor: COLORS.lettersicons
//       }}>
//          {/* ------------------------------- Information ------------------------------ */}
//          <View 
//          style={[
//             global.centerContainer, {
//             width: '100%',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'stretch',
//             gap: 24
//          }]}>
 
//             <Image 
//             source={subServiceImages[item.service_info.subServiceId]}
//             style={{
//                height: '100%',
//                width: 100,
//                // aspectRatio: '1/1',
//                borderRadius: 8,
//                objectFit: 'cover',
//                resizeMode: 'cover'
//             }}/>
 
//             <View 
//             style={{
//                height: '100%',
//                flex: 1,
//                alignItems: 'flex-start',
//                gap: 8,
//             }}>
//                <View 
//                style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   width: '100%'
//                }}>
//                   <View
//                   style={[
//                      global.tagContainer,
//                      global.centerContainer, {
//                      backgroundColor: '#F2F2F7'
//                   }]}>
//                      <Text
//                      style={[
//                         global.tagText,{
//                         color: COLORS.primary
//                      }]}>
//                         {item.service_info.serviceCategory}
//                      </Text>
//                   </View>
 
//                   <Text
//                   style={[{
//                      fontFamily: FONTS.roboto500,
//                      fontSize: FONT_SIZES.lg,
//                      letterSpacing: 0.2,
//                      color: COLORS.accent
//                   }]}>
//                      {`\u20B1 ${item.service_info.price}`}
//                   </Text>
//                </View>
 
//                {/* ---- Service Name */}
//                <Text
//                numberOfLines={1}
//                style={[{
//                   fontFamily: FONTS.roboto700,
//                   fontSize: FONT_SIZES.lg,
//                   letterSpacing: 0.2,
//                   color: 'black',
//                   flexShrink: 1
//                }]}>
//                   {item.service_info.serviceName}
//                </Text>
 
//                {/* ---- Client Name */}
//                <View style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: 4,
//                }}>
//                   <Icons2 name="person" size={14} color={COLORS.lettersicons} />
//                   <Text
//                   numberOfLines={1}
//                   style={{
//                      fontFamily: FONTS.roboto400,
//                      fontSize: FONT_SIZES.sm,
//                      color: COLORS.lettersicons,
//                      flexShrink: 1
//                   }}>
//                      {item.user.name}
//                   </Text>
//                </View>
 
//                {/* ---- Location */}
//                <View style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   gap: 4,
//                }}>
//                   <Icons2 name="location-on" size={14} color={COLORS.red} />
//                   <Text
//                   numberOfLines={1}
//                   style={{
//                      fontFamily: FONTS.roboto400,
//                      fontSize: FONT_SIZES.sm,
//                      color: COLORS.lettersicons,
//                      flexShrink: 1
//                   }}>
//                      {item.user.full_address}
//                   </Text>
//                </View>
//             </View>
//          </View>
         
//          {/* --------------------------------- Buttons -------------------------------- */}
//          {(left || right) &&
//             <View style={{
//             width: '100%',
//             height: 32,
//             flex: 3,
//             flexDirection: 'row',
//             justifyContent: 'flex-end',
//             alignItems: 'center',
//             gap: 12
//          }}>
//             <View style={{
//                height: '100%',
//                maxWidth: '33.33%',
//                flex: 1,
//             }}></View>
 
//          {
//             // ---- First Button (Upcoming / Completed)
//             (left) &&
//             <TouchableHighlight
//                underlayColor="#d8d8d8"
//                style={[
//                   global.centerContainer, {
//                   height: '100%',
//                   maxWidth: '33.33%',
//                   flex: 1,
//                   backgroundColor: '#fff',
//                   borderRadius: 16,
//                   borderWidth: 2,
//                   borderColor: COLORS.strokes,
//                }]}
//                onPress={left.function}
//             >
//                <Text
//                   style={[{
//                      fontFamily: FONTS.roboto700,
//                      fontSize: FONT_SIZES.sm,
//                      color: COLORS.lettersicons
//                   }]}
//                >
//                   {left.name}
//                </Text>
//             </TouchableHighlight>
//          }
 
//          {(right) &&
//             // ---- Second Button
//             <TouchableHighlight
//                style={[
//                   global.centerContainer, {
//                   height: '100%',
//                   maxWidth: '33.33%',
//                   flex: 1,
//                   backgroundColor: COLORS.primary,
//                   borderRadius: 16,
//                   borderWidth: 2,
//                   borderColor: COLORS.primary,
//                }]}
//                underlayColor={'#035082'}
//                onPress={right.function}   
//             >
//                <Text
//                   style={[{
//                      fontFamily: FONTS.roboto700,
//                      fontSize: FONT_SIZES.sm,
//                      color: '#fff'
//                   }]}
//                >
//                   {right.name}
//                </Text>
//             </TouchableHighlight>
//          }
//             </View>
//          }
 
//       </View>
//    )
//  }