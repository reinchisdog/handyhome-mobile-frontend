/* --------------------------------- IMPORTS -------------------------------- */
import { Text, View , FlatList, Animated, TouchableOpacity, Easing, SafeAreaView, useWindowDimensions, ImageBackground, Pressable } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '../../context/AuthContext'
// Components
import OnboardingSlides from '../../components/onboarding/Slides';
import OnboardingItem from '../../components/onboarding/OnboardingItem';
import Paginator from '../../components/onboarding/Paginator';
// Styles and Icons
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../styles/globalStyles';
import { launchStyles as launch } from '../../styles/launchStyles';
import { COLORS, FONT_SIZES } from '../../styles/constants';

export default function OnboardingScreen() {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();
  const { width } = useWindowDimensions()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  /* ------------------------------- Animations ------------------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const buttonExpand = useRef(new Animated.Value(40)).current;
  useEffect(() => {
    Animated.timing(buttonExpand, {
      toValue: currentIndex >= OnboardingSlides.length - 1 ? 92 : 40,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 25}).current;

  /* -------------------------------- Functions ------------------------------- */
  const goToAuth = () => {
    completeOnboarding();
    router.replace('/authentication');
  }

  const handleSkip = () => {
    goToAuth()
  }

  const handleNext = () => {
    if (currentIndex < OnboardingSlides.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      goToAuth()
    }
  }

  return (
    <SafeAreaView style={[ global.screenContainer, {position: 'relative', maxWidth: width, backgroundColor: '#fff'}]}>
      {/* ------------------------- Top-Half of Onboarding ------------------------- */}
      <View style={{flex: 1, transform: [{translateY: 40}]}}>
        <FlatList 
          data={OnboardingSlides}
          renderItem={({item}) => <OnboardingItem item={item}/>}
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
        <View style={{
          width: 266,
          aspectRatio: 1/1,
          borderColor: COLORS.primary,
          borderWidth: 29,
          borderRadius: 266,
          opacity: 0.25,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -133 }, { translateY: -210 }],
          zIndex: -1,
        }} />
      </View>
      
      {/* ------------------------ Bottom-Half of Onboarding ----------------------- */}
      <Paginator slides={OnboardingSlides} scrollX={scrollX}/>

      <ImageBackground 
      source={require('../../assets/images/backgrounds/graphic-bg6.png')}
      style={{
        aspectRatio: '375/128',
        width: width,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 24
      }}>
        <View style={launch.navBtnContainer}>
          {/* ----- Back Button */}
          <TouchableOpacity 
          style={[ launch.skipBtn, global.centerContainer ]} 
          onPress={handleSkip}>
            <Text style={launch.textBtn}>Skip</Text>
          </TouchableOpacity>

          {/* ----- Next Button */}
          <Pressable 
          style={({pressed}) => [
            launch.nextBtn, {
            backgroundColor: pressed ? COLORS.primaryPress : COLORS.primary
          }]}
          onPress={handleNext}>
            <Arrows name="chevron-right" size={24} color="white" /> 
          </Pressable>

        </View>
        
      </ImageBackground>

      {/* <View style={{
        // backgroundColor: 'green',
        position: 'absolute',
        bottom: 0,
        zIndex: 0,
        aspectRatio: '375/128',
        width: width,
        justifyContent: 'flex-end'
      }}>
        <Image 
        source={require('../../assets/images/backgrounds/graphic-bg6.png')}
        style={{
          width: '100%',
          height: '100%'
        }}
        />
      </View> */}
      
    </SafeAreaView>
  )
}