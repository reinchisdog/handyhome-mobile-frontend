// Components: Promotion Slides

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
// ---- Other Components
import PromoItem from './PromoItem';
import Paginator from './Paginator';

const PromoSlide = () => {
   // Constants
   const defaultSlides = [
      {
         id: 1,
         image: require('../assets/images/backgrounds/promo-1.png'),
      },
      {
         id: 2,
         image: require('../assets/images/backgrounds/promo-2.png'),
      },
      {
         id: 3,
         image: require('../assets/images/backgrounds/promo-3.png'),
      },
   ]

   // States and Hooks
   const [currentIndex, setCurrentIndex] = useState(0);

   // Refs for Animation
   const scrollX = useRef(new Animated.Value(0)).current;
   const slidesRef = useRef(null);

   const viewableItemsChanged = useRef(({viewableItems}) => {
       setCurrentIndex(viewableItems[0].index);
     }).current;
   const viewConfig = useRef({viewAreaCoveragePercentThreshold: 25}).current;

   // Functions
   useEffect(() => {
      const timer = setTimeout(() => {
      if (currentIndex < defaultSlides.length - 1) {
         slidesRef.current.scrollToIndex({index: currentIndex + 1})
      } else {
         slidesRef.current.scrollToIndex({index: 0})
      }
      }, 5000);
   
      return () => clearTimeout(timer); 
   }, [currentIndex]);

   return (
      <View
      style={[{
      width: '100%',
      gap: 8
      }]}>
         <FlatList 
         data={defaultSlides}
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
         <Paginator slides={defaultSlides} scrollX={scrollX} currentIndex={currentIndex}/>
      </View>
   )
}

export default PromoSlide

const styles = StyleSheet.create({})