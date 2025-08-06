import { StyleSheet, Text, View, FlatList, Pressable, TouchableOpacity, TouchableHighlight, useWindowDimensions } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';
import Header from '../../../../components/dashboard/Header';

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';


const AddressesList = [
  {
    name: "Paul McCartney",
    phoneNumber: "091234567689",
    address: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime nemo eius dolorem necessitatibus aspernatur tenetur repellendus quasi dolores, explicabo officia ullam! Repellendus debitis ab ullam cum vitae voluptatum sunt."
  },
  {
    name: "John Lennon",
    phoneNumber: "091234567689",
    address: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime nemo eius dolorem necessitatibus aspernatur tenetur repellendus quasi dolores, explicabo officia ullam! Repellendus debitis ab ullam cum vitae voluptatum sunt."
  },
  {
    name: "George Harrison",
    phoneNumber: "091234567689",
    address: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime nemo eius dolorem necessitatibus aspernatur tenetur repellendus quasi dolores, explicabo officia ullam! Repellendus debitis ab ullam cum vitae voluptatum sunt."
  },
  {
    name: "Ringo Starr",
    phoneNumber: "091234567689",
    address: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto maxime nemo eius dolorem necessitatibus aspernatur tenetur repellendus quasi dolores, explicabo officia ullam! Repellendus debitis ab ullam cum vitae voluptatum sunt."
  },
]

const AppointmentAddresses = () => {
   const {width} = useWindowDimensions();
   const router = useRouter();

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
         <Header 
         background={'#fff'}
         left={(
            <TouchableOpacity onPress={() => router.back()}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
         )}

         title={(
            <Text style={[global.headingText, {color: COLORS.primary}]}>My Addresses</Text>
         )}
         titleAlign='center'
         titlePosition='absolute'
         />

         <FlatList 
         contentContainerStyle={{
            paddingHorizontal: 8
         }}
         data={AddressesList}
         renderItem={({item}) => (
            <View
            style={styles.summaryBox}
            >
               <Pressable 
               style={({pressed}) => [
               styles.summaryBoxPressable, {
               backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
               }]}
               onPress={() => {}}
               >
               <View style={styles.left}>
                  <Icons name="map-marker" size={24} color={COLORS.primary} />
                  <View style={{ flexShrink: 1, gap: 2}}>
                     <View style={{flexDirection: 'row', gap: 6}}>
                     <Text style={styles.righText}>
                        {item.name}
                     </Text>
                     <Text style={styles.leftText}>
                        {`(${item.phoneNumber})`}
                     </Text>
                     </View>
                     <Text 
                     numberOfLines={2}
                     style={{
                     flexShrink: 1,
                     flexWrap: 'wrap',
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels
                     }}
                     >
                     {item.address}
                     </Text>
                  </View>
               </View>
               <View 
               style={{
                  height: 22,
                  width: 22,
                  aspectRatio: '1/1',
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderColor: COLORS.labels,
                  borderRadius: 22,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
               }}>
                  <View style={{
                     height: 16,
                     width: 16,
                     backgroundColor: (false) ? COLORS.accent : 'transparent',
                     borderRadius: 8,
                  }} />
               </View>
               </Pressable>
            </View>
         )}
         ListFooterComponent={
            <Pressable
            style={({pressed}) => [{
               width: '100%',
               height: 40,
               justifyContent: 'center',
               alignItems: 'center',
               backgroundColor: pressed ? COLORS.lightblue : COLORS.secondary,
               borderRadius: 8,
               borderWidth: 1,
               borderStyle: 'dashed',
               borderColor: COLORS.labels,
               flexDirection: 'row',
               gap: 4,
               marginTop: 24
            }]}
            >
               <Icons name='plus' size={24} color={COLORS.labels} />
               <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.sm,
               color: COLORS.labels
               }}>Add New Address</Text>
            </Pressable>
         }
         ListFooterComponentStyle={{
            paddingHorizontal: 24
         }}
         />

         <View style={{
         width: '100%',
         padding: 24
         }}>
         <TouchableHighlight style={global.secondaryBtn}
         underlayColor="#d8d8d8"
         onPress={() => {}}>
            <Text style={global.secondaryBtnText}>Save Address</Text>
         </TouchableHighlight>
         </View>
      </View>
   )
   }

   export default AppointmentAddresses

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
      alignItems: 'center',
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