import { 
   StyleSheet, 
   Text, View, 
   ImageBackground, 
   useWindowDimensions, 
   TouchableOpacity, 
   Animated, 
   StatusBar,
   ScrollView,
   Pressable
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation, useRouter } from 'expo-router';
import { useAppData } from '../../../../../context/AppDataContext';
import { useAuth } from '../../../../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ReviewWorkAbout from './about';
import ReviewWorkServices from './services';
import ReviewWorkReviews from './reviews';

import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

import Header from '../../../../../components/dashboard/Header'

const HEADER_HEIGHT = StatusBar.currentHeight + 64;
const WORKER_PROFILE_HEIGHT = 140;
const WORKER_INFO_HEIGHT = 154;
const TOTAL_HEIGHT = HEADER_HEIGHT + WORKER_PROFILE_HEIGHT + WORKER_INFO_HEIGHT

export default function ProfileWorkerLayout() {
   const insets = useSafeAreaInsets();
   const { worker, fetchWorkerData, profile } = useAppData();
   const {width, height} = useWindowDimensions();

   const scrollY = useRef(new Animated.Value(0)).current;

   const flatlistRef = useRef(null);
   const scrollviewRef = useRef(null);

   const handleResetScroll = () => {
      flatlistRef.current?.scrollToOffset({ offset: 0, animated: true });
      scrollviewRef.current?.scrollTo({ y: 0, animated: true });
   }

   const headerY = scrollY.interpolate({
      inputRange: [0, TOTAL_HEIGHT - HEADER_HEIGHT],
      outputRange: [0, -TOTAL_HEIGHT + HEADER_HEIGHT],
      extrapolate: 'clamp'
   });

   const tabY = scrollY.interpolate({
      inputRange: [0, TOTAL_HEIGHT],
      outputRange: [TOTAL_HEIGHT, 0],
      extrapolate: 'clamp'
   })

   const modalPos = scrollY.interpolate({
      inputRange: [0, WORKER_INFO_HEIGHT],
      outputRange: [height, height - 48 - insets.bottom],
      extrapolate: 'clamp'
   })

   const router = useRouter();

   return (
      <View style={[global.screenContainer, {position: 'relative', backgroundColor: '#fff'}]}>
         <Header 
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"chevron-left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
         title = {
            <Text style={[global.headingText, {color: COLORS.primary}]}>Service Provider</Text>
         }
         titleAlign = 'center'
         titlePosition = 'absolute'
         headerPosition='absolute'
         />
         
         <Animated.View
         style={{
            backgroundColor: '#fff',
            position: 'absolute',
            top: HEADER_HEIGHT,
            width: '100%',
            zIndex: 2,
            transform: [{translateY: headerY}]
         }}
         >
            {/* ------------------------------ Basic Profile ----------------------------- */}
            <ImageBackground
            source={require('../../../../../assets/images/backgrounds/graphic-bg4.png')}
            style={{
               width: width,
               height: WORKER_PROFILE_HEIGHT,
               backgroundColor: COLORS.lightblue,
               borderBottomLeftRadius: 42,
               borderBottomRightRadius: 42,
               backgroundColor: COLORS.lightblue,
               paddingHorizontal: 24,
               paddingTop: 8,
               overflow: 'hidden'
            }}
            imageStyle={{
               objectFit: 'cover',
               resizeMode: 'cover'
            }}
            >
               <View
               style={{
                  width: '100%',
                  flexDirection: 'row',
                  gap: 8,
                  justifyContent: 'flex-start',
                  alignItems: 'center'
               }}>
                  <ImageBackground
                  src={profile?.profile_photo_url}
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
                     <Icons name="verified" size={24} color={COLORS.primary} />
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
                     }}>
                        {worker?.user?.name}
                     </Text>

                     {/* <Text numberOfLines={1}
                     style={{
                        flexShrink: 1,
                        flexWrap: 'wrap',
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels
                     }}>
                        {worker?.user?.id}
                     </Text> */}
                     <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                     }}>
                        <Icons name='phone' size={16} color={COLORS.lettersicons}/>
                        <Text numberOfLines={1}
                        style={{
                           flexShrink: 1,
                           flexWrap: 'wrap',
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.lettersicons
                        }}>
                           {worker?.user?.phone_number}
                        </Text>
                     </View>
                     
                  </View>
               </View>
            </ImageBackground>
            
            {/* ----------------------------- Worker Summary ----------------------------- */}
            <View 
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               height: WORKER_INFO_HEIGHT,
               paddingHorizontal: 24
            }}>
               {/* ---- Customers */}
               <View style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                     <Icons name="people" size={30} color={COLORS.primary}/>
                  </View>
                  <Text style={styles.summaryCount}>{worker?.worker?.customer_count}</Text>
                  <Text style={styles.summaryTitle}>Customers</Text>
               </View>

               {/* ---- Experience */}
               <View style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                     <Icons name="work" size={30} color={COLORS.primary}/>
                  </View>
                  <Text style={styles.summaryCount}>{5}</Text>
                  <Text style={styles.summaryTitle}>Years Exp.</Text>
               </View>

               {/* ---- Rating */}
               <View style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                     <Icons name="star-rate" size={30} color={COLORS.primary}/>
                  </View>
                  <Text style={styles.summaryCount}>{worker?.worker?.rating}</Text>
                  <Text style={styles.summaryTitle}>Rating</Text>
               </View>

               {/* ---- Review */}
               <View style={styles.summaryItem}>
                  <View style={styles.summaryIcon}>
                     <Icons name="rate-review" size={30} color={COLORS.primary}/>
                  </View>
                  <Text style={styles.summaryCount}>{worker?.worker?.total_reviews}</Text>
                  <Text style={styles.summaryTitle}>Reviews</Text>
               </View>
            </View>
         </Animated.View>

         {/* --------------------------- Content Tabs Render -------------------------- */}
         {/* <WorkerTabView 
         onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
         )}
         tabY={tabY}
         flatlistRef={flatlistRef}
         scrollviewRef={scrollviewRef}
         handleResetScroll={handleResetScroll}
         /> */}

         {/* ------------------------------ Modal Thingy ----------------------------- */}
         <Animated.View
         style={{
            position: 'absolute',
            right: 24,
            transform: [{translateY: modalPos}]
         }}>
            <Pressable
            onPress={handleResetScroll}
            style={({pressed}) => [{
               padding: 12,
               borderRadius: 24,
               backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary,
               flexShrink: 1,
            }]}>
               <Text style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.md,
                  color: '#fff'
               }}>Go Back to Top</Text>
            </Pressable>
         </Animated.View>
      </View>
   )
}


