/* --------------------------------- Imports -------------------------------- */
import { ScrollView, Text, View, TouchableOpacity, FlatList, useWindowDimensions, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '../../../../../context/UserContext'
/* ------------------------------- Components ------------------------------- */
import Header from '../../../../../components/dashboard/Header';
import TextLogo from '../../../../../components/logos/TextLogo';

import PromoSlides from '../../../../../components/dashboard/home/PromoSlides';
import PromoItem from '../../../../../components/dashboard/home/PromoItem';
import Paginator from '../../../../../components/dashboard/home/Paginator';

import ServiceList from '../../../../../components/dashboard/home/ServiceList';
import ServiceItem from '../../../../../components/dashboard/home/ServiceItem';

import PopularItem from '../../../../../components/dashboard/home/PopularItem';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS } from '../../../../../styles/constants';

const HomeScreen = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const {width, height} = useWindowDimensions();
  const [userName, setUsername] = useState('John Doe');
  const router = useRouter();

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
  
  return (
    <ScrollView 
    style={[global.screenContainer]}
    contentContainerStyle={{ minHeight: height, backgroundColor: COLORS.secondary }}
    stickyHeaderIndices={[0]}
    >
      <Header 
      title={<TextLogo width={140}/>}
      titlePosition='absolute'
      right={
        <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {}}>
          <Icons name="bell" size={24} color={COLORS.primary}/>
        </TouchableOpacity>
      }
      />

      <View 
      style={[{
        backgroundColor: COLORS.secondary,
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
              Hello, <Text style={[global.headingText, {color: COLORS.primary}]}>{`${userName} !`}</Text>
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
          
          {/* ---- Services */}
          <View style={[{
            width: width,
            gap: 8
          }]}>
            <View style={{padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={[global.headingText, {color: COLORS.primary}]}>Services</Text>
              <TouchableOpacity onPress={() => router.push('/client-dashboard/services')}
                activeOpacity={0.5}>
                  <Text style={global.subheadingText}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList 
              data={ServiceList}
              renderItem={({item}) => <ServiceItem item={item}/>}
              horizontal
              showsHorizontalScrollIndicator = {false}
              contentContainerStyle={{
                 paddingHorizontal: 24, 
                 gap: 8
              }}
            />
          </View>

          {/* ---- Popular Services Near You */}
          <View style={[{
            width: width,
            gap: 8
          }]}>
            <View style={{padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
          </View>
        </View>
        {/* Background */}
        <View 
         style={{
            width: '100%',
            height: 224,
            backgroundColor: COLORS.lightblue,
            overflow: 'hidden',
            borderBottomEndRadius: 42,
            borderBottomStartRadius: 42,
            paddingHorizontal: 24,
            position: 'absolute',
            zIndex: 0,
            elevation: 0,
         }}>
         </View>
      </View>
    </ScrollView>
  )
}

export default HomeScreen