/* --------------------------------- IMPORTS -------------------------------- */
import { Text, View , FlatList, Animated, TouchableOpacity, Easing, SafeAreaView } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { useUser } from '../../context/UserContext'
// Components
import OnboardingSlides from '../../components/onboarding/Slides';
import OnboardingItem from '../../components/onboarding/OnboardingItem';
import Paginator from '../../components/onboarding/Paginator';
// Styles and Icons
import Icons from '@expo/vector-icons/AntDesign';
import { globalStyles as global } from '../../styles/globalStyles';
import { launchStyles as launch } from '../../styles/launchStyles';
import { COLORS, FONT_SIZES } from '../../styles/constants';

export default function OnboardingScreen() {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();
  const navigation = useNavigation();
  const { completeOnboarding } = useUser();

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
    <SafeAreaView style={[ global.screenContainer, {paddingBottom: 24}]}>
      {/* ------------------------- Top-Half of Onboarding ------------------------- */}
      <View style={{flex: 1}}>
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
          borderColor: '#07407B',
          borderWidth: 29,
          borderRadius: 266,
          opacity: 0.25,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -133 }, { translateY: -210 }],
          zIndex: -1,
        }}></View>
      </View>
      
      {/* ------------------------ Bottom-Half of Onboarding ----------------------- */}
      <View style={{
        height: 100, 
        paddingHorizontal: 24, 
        justifyContent: 'space-between'
      }}>
        {/* ---------- Paginator */}
        <Paginator slides={OnboardingSlides} scrollX={scrollX}/>

        {/* ---------- Buttons Container */}
        <View style={launch.navBtnContainer}>
          {/* ----- Back Button */}
          <TouchableOpacity 
          style={[ launch.skipBtn, global.centerContainer ]} 
          onPress={handleSkip}>
            <Text style={launch.textBtn}>Skip</Text>
          </TouchableOpacity>

          {/* ----- Next Button */}
          <Animated.View style={[launch.nextBtn, { width: buttonExpand }]}>
            <TouchableOpacity onPress={handleNext}>
            {(currentIndex < OnboardingSlides.length - 1) ?
              <Icons name="right" size={24} color="white" /> 
                :
              <Text 
              style={[launch.textBtn, {color: 'white'}]}
              numberOfLines={1}>
                Get Started
              </Text>
            }
            </TouchableOpacity>
          </Animated.View>
        </View>
        
      </View>
    </SafeAreaView>
  )
}