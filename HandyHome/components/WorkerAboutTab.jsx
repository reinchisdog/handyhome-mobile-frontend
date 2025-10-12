// Component: Worker About Tab

// Imports
// ---- React Components
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const WorkerAboutTab = ({data}) => {
   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
   
   const availableSchedule = daysOfWeek
      .filter(day => data?.availability?.[day]?.is_available) 
      .map(day => ({
         day,
         start: data.availability[day].start,
         end: data.availability[day].end,
         timeRange: `${data.availability[day].start} - ${data.availability[day].end}`
      }))
   ;


   return (
      <Tabs.ScrollView style={{flex: 1, padding: 12}} contentContainerStyle={{gap: 12}}>
         {/* ---- Services */}
         <View style={styles.section}>
            <Text style={styles.title}>Services</Text>
            <View style={global.divider}/>
            <Text style={[styles.service, {backgroundColor: COLORS.primary, color: '#fff'}]}>
               {data?.service}
            </Text>
            <Text style={styles.service}>
               {data?.sub_service}
            </Text>
         </View>

         {/* ---- Working Hours */}
         <View style={styles.section}>
            <Text style={styles.title}>Working Hours</Text>
            <View style={global.divider}/>

            {availableSchedule.length > 0 ? (
               availableSchedule.map(({ day, timeRange }) => (
                  <View key={day} style={styles.schedule}>
                     <Text style={styles.day}>{day}</Text>
                     <Text style={styles.time}>{timeRange}</Text>
                  </View>
               ))
            ) : (
               <Text style={styles.noSchedule}>No schedule available</Text>
            )}
         </View>
      </Tabs.ScrollView>
   )
}

export default WorkerAboutTab

const styles = StyleSheet.create({
   section: {
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#fff',
      width: '100%',
      gap: 8
   },
   title: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons
   },
   service: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: COLORS.secondary,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.xs,
      color: COLORS.primary,
      flexShrink: 1,
      textAlign: 'center'
   },
   schedule: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   day: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels
   },
   time: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons
   },
   noSchedule: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels,
      textAlign: 'center',
      fontStyle: 'italic'
   }

})