const WorkerTabView = ({onScroll, tabY, flatlistRef, scrollviewRef, handleResetScroll}) => {
   const {width, height} = useWindowDimensions();
   const [index, setIndex] = useState(0);

   const routes = [
      { key: 'about', title: 'About' },
      { key: 'services', title: 'Services' },
      { key: 'reviews', title: 'Reviews' },
   ]

   return (
      <TabView 
      lazy
      navigationState={{ index, routes }}
      renderScene={({route}) => {
         switch (route.key) {
         case 'about':
            return (
               <ReviewWorkAbout 
               onScroll={onScroll} 
               paddingTop={TOTAL_HEIGHT+36} 
               minHeight={height-HEADER_HEIGHT}
               listRef={scrollviewRef}
               />
            );
            
         case 'services':
            return (
               <ReviewWorkServices 
               onScroll={onScroll} 
               paddingTop={TOTAL_HEIGHT+36} 
               minHeight={height-HEADER_HEIGHT}
               listRef={flatlistRef}
               />
            );
         case 'reviews':
            return (
               <ReviewWorkReviews 
               onScroll={onScroll} 
               paddingTop={TOTAL_HEIGHT+36} 
               minHeight={height-HEADER_HEIGHT}
               listRef={flatlistRef}
               />
            );
         default:
            return null;
         }
      }}
      onIndexChange={setIndex}
      initialLayout={{width: width}}
      renderTabBar={props => (
         <Animated.View
         style={{
            transform: [{ translateY: tabY }],
            zIndex: 999,
            position: 'absolute',
         }}
         >
            <TabBar
            onTabPress={handleResetScroll}
            {...props}
            activeColor={COLORS.primary}
            inactiveColor={COLORS.labels}
            indicatorStyle={{
               backgroundColor: COLORS.primary,
               height: 2,
            }}
            style={{
               backgroundColor: '#fff',
               height: 36,
               elevation: 0,
               borderBottomColor: COLORS.strokes,
               borderBottomWidth: 1,
            }}
            contentContainerStyle={{
               justifyContent: 'flex-start',
               alignItems: 'center',
            }}
            labelStyle={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.sm,
            }}
            pressColor={COLORS.lightblue}
            /> 
         </Animated.View>
          
      )}
      />
   );
}

const styles = StyleSheet.create({
   summaryItem: {
      alignItems: 'center'
   },
   summaryIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      aspectRatio: '1/1',
      backgroundColor: COLORS.secondary,
      borderRadius: 30,
      marginBottom: 10
   },
   summaryCount: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      marginBottom: 4
   },
   summaryTitle: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.xs,
      color: COLORS.labels
   },
})