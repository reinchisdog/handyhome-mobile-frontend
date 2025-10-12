import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import Icons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONT_SIZES, FONTS } from '../../../../../../styles/constants'

const FormSummary = ({data}) => {
   // Hooks and States
   const summary = [
      {
         title: 'Valid ID',
         desc: `${data.primary_id[0].type}, ${data.primary_id[0].type}`
      }, {
         title: 'Licenses and Certifications',
         desc: `${data.certificates.length === 0 ? 'No' : data.certificates.length} file${data.certificates.length === 1 ? "" : "s"} added`
      },
      {
         title: 'Work Samples',
         desc: `${data.work_samples.length} file${data.work_samples.length === 1 ? "" : "s"} added`
      }, {
         title: 'Service',
         desc: `${data.service.name}`
      },
   ]

   React.useEffect(() => {
      console.log(data);
   }, [data])

   return (
      <View style={{gap: 12}}>
         <Text
         style={{
            fontFamily: FONTS.roboto600,
            fontSize: FONT_SIZES.md,
            color: COLORS.labels,
         }}>
            Please review your application details before submission.
         </Text>
         
         <FlatList 
         scrollEnabled={false}
         data={summary}
         renderItem={({item}) => (
            <View
            style={{
               flexDirection: 'row',
               alignItems: 'center',
               gap: 8
            }}>
               <Icons name='check-circle' size={24} color={COLORS.green} />
               <View
               style={{ gap: 4 }}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons
                  }}>
                     {item.title}
                  </Text>

                  <Text
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels
                  }}>
                     {item.desc}
                  </Text>
               </View>
            </View>
         )}
         contentContainerStyle={{
            gap: 12
         }}
         />
      </View>
   )
}

export default FormSummary

const styles = StyleSheet.create({})