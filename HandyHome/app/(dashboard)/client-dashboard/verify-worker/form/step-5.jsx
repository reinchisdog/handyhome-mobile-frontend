import { StyleSheet, Text, View, Pressable, FlatList, useWindowDimensions, Touchable, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';

import Check from '@expo/vector-icons/MaterialIcons';

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

export default SummaryScreen = () => {
   const {height} = useWindowDimensions();

   const {
      workerVerify,
   } = useWorkerVerify();

   return (
      <View 
      style={{
         alignItems: 'center',
         gap: 24,
         minHeight: height - 144 - 48 - 64,
         justifyContent: 'flex-start'
      }}>
         <Text style={styles.instruction}>
            Please review your application details before submission.
         </Text>
         <View style={{gap: 16, alignItems: 'flex-start'}}>
            {/* -------------------------------- Valid ID -------------------------------- */}
            <SummaryItem
            main={"Valid ID"}
            sub={`${workerVerify?.validIds?.[0]?.type?.title ?? "N/A"} | ${workerVerify?.validIds?.[1]?.type?.title ?? "N/A"}`}
            />

            {/* ----------------------- Licenses and Certifications ---------------------- */}
            <SummaryItem
            main={"Licenses and Certifications"}
            sub={`${workerVerify.certifications.length.toString()} file(s) added`}
            />

            {/* ------------------------------ Work Samples ------------------------------ */}
            <SummaryItem
            main={"Work Samples"}
            sub={`${workerVerify.workSamples.length.toString()} photo(s) added`}
            />

            {/* ------------------------------ Main Services ----------------------------- */}
            <SummaryItem
            main={"Service"}
            sub={`${workerVerify?.offeredService?.name ?? ""} | ${workerVerify?.offeredSubService?.name ?? ""}`}
            />

         </View>
      </View>
   )
}

const SummaryItem = ({main, sub}) => {
   return (
      <View style={styles.checklist}>  
         <Check name='check-circle' size={24} color={COLORS.green}/>
         <View style={styles.checklistTexts}>
            <Text style={styles.instruction}>{main}</Text>
            <Text numberOfLines={1} style={styles.checklistSub}>{sub}</Text>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   instruction: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'left',
      width: '100%',
      // backgroundColor: 'red'
   },
   checklist: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      // width: '100%',
      // backgroundColor: 'blue'
   },
   checklistTexts: {
      // width: '100%',
      flex: 1,
      gap: 4
   },
   checklistSub: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels,
      flexShrink: 1
   }
})