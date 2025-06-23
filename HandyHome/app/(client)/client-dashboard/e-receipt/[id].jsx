import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

import Icons from '@expo/vector-icons/Feather';
import Arrows from '@expo/vector-icons/AntDesign';
import Header from '../../../../components/dashboard/Header'

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants';


const AppointmentReceipt = () => {
   const router = useRouter();
   return (
      <ScrollView
      style={[global.screenContainer, {backgroundColor: '#fff'}]}
      contentContainerStyle={{paddingHorizontal: 8}}
      >
         <Header 
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"left"} size={24} color={COLORS.primary} />
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
         }]}
         >
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Transaction ID</Text>
            <Text style={styles.righText}>{`#${123456}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Name</Text>
            <Text style={styles.righText}>{`${"Paul McCartney"}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Phone Number</Text>
            <Text style={styles.righText}>{`${"0922-222-2222"}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Address</Text>
            <Text numberOfLines={3} style={[styles.righText, {flexShrink: 1, textAlign: 'right'}]}>{`${"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt provident sequi, veniam reprehenderit iure nemo laboriosam. Culpa, aliquid nesciunt molestiae ea reprehenderit sint optio eveniet harum deleniti? Eaque, ullam fugit?"}`}</Text>
            
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
            <Text style={styles.righText}>{`${"Leak Repair"}`}</Text>
         </View>
         {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Complexity</Text>
            <Text style={styles.righText}>{`${"Simple"}`}</Text>
         </View> */}
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Service Provider</Text>
            <Text style={styles.righText}>{`${"Service Provider Name"}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Booking Date</Text>
            <Text style={styles.righText}>{`${"April 28, 2025"} | ${"10:00 AM"}`}</Text>
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
            <Text style={styles.righText}>{`\u20b1 ${300}`}</Text>
         </View>
         {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Moderate Complexity Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${200}`}</Text>
         </View> */}
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Transportation Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
         </View>
         <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Voucher</Text>
            <Text style={styles.righText}>{`-\u20b1 ${75}`}</Text>
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
            <Text style={styles.leftText}>Total</Text>
            <Text style={styles.righText}>{`\u20b1 ${675}`}</Text>
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
      alignItems: 'flex-start',
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