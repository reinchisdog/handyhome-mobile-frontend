import { 
   Text, 
   View, 
   TouchableOpacity, 
   Animated,
   FlatList,
   useWindowDimensions,
   StatusBar,
   Image,
   Easing
 } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios';
import { API_URL } from '../../../../../config';

import Header from '../../../../../components/dashboard/Header';
import Searchbar from '../../../../../components/dashboard/Searchbar';

import Icons from '@expo/vector-icons/Entypo'
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../styles/constants';
import SubserviceItem from '../../../../../components/SubserviceItem';

const COLLAPSIBLE_HEIGHT = 100;
const HEADER_HEIGHT = StatusBar.currentHeight + 64;
const SEARCH_HEIGHT = 100
const TOTAL_HEIGHT = COLLAPSIBLE_HEIGHT + HEADER_HEIGHT + SEARCH_HEIGHT


const SubServiceScreen = () => {
   /* ----------------------------- Initialization ----------------------------- */
   const { height, width } = useWindowDimensions();
   const { id, name } = useLocalSearchParams();
   const router = useRouter();
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerHeight = scrollY.interpolate({
      inputRange: [0, TOTAL_HEIGHT],
      outputRange: [TOTAL_HEIGHT, TOTAL_HEIGHT - SEARCH_HEIGHT],
      extrapolate: 'clamp',
   });

   const headerOpacity = scrollY.interpolate({
      inputRange: [0, COLLAPSIBLE_HEIGHT],
      outputRange: [1.0, 0.0],
      extrapolate: 'clamp',
   });

   const skeletonOpacity = useRef(new Animated.Value(0.5)).current;

   /* -------------------------------- Functions ------------------------------- */
   const [subServices, setSubServices] = useState([])

   const [isSubLoading, setIsSubLoading] = useState(true);
   useEffect(() => {
      const animLoop = Animated.loop(
         Animated.sequence([
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.2,
               duration: 500,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
            Animated.timing(skeletonOpacity, {
               toValue: 0.5,
               duration: 250,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true
            }),
         ])
      )

      if (isSubLoading) animLoop.start();
      
      return () => animLoop.stop();
   }, [isSubLoading])

   const getSubservices = async () => {
      try {
         setIsSubLoading(true);
         const result = await axios.get(`${API_URL}/general/sub-services/${id}`)

         setSubServices(Array.isArray(result?.data?.data) ? [...result.data.data] : []);
      } catch (e) {

      } finally {
         setTimeout(() => {
            setIsSubLoading(false);
         }, 1000)
      }
   }

   useEffect(() => {
      getSubservices();
   }, [])

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         {/* --------------------------------- Header --------------------------------- */}
         <Header 
         background='transparent'
         left={
         <TouchableOpacity onPress={() => router.back()}>
            <Icons name="chevron-left" size={24} color={COLORS.secondary} />
         </TouchableOpacity>}
         headerPosition='absolute'
         />

         {/* --------------------------- Collapsible Section -------------------------- */}
         <Animated.View
         style={{
            height: headerHeight,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            position: 'absolute',
            zIndex: 1,
            backgroundColor: COLORS.primary,
         }}>
            
            <Animated.View
            style={{
               width: width,
               aspectRatio: '1500/548',
               position: 'relative',
               opacity: headerOpacity,
            }}>
               <View
               style={{
                  position: 'absolute',
                  bottom: 0,
                  padding: 24,
                  paddingBottom: 48,
                  width: width,
                  zIndex: 3
               }}>
                  <Text
                  style={{
                     textAlign: 'left',
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.xxl,
                     color: '#fff'
                  }}>
                     {`${name}\nServices`}
                  </Text>
               </View>
               <Image 
               source={require(`../../../../../assets/images/backgrounds/graphic-bg7.png`)}
               style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 2,
                  objectFit: 'contain'
               }}/>
            </Animated.View>

            <View 
            style={{
               width: '100%',
               height: 100,
               paddingTop: 24,
               paddingHorizontal: 24,
               paddingBottom: 12,
               backgroundColor: COLORS.screenbg,
               zIndex: 1
            }}>
               <Searchbar />
            </View>
         </Animated.View>
         
         

         {/* --------------------------------- Content -------------------------------- */}
         {(isSubLoading) ? (
            <View 
            style={{
               paddingHorizontal: 24,
               paddingBottom: 48,
               paddingTop: TOTAL_HEIGHT,
               gap: 24
            }}>
               <Animated.View 
               style={{
                  width: '100%',
                  height: 150,
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  opacity: skeletonOpacity
               }}/>
               <Animated.View 
               style={{
                  width: '100%',
                  height: 150,
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  opacity: skeletonOpacity
               }}/>
               <Animated.View 
               style={{
                  width: '100%',
                  height: 150,
                  backgroundColor: COLORS.strokes,
                  borderRadius: 8,
                  opacity: skeletonOpacity
               }}/>
   
            </View>
         ) : (
            <FlatList
            data={subServices}
            renderItem={({item}) => <SubserviceItem item={item} serviceName={name} serviceId={id}/> }
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingHorizontal: 24,
               paddingBottom: 48,
               paddingTop: TOTAL_HEIGHT,
               gap: 24
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false }
            )}/>
         )
         }
         

         
      </View>
   )
}

export default SubServiceScreen