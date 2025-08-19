import { 
   StyleSheet, 
   Text, View, 
   ImageBackground, 
   useWindowDimensions, 
   TouchableOpacity, 
   Animated, 
   StatusBar,
   ScrollView
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation, useRouter } from 'expo-router';

import ReviewWorkAbout from './about';
import ReviewWorkServices from './services';
import ReviewWorkReviews from './reviews';

const Tabs = createMaterialTopTabNavigator();

import Icons from '@expo/vector-icons/MaterialIcons';
import Arrows from '@expo/vector-icons/AntDesign';
import { globalStyles as global } from '../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../styles/constants';

import Header from '../../../components/dashboard/Header'

const HEADER_HEIGHT = 314;
const LAYOUT_HEADER_HEIGHT = 64;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;


export default function ReviewWorkerLayout() {
   const {width, height} = useWindowDimensions();
   const [HeaderHeight, setHeaderHeight] = useState(0);

   // useEffect(() => {
   //    console.log(HeaderHeight)
   // }, [HeaderHeight])

   const scrollY = useRef(new Animated.Value(0)).current;

   const headerY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp'
   });

   const tabY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [HEADER_HEIGHT, 0],
      extrapolate: 'clamp'
   })

   const router = useRouter();

   return (
      <>
         <Header 
         left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
         title = {
            <Text style={[global.headingText, {color: COLORS.primary}]}>Service Provider</Text>
         }
         titleAlign = 'center'
         titlePosition = 'absolute'
         />
         <View style={[global.screenContainer, {position: 'relative', overflow: 'hidden', backgroundColor: '#fff'}]}>
            

            {/* --------------------------- Content Tabs Render -------------------------- */}
            <WorkerTabView 
               onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
               )}
               tabY={tabY}
            />

            {/* ------------------------------ Header Render ----------------------------- */}
            <Animated.View
            onLayout={({nativeEvent}) => {
               setHeaderHeight(nativeEvent.layout.height);
            }}
            style={{
               backgroundColor: '#fff',
               position: 'absolute',
               width: '100%',
               transform: [{translateY: headerY}],
               zIndex: 1,
            }}
            >
               {/* ------------------------------ Basic Profile ----------------------------- */}
               <ImageBackground
               // source={require('../../../../../../../assets/placeholder-base.png')}
               style={{
                  width: width,
                  height: 160,
                  backgroundColor: COLORS.lightblue,
                  overflow: 'hidden',
                  borderBottomEndRadius: 42,
                  borderBottomStartRadius: 42,
                  backgroundColor: COLORS.lightblue,
                  paddingHorizontal: 24,
                  paddingTop: 8
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
               </ImageBackground>
               
               {/* ----------------------------- Worker Summary ----------------------------- */}
               <View 
               style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 24,
               }}>
                  {/* ---- Customers */}
                  <View style={styles.summaryItem}>
                     <View style={styles.summaryIcon}>
                        <Icons name="people" size={30} color={COLORS.primary}/>
                     </View>
                     <Text style={styles.summaryCount}>{150}</Text>
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
                     <Text style={styles.summaryCount}>{4.9}</Text>
                     <Text style={styles.summaryTitle}>Rating</Text>
                  </View>

                  {/* ---- Review */}
                  <View style={styles.summaryItem}>
                     <View style={styles.summaryIcon}>
                        <Icons name="rate-review" size={30} color={COLORS.primary}/>
                     </View>
                     <Text style={styles.summaryCount}>{98}</Text>
                     <Text style={styles.summaryTitle}>Reviews</Text>
                  </View>
               </View>
            </Animated.View>
         
         </View>
      </>
   )
}


const WorkerTabView = ({onScroll, tabY}) => {
   const {width, height} = useWindowDimensions();
   const [index, setIndex] = useState(0);

   const routes = [
      { key: 'about', title: 'About' },
      { key: 'services', title: 'Services' },
      { key: 'reviews', title: 'Reviews' },
   ]

   const flatlistRef = useRef(null);
   const scrollviewRef = useRef(null);

   const handleResetScroll = () => {
      flatlistRef.current?.scrollToOffset({ offset: 0, animated: true });
      scrollviewRef.current?.scrollTo({ y: 0, animated: true });
   }

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
               paddingTop={HEADER_HEIGHT+36} 
               minHeight={height-STATUSBAR_HEIGHT-LAYOUT_HEADER_HEIGHT-36}
               listRef={scrollviewRef}
               />
            );
            
         case 'services':
            return (
               <ReviewWorkServices 
               onScroll={onScroll} 
               paddingTop={HEADER_HEIGHT+36} 
               minHeight={height-STATUSBAR_HEIGHT-LAYOUT_HEADER_HEIGHT-36}
               listRef={flatlistRef}
               />
            );
         case 'reviews':
            return (
               <ReviewWorkReviews 
               onScroll={onScroll} 
               paddingTop={HEADER_HEIGHT+36} 
               minHeight={height-STATUSBAR_HEIGHT-LAYOUT_HEADER_HEIGHT-36}
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