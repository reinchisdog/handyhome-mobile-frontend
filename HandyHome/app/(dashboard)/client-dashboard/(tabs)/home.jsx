/* --------------------------------- Imports -------------------------------- */
import { ScrollView, Text, View, TouchableOpacity, TouchableHighlight, FlatList, useWindowDimensions, Animated, Image, Easing } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from 'expo-router'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext';
import { useAppData } from '../../../../context/AppDataContext';
/* ------------------------------- Components ------------------------------- */
import Header from '../../../../components/dashboard/Header';
import TextLogo from '../../../../components/LogoText';

import PromoSlides from '../../../../components/dashboard/home/PromoSlides';
import PromoItem from '../../../../components/dashboard/home/PromoItem';
import Paginator from '../../../../components/dashboard/home/Paginator';

import ServiceItem from '../../../../components/ServiceItem';

import PopularItem from '../../../../components/dashboard/home/PopularItem';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const HomeScreen = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const {width, height} = useWindowDimensions();
  const { user } = useAuth();
  const { services } = useAppData();
  const isVerified = useState(true);     //CHANGE LATER
  const [showVerify, setShowVerify] = useState(false)
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (!isVerified) {
        verifyX.setValue(0);
        setShowVerify(true);
      }
    }, [])
  )

  /* ------------------------------- Animations ------------------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 25}).current;

  /* -------------------------------- Functions ------------------------------- */
  // ---- Promo Traversal
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < PromoSlides.length - 1) {
        slidesRef.current.scrollToIndex({index: currentIndex + 1})
      } else {
        slidesRef.current.scrollToIndex({index: 0})
      }
    }, 5000);
  
    return () => clearTimeout(timer); 
  }, [currentIndex]);
  
  const verifyX = useRef(new Animated.Value(0)).current;

  const closeVerify = () => {
    Animated.timing(verifyX, {
      toValue: -width,
      duration: 600,
      easing: Easing.bezier(0.76, 0, 0.24, 1),
      useNativeDriver: true
    }).start(() => {
      setShowVerify(false)
    })
  }

  return (
    <ScrollView 
    // showsHorizontalScrollIndicator={true}
    showsVerticalScrollIndicator={true}
    style={[global.screenContainer]}
    contentContainerStyle={{ backgroundColor: COLORS.screenbg }}
    stickyHeaderIndices={[0]}
    >
      <Header 
      title={<TextLogo size={24}/>}
      titlePosition='absolute'
      right={
        <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {}}>
          <Icons name="bell" size={24} color={COLORS.primary}/>
        </TouchableOpacity>
      }/>

      <View 
      style={[{
        width: '100%',
      }]}>
        {/* ------------------------------ Main Content ------------------------------ */}
        <View 
        style={[{
          paddingVertical: 24,
          flex: 1,
          gap: 24,
          zIndex: 1,
        }]}>

          {/* ---- User Greeting */}
          <View 
          style={[{
            paddingHorizontal: 24,
            flexDirection: 'row',
            height: 42,
            width: '100%',
            alignItems: 'center'
          }]}>
            <Text 
            style={[global.headingText, {
              color: COLORS.lettersicons
            }]}>
              Hello, <Text style={[global.headingText, {color: COLORS.primary}]}>{`${user.full_name} !`}</Text>
            </Text>
          </View>
          
          {/* ---- Promotional Slides */}
          <View
          style={[{
            width: width,
            gap: 8
          }]}>
            <FlatList 
              data={PromoSlides}
              renderItem={({item}) => <PromoItem item={item}/>}
              horizontal
              showsHorizontalScrollIndicator = {false}
              pagingEnabled
              bounces = {false}
              keyExtractor={(item) => item.id}
              onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver: false,
              })}
              scrollEventThrottle={32}
              onViewableItemsChanged={viewableItemsChanged}
              viewabilityConfig={viewConfig}
              ref={slidesRef}
            />
            <Paginator slides={PromoSlides} scrollX={scrollX} currentIndex={currentIndex}/>
          </View>
          
          {/* ---- Verification Alert */}
          {!isVerified && showVerify && (
            <Animated.View
            style={[{
              gap: 16,
              marginHorizontal: 24,
              marginTop: 16,
              paddingHorizontal: 24,
              paddingVertical: 16,
              backgroundColor: '#fff',
              borderRadius: 20,

              transform: [{translateX: verifyX}]
            }]}>  
              <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                <Icons name='shield-check' size={24} color={COLORS.primary}/>
                <Text
                style={global.headingText}>
                  <Text style={{color: COLORS.primary}}>Get Verified </Text>
                  <Text style={{color: COLORS.lettersicons}}>to Book Services</Text>
                </Text>
              </View>

              <Text
              style={{
                fontFamily: FONTS.roboto400,
                fontSize: FONT_SIZES.sm,
                color: COLORS.lettersicons
              }}
              >
                Verify your account to fully access booking features and ensure secure transactions.
              </Text>

              <View 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
              }}>
                <TouchableOpacity 
                style={{
                  height: 32,
                  width: 100,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                underlayColor='#0072bc'
                onPress={closeVerify}>
                  <Text style={{
                    fontFamily: FONTS.roboto700,
                    fontSize: FONT_SIZES.md,
                    color: COLORS.lettersicons
                  }}>Maybe Later</Text>
                </TouchableOpacity>

                <TouchableHighlight 
                style={{
                  backgroundColor: COLORS.primary,
                  height: 32,
                  width: 100,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                underlayColor='#0072bc'
                onPress={() => {router.push('client-dashboard/verify-client')}}>
                  <Text style={{
                    fontFamily: FONTS.roboto700,
                    fontSize: FONT_SIZES.md,
                    color: COLORS.secondary
                  }}>Verify Now</Text>
                </TouchableHighlight>
              </View>
            </Animated.View>     
          )}

          {/* ---- Services */}
          <View style={[{
            width: width,
            gap: 8
          }]}>
            <View style={{paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={[global.headingText, {color: COLORS.primary}]}>Services</Text>
              <TouchableOpacity onPress={() => router.push('/client-dashboard/services')}
                activeOpacity={0.5}>
                  <Text style={global.subheadingText}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList 
              data={services}
              renderItem={({item}) => (
                <ServiceItem 
                item={item} 
                onPress={() => {router.push({
                  pathname: `client-dashboard/services/[subServices]`,
                  params: {id: item.id, name: item.name}
                })}}/>
              )}
              horizontal
              showsHorizontalScrollIndicator = {false}
              contentContainerStyle={{
                 paddingHorizontal: 20, 
                 gap: 16
              }}
            />
          </View>

          {/* ---- Popular Services Near You */}
          {/* <View style={[{
            width: width,
            gap: 8
          }]}>
            <View style={{paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={[global.headingText, {color: COLORS.primary}]}>Popular Services Near You</Text>
              <TouchableOpacity onPress={() => {}}
                activeOpacity={0.5}>
                  <Text style={global.subheadingText}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList 
              data={ServiceList}
              renderItem={({item}) => <PopularItem item={item} />}
              horizontal
              showsHorizontalScrollIndicator = {false}
              contentContainerStyle={{
                 paddingHorizontal: 24, 
                 paddingBottom: 10,
                 gap: 20
              }}
            />
          </View> */}
        </View>
        {/* Background */}
        <Image 
          source={require('../../../../assets/images/backgrounds/graphic-bg1.png')}
           style={{
            width: '100%',
            height: 224,
            backgroundColor: COLORS.lightblue,
            overflow: 'hidden',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            paddingHorizontal: 24,
            position: 'absolute',
            zIndex: 0,
            elevation: 0,
            objectFit: 'cover',
            
         }} />
      </View>
    </ScrollView>
  )
}

export default HomeScreen