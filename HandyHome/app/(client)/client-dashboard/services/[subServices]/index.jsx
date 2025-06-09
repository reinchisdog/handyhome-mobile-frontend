import { 
   StyleSheet, 
   Text, 
   View, 
   TouchableOpacity, 
   Animated,
   FlatList,
 } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useEffect, useRef} from 'react'

import Header from '../../../../../components/dashboard/Header';
import Searchbar from '../../../../../components/dashboard/Searchbar';

import Icons from '@expo/vector-icons/AntDesign'
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../styles/constants';
import SubserviceItem from '../../../../../components/services/SubserviceItem';


const SubserviceItems = [
   {
      id: 1,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
   {
      id: 2,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
   {
      id: 3,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
   {
      id: 4,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
   {
      id: 5,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
   {
      id: 6,
      name: "Sub-Service",
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor nulla totam odio! Neque culpa tenetur quis deserunt vel vero delectus explicabo ex, quos, quidem tempora, qui repellendus eligendi earum inventore!',
      price: 2000,
      image: require('../../../../../assets/placeholder-base.png') 
   },
]

const COLLAPSIBLE_HEIGHT = 106;

const SubServiceScreen = () => {
   /* ----------------------------- Initialization ----------------------------- */
   const { id } = useLocalSearchParams();
   const router = useRouter();
   const scrollY = useRef(new Animated.Value(0)).current;

   const headerHeight = scrollY.interpolate({
      inputRange: [0, COLLAPSIBLE_HEIGHT],
      outputRange: [COLLAPSIBLE_HEIGHT, 0],
      extrapolate: 'clamp',
   });

   const headerPadding = scrollY.interpolate({
      inputRange: [0, COLLAPSIBLE_HEIGHT],
      outputRange: [24, 0],
      extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, COLLAPSIBLE_HEIGHT],
      outputRange: [1.0, 0.0],
      extrapolate: 'clamp',
    });

   return (
      <View style={global.screenContainer}>
         
         <View style={{backgroundColor: COLORS.primary}}>
            {/* --------------------------------- Header --------------------------------- */}
            <Header 
               background={'transparent'}
               left={
               <TouchableOpacity
                  onPress={() => router.back()}
               >
                  <Icons name="left" size={24} color={COLORS.secondary} />
               </TouchableOpacity>}
            />

            {/* --------------------------- Collapsible Section -------------------------- */}
            <Animated.View
            style={{
               height: headerHeight,
               width: '100%',
               paddingHorizontal: 24,
               paddingBottom: headerPadding,
               display: 'flex',
               justifyContent: 'flex-end',
               alignItems: 'flex-end'
            }}>
               <Animated.Text
               style={{
                  opacity: headerOpacity,
                  textAlign: 'right',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.xxl,
                  color: COLORS.secondary,
                  textShadowColor: '#00000040',
                  textShadowOffset: {
                     width: 0,
                     height: 2,
                  },
                  textShadow: 0.25,
                  textShadowRadius: 4,

                  elevation: 4
               }}>
                  Service Type{"\n"}Services
               </Animated.Text>
            </Animated.View>
         </View>
         
         {/* ---------------------------- Sticky Searchbar ---------------------------- */}
         <View style={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 12,
            backgroundColor: 'COLORS.secondary'
         }}>
            <Searchbar />
         </View>
         
         {/* --------------------------------- Content -------------------------------- */}
         <FlatList
            data={SubserviceItems}
            renderItem={({item}) => <SubserviceItem item={item} /> }
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingHorizontal: 24,
               paddingBottom: 48,
               gap: 24
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
               { useNativeDriver: false }
            )}
         />

        
      </View>
   )
}

export default SubServiceScreen