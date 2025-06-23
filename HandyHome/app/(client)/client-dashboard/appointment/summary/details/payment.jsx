import { StyleSheet, Text, View, ScrollView, Pressable, TouchableHighlight } from 'react-native'
import React from 'react'

import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomIcons from '../../../../../../assets/customIcons';

import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../../styles/constants';

const AppointmentPayment = () => {
  return (
    <View style={global.screenContainer}>
      <ScrollView
      style={[global.screenContainer, {backgroundColor: '#fff', }]}
      contentContainerStyle={{
        padding: 24,
        gap: 24,
        position:'relative'
      }}
      >
        {/* ---------------------------------- Cash ---------------------------------- */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Cash</Text>
          <Pressable 
          style={({pressed}) => [
            styles.paymentBox, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'
          }]}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center'
            }}>
              <Icons name='cash-multiple' size={24} color={COLORS.primary}/>
              <Text style={styles.paymentName}>Cash</Text>
            </View>

            <View 
              style={{
              height: 22,
              width: 22,
              aspectRatio: '1/1',
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: '#3A454D',
              borderRadius: 22,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 16,
                width: 16,
                // backgroundColor: (value !== item.val) ? "#f8f8f8" : "#58B7F3",
                borderRadius: 8,
              }}></View>
            </View>

          </Pressable>
        </View>

        {/* ----------------------------- Other Payments ----------------------------- */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>More Payment Options</Text>
          <Pressable 
          style={({pressed}) => [
            styles.paymentBox, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'
          }]}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center'
            }}>
              <CustomIcons name='gcash' size={24} color={COLORS.primary}/>
              <Text style={styles.paymentName}>GCash</Text>
            </View>

            <View 
              style={{
              height: 22,
              width: 22,
              aspectRatio: '1/1',
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: '#3A454D',
              borderRadius: 22,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 16,
                width: 16,
                // backgroundColor: (value !== item.val) ? "#f8f8f8" : "#58B7F3",
                borderRadius: 8,
              }}></View>
            </View>

          </Pressable>
        </View>
      </ScrollView>
      {/* --------------------------------- Buttons -------------------------------- */}
      <View style={[global.buttonsContainer, {backgroundColor: '#fff'}]}>
        <TouchableHighlight style={global.primaryBtn}
          underlayColor='#0072bc'
          onPress={() => {}}>
            <Text style={global.primaryBtnText}>Confirm Payment</Text>
        </TouchableHighlight>
      </View>
    </View>
    
  )
}

export default AppointmentPayment

const styles = StyleSheet.create({
  paymentSection: {
    gap: 16
  },
  paymentTitle: {
    fontFamily: FONTS.roboto700,
    fontSize: FONT_SIZES.lg,
    color: COLORS.lettersicons
  },
  paymentBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.strokes,
    borderWidth: 1,
    borderRadius: 8
  },
  paymentName: {
    fontFamily: FONTS.roboto500,
    fontSize: FONT_SIZES.md,
    color: COLORS.lettersicons
  }
})