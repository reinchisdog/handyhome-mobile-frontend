// Screen: E-Receipt

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
// ---- Other Components
import Header from '../../../../../../components/Header'
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
// ---- Other Libs
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';

const BookingReceipt = () => {
   // Hooks and States
   const { details } = useBookingDetails();

   // Renders
   const renderDate = (date, time) => {

   }

   return (
      <ScrollView
      style={[
         global.screenContainer, {
         backgroundColor: COLORS.primary
      }]}
      contentContainerStyle={{flex: 1}}
      stickyHeaderIndices={[0]}
      >
         <Header 
         hasBack
         title="E-Receipt"
         backgroundColor='#fff'
         />

         <View 
         style={{ 
            padding: 12, 
            paddingBottom: 0, 
            // backgroundColor: 'green',
            height: '100%'
         }}>
            <View 
            style={{
               padding: 24,
               borderRadius: 12,
               backgroundColor: '#fff',
               flex: 1, 
               gap: 24
            }}>
               {/* User Information*/}
               <View style={styles.box}>
                  {/* ---- Name */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Name
                     </Text>
                     <Text style={styles.right}>
                        {details?.user?.name}
                     </Text>
                  </View>
                  {/* ---- Phone */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Phone Number
                     </Text>
                     <Text style={styles.right}>
                        {details?.user?.phone_number.replace('+63', '0')}
                     </Text>
                  </View>
                  {/* ---- Address */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Address
                     </Text>
                     <Text style={styles.right}>
                        {details?.user?.full_address}
                     </Text>
                  </View>
               </View>

               <View style={global.divider}/>

               {/* Service Information */}
               <View style={styles.box}>
                  {/* ---- Name */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Service Name
                     </Text>
                     <Text style={styles.right}>
                        {`${details?.serviceCategory}: ${details?.serviceName}`}
                     </Text>
                  </View>
                  {/* ---- Worker */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Service Provider
                     </Text>
                     <Text style={styles.right}>
                        {details?.worker?.name}
                     </Text>
                  </View>
                  {/* ---- Date */}
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Booking Date
                     </Text>
                     <Text style={styles.right}>
                        {renderDate(
                           details?.date,
                           details?.time
                        )}
                     </Text>
                  </View>
               </View>

               <View style={global.divider}/>
               
               {/* Price */}
               <View style={styles.box}>
                  <View style={styles.row}>
                     <Text style={styles.left}>
                        Total Fee
                     </Text>
                     <Text style={styles.right}>
                        {`\u20B1 ${details?.price}`}
                     </Text>
                  </View>
               </View>

               <View style={global.divider}/>
               
               <TouchableOpacity>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.primary,
                     borderBottomWidth: 2,
                     borderBottomColor: COLORS.primary,
                     textAlign: 'center',
                     marginHorizontal: 'auto'
                  }}>
                     Download E-Receipt
                  </Text>
               </TouchableOpacity>

            </View>
         </View>
      </ScrollView>
   )
}

export default BookingReceipt

const styles = StyleSheet.create({
   box: {
      gap: 12
   }, 
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 6
   },
   left: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels,
      textAlign: 'left'
   },
   right: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'right',
      flexShrink: 1
   }
})