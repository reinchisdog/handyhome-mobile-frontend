import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios'
import { API_URL } from '../../../../config';
import { useAuth } from '../../../../context/AuthContext';

import Icons from '@expo/vector-icons/Feather';
import Arrows from '@expo/vector-icons/Entypo';
import Header from '../../../../components/dashboard/Header'

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants';


const AppointmentReceipt = () => {
   const router = useRouter();
   const {id} = useLocalSearchParams();
   const {token} = useAuth();

   const skeletonOpacity = useRef(new Animated.Value(0.5)).current;

   const [receipt, setReceipt] = useState(null);
   const [receiptLoading, setReceiptLoading] = useState(true);
   useEffect(() => {
      const animLoop = Animated.loop(
         Animated.sequence([
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.2,
               duration: 500,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
         ])
      )
  
      if (receiptLoading) animLoop.start();
      
      return () => animLoop.stop();
   }, [receiptLoading])

   useEffect(() => {
      if (!token || !id) return;

      const fetchReceipt = async () => {
         try {
            setReceiptLoading(true);

            const result = await axios.get(`${API_URL}/user/book/${id}/view_review_summary`, {
               headers: {
                  'Authorization' : `Bearer ${token}`
               }
            });

            setReceipt(result.data.data);
            
         } catch (err) {
            console.log(err)
         } finally {
            setReceiptLoading(false);
         }
      }

      fetchReceipt();
   }, [token, id])

   return (
      <ScrollView
      style={[global.screenContainer, {backgroundColor: '#fff'}]}
      contentContainerStyle={{paddingHorizontal: 8}}>
         <Header 
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"chevron-left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
         title = {
            <Text style={[global.headingText, {color: COLORS.primary}]}>E-Receipt</Text>
          }
         titleAlign = 'center'
         titlePosition = 'absolute'
         />

         <View
         style={[
         styles.summaryBox, {
         backgroundColor: 'white',
         paddingVertical: 24,
         }]}>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Transaction ID</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{`#${receipt?.booking?.id}`}</Text>
            )}
            
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Name</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{`#${receipt?.booking?.full_name}`}</Text>
            )}
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Phone Number</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{receipt?.booking?.phone_number}</Text>
            )}
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Address</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text numberOfLines={3} style={[styles.righText, {flexShrink: 1, textAlign: 'right'}]}>
                  {receipt && `${receipt?.booking?.block}, ${receipt?.booking?.barangay}, ${receipt?.booking?.municipal}, ${receipt?.booking?.province}`}
               </Text>
            )}   
         </View>
         
         </View>


         <View
         style={[
         styles.summaryBox, {
         backgroundColor: 'white',
         paddingVertical: 24,
         }]}
         >
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Service Name</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{receipt?.booking?.sub_services?.name}</Text>
            )}
         </View>
         {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Complexity</Text>
            <Text style={styles.righText}>{`${"Simple"}`}</Text>
         </View> */}
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Service Provider</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{receipt?.worker?.users?.full_name}</Text>
            )}
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Booking Date</Text>
            {(receiptLoading) ? (
              <Animated.View 
              style={{
                backgroundColor: COLORS.strokes,
                borderRadius: 8,
                flexGrow: 1,
                opacity: skeletonOpacity,
                height: '100%'
              }}/>
            ): (
              <Text style={styles.righText}>
                {receipt?.booking?.date && receipt?.booking?.time
                  ? `${new Date(
                      `${receipt.booking.date}T${receipt.booking.time}`
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })} | ${new Date(
                      `${receipt.booking.date}T${receipt.booking.time}`
                    ).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}`
                  : ""}
              </Text>
            )}  
         </View>
         </View>


         <View
         style={[
         styles.summaryBox, {
         backgroundColor: 'white',
         paddingVertical: 24,
         }]}
         >
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Base Labor Fee</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{`\u20b1 ${receipt?.booking?.price}`}</Text>
            )}
            
         </View>
         {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Moderate Complexity Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${200}`}</Text>
         </View> */}
         {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Transportation Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Voucher</Text>
            <Text style={styles.righText}>{`-\u20b1 ${75}`}</Text>
         </View> */}
         </View>


         <View
         style={[
         styles.summaryBox, {
         backgroundColor: 'white',
         paddingVertical: 24,
         }]}
         >
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Total</Text>
            {receiptLoading ? (
               <Animated.View 
               style={{
                 backgroundColor: COLORS.strokes,
                 borderRadius: 8,
                 flexGrow: 1,
                 opacity: skeletonOpacity,
                 height: '100%'
               }}/>
            ) : (
               <Text style={styles.righText}>{`\u20b1 ${receipt?.booking?.price}`}</Text>
            )}
         </View>
         </View>


         <TouchableOpacity
         style={[{
         margin: 'auto',
         padding: 24,
         flexDirection: 'row',
         alignItems: 'center',
         gap: 8
         }]}
         onPress={() => {}}>
         <Icons name='download' size={24} color={COLORS.primary}/>
         <View style={{ alignItems: 'center' }}>
            <Text 
               style={{
               textAlign: 'center',
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.md,
               color: COLORS.primary,
               }}
               onLayout={(e) => {
               // Optional: you can measure width dynamically here
               }}
            >
               Download E-Receipt
            </Text>

            <View 
               style={{
               height: 2,
               backgroundColor: COLORS.primary,
               marginTop: 4,
               width: '100%', 
               }}
            />
         </View>
         </TouchableOpacity>
         
      </ScrollView>
   )
   }

   export default AppointmentReceipt

   const styles = StyleSheet.create({
   summaryBox: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBlockColor: COLORS.labels,
      padding: 12,
      gap: 8
   },
   summaryBoxPressable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      borderRadius: 8,
      padding: 12,
      // backgroundColor: 'green',
      // width: '100%'
   },
   summaryBoxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: 24,
      borderRadius: 8,
      paddingHorizontal: 12,
      // backgroundColor: 'green',
      // width: '100%'
   },
   left: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
      // backgroundColor: 'red',
      height: '100%',
      flexGrow: 1,
      flexShrink: 1
   },
   right: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 4,
      // backgroundColor: 'blue',
      height: '100%',
      flexGrow: 1,
      flexShrink: 1
   },
   leftText: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels
   },
   righText: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons
   }
})