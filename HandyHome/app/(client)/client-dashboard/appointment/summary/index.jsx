import { StyleSheet, Text, View, ScrollView, Pressable, ImageBackground, TouchableHighlight } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

import Arrows from '@expo/vector-icons/AntDesign';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const ReviewSummary = () => {
  const router = useRouter();

  return (
    <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
      {/* ------------------------------ Main Content ------------------------------ */}
      <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 8
      }}
      >

        {/* --------------------------------- Address -------------------------------- */}
        <View
        style={styles.summaryBox}
        >
          <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          }]}
          onPress={() => router.push('client-dashboard/appointment/summary/details/addresses')}
          >
            <View style={styles.left}>
              <Icons name="map-marker" size={24} color={COLORS.primary} />
              <View style={{ flexShrink: 1, gap: 2}}>
                <View style={{flexDirection: 'row', gap: 6}}>
                  <Text style={styles.righText}>
                    {"John Doe"}
                  </Text>
                  <Text style={styles.leftText}>
                    {`(${"09123456789"})`}
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
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nihil, vel quisquam eveniet eaque quae adipisci molestias quia ab repudiandae numquam, possimus accusantium quo ipsum in. Explicabo vitae tempora minus?
                </Text>
              </View>
            </View>
            <Arrows name="right" size={24} color={COLORS.accent} />
          </Pressable>
        </View>

        {/* --------------------------- Service Information -------------------------- */}
        <View
        style={[
        styles.summaryBox, {
        backgroundColor: 'white',
        paddingVertical: 24,
        }]}
        >
          <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Service</Text>
            <Text style={styles.righText}>{"Leak Repair"}</Text>
          </View>
          {/* <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Complexity</Text>
            <Text style={styles.righText}>Simple</Text>
          </View> */}
          <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Service Category</Text>
            <Text style={styles.righText}>{"Plumbing"}</Text>
          </View>
          <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Booking Date</Text>
            <Text style={styles.righText}>{"April 28, 2025 | 10:00 AM"}</Text>
          </View>
        </View>

        {/* ---------------------------- Service Voucher ----------------------------- */}
        <View style={styles.summaryBox}>
          <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          }]}
          >
            <Text style={styles.leftText}>Voucher</Text>
            <View style={styles.right}>
              <View style={[global.tagContainer, {backgroundColor: COLORS.lightblue}]}>
                <Text style={[global.tagText, {color: COLORS.lettersicons}]}>{"15% off"}</Text>
              </View>
              <Arrows name="right" size={24} color={COLORS.accent} />
            </View>
            
          </Pressable>
        </View>

        {/* ---------------------------- Service Provider ---------------------------- */}
        <View style={[styles.summaryBox, {gap: 0}]}>
          <Text style={[styles.leftText, {paddingVertical: 12, paddingLeft: 12}]}>Service Provider</Text>
          <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          }]}
          >
            <View style={[styles.left, {}]}>
              <ImageBackground
                source={require('../../../../../assets/placeholder-base.png')}
                style={{
                  aspectRatio: '1/1',
                  height: 82,
                  width: 82,
                  position: 'relative',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}
                imageStyle={{
                  borderRadius: 41
                }}
              >
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 12
                }}>
                  <Icons name="check-decagram" size={24} color={COLORS.primary} />
                </View>
                
              </ImageBackground>
              <View style={{gap: 6, flexShrink: 1}}>
                <Text numberOfLines={1}
                style={{
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary
                }}
                >
                  {"Worker's Name"}
                </Text>
                <Text numberOfLines={1}
                style={{
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels
                }}>
                  {"Affiliations"}
                </Text>
                <Text numberOfLines={1}
                style={{
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons
                }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos quis voluptatibus, ad dolorem, beatae error maxime, eaque vitae libero quas expedita atque nostrum maiores perspiciatis voluptate aut voluptas laboriosam aliquam?
                </Text>
              </View>
            </View>

            <Arrows name="right" size={24} color={COLORS.accent} />
          </Pressable>

          <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          }]}
          >
            <Text style={styles.leftText}>Note</Text>
            <View style={styles.right}>
              <Text numberOfLines={1} style={{
                flexShrink: 1,
                flexWrap: 'wrap',
                fontFamily: FONTS.roboto400,
                fontSize: FONT_SIZES.sm,
                color: COLORS.lettersicons,
                textAlign: 'right',
                width: '80%'
              }}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero fugiat id dolores! Adipisci debitis dignissimos numquam aperiam, quod et esse autem provident eius! Nulla, assumenda culpa reiciendis molestiae corrupti dolorum?
              </Text>
              <Arrows name="right" size={24} color={COLORS.accent} />
            </View>
            
          </Pressable>
        </View>

        {/* ----------------------------- Payment Method ----------------------------- */}
        <View style={styles.summaryBox}>
          <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          }]}
          >
            <View style={styles.left}>
              <Icons name="cash-multiple" size={24} color={COLORS.labels} />
              <Text style={styles.leftText}>Cash</Text>
            </View>
            
            <Text style={styles.righText}>Change Payment Method</Text>
            
          </Pressable>
        </View>

        {/* ------------------------------ Service Fees ------------------------------ */}
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
            <Text style={styles.leftText}>Complexity Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${200}`}</Text>
          </View> */}
          <View style={styles.summaryBoxView}>
            <Text style={styles.leftText}>Transportation Fee</Text>
            <Text style={styles.righText}>{`\u20b1 ${100}`}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
        <Pressable 
          style={({pressed}) => [
            styles.summaryBoxPressable, {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            justifyContent: 'center'
          }]}
          >
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
                View E-Receipt
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
            
          </Pressable>
        </View>

      </ScrollView>

      {/* ------------------------------- Bottom Tab ------------------------------- */}
      <View
      style={{
        padding: 24,
        borderRadius: 24,
        backgroundColor: '#fff',
        gap: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 6,
      }}>
        <View 
        style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <Text style={{
            fontFamily: FONTS.roboto700,
            fontSize: FONT_SIZES.lg,
            color: COLORS.labels
          }}>
            TOTAL
          </Text>
          <Text style={{
            fontFamily: FONTS.roboto700,
            fontSize: FONT_SIZES.xl,
            color: COLORS.primary
          }}>
            {`\u20b1 ${675}`}
          </Text>
          
        </View>
        <TouchableHighlight style={global.primaryBtn}
          underlayColor='#0072bc'
          onPress={() => router.replace()}>
            <Text style={global.primaryBtnText}>Confirm Booking</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default ReviewSummary

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