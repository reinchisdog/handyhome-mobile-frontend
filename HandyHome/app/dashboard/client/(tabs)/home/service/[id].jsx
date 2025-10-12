// Screen: Service Category Screen

// Imports
// ---- React and Expo Components
import { Text, View, TouchableOpacity, Animated, FlatList, useWindowDimensions, StatusBar, Image, Easing, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from '../../../../../../context/AuthContext';
// ---- Other Components
import Header from '../../../../../../components/Header';
import Searchbar from '../../../../../../components/Searchbar';
import ServiceCategoryItem from '../../../../../../components/ServiceCategoryItem';
import { ServiceMainImages } from '../../../../../../components/ServiceMainMap';
import ErrorModal from '../../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONT_SIZES, FONTS } from '../../../../../../styles/constants';
// ---- Libraries
import api from '../../../../../../lib/api'

const HEADER_MAX_HEIGHT = 310;
//                        Statusbar + Header + Search Bar - Padding
const HEADER_MIN_HEIGHT = StatusBar.currentHeight + 64 + 96 - 24;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const ServiceCategoryScreen = () => {
   // Hooks and States
   const router = useRouter();
   const {user} = useAuth();

   const { height, width } = useWindowDimensions();
   const { id, name } = useLocalSearchParams();

   const [searchValue, setSearchValue] = useState("");
   const [serviceCategories, setServiceCategories] = useState([]);
   const [searchedCategories, setSearchedCategories] = useState([]);
   const [isCategLoading, setIsCategLoading] = useState(true);
   
   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState(null);

   // Refs
   const scrollY = useRef(new Animated.Value(0)).current;
   const skeletonOpacity = useRef(new Animated.Value(0.5)).current;

   // Animation
   const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
   inputRange: [0, HEADER_SCROLL_DISTANCE],
   outputRange: [1, 0],
   extrapolate: 'clamp'
  })

  const imageOpacity = scrollY.interpolate({
   inputRange: [0, HEADER_SCROLL_DISTANCE],
   outputRange: [0.2, 0],
   extrapolate: 'clamp'
  })

  const searchBackground = scrollY.interpolate({
   inputRange: [96, HEADER_SCROLL_DISTANCE],
   outputRange: [
      'rgba(12, 129, 204, 0)', `rgba(12, 129, 204, 1)`
   ],
   extrapolate: 'clamp'
  })

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

      if (isCategLoading) animLoop.start();
      
      return () => animLoop.stop();
   }, [isCategLoading])

   // Functions
   const fetchCategories = async () => {
      try {
         // console.log("---- [Service Category Screen] Fetching List Attempt ----");
         // console.log("[1] Fetching Attempt");
         const categoryResult = await api.get(`/general/sub-services/${id}`);

         // console.log("[2] Succesful Fetching Category");
         const categoryData = (
            Array.isArray(categoryResult.data.data) ?
            [...categoryResult.data.data] : []
         )
         setServiceCategories(categoryData);
      } catch (err) {
         const message = err.response.data.message || `Unknown error fetching Category List for Service: ${name}`
         setErrorMessage(message);
         setShowError(true);
      } finally {
         setTimeout(() => {
            setIsCategLoading(false);
         }, 1000)
      }
   }

   const handleCategoryClick = async (item) => {
      if (!user?.can_book) {
         setErrorMessage("You're account has not been verified and is not able to book. Please verify your account now if you wish to proceed.");
         setShowError(true);
         return;
      }

      router.push({
         pathname: '/dashboard/client/appointment/[start]',
         params: { categoryId: item.id, categoryName: item.name, serviceId: id, serviceName: name },
      });
   }

   // Effects 
   useEffect(() => { fetchCategories() }, [])

   useEffect(() => {
      if (!serviceCategories || serviceCategories.length === 0) return;
      if (!searchValue.trim()) return;

      const searchWords = searchValue
         .toLowerCase()
         .split(/\s+/)
         .filter(word => word.length > 0);

      if (searchWords.length === 0) return;

      const filtered = serviceCategories.filter(item => {
         return searchWords.every(word => 
            item?.name?.toLowerCase().includes(word) ||
            item?.description?.toLowerCase().includes(word)
         );
      });

      setSearchedCategories(filtered);
   }, [searchValue, serviceCategories]);

   return (
      <>
         <ErrorModal 
         visible={showError}
         setVisible={setShowError}
         title={"An error has ocurred when starting an Appointment"}
         message={errorMessage}
         buttonText={"Verify Now"}
         onExit={() => router.replace('/dashboard/client/verify/user')}
         />

         <View
         style={[
            global.screenContainer, {
            position: 'relative'   
         }]}>
            <Header 
            backgroundColor='transparent'
            hasBack
            backColor='#fff'
            position='absolute'
            />

            {/* ---- Header */}
            <Animated.View
            style={[{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               zIndex: 90,
               height: headerHeight,
               width: '100%',
               borderBottomStartRadius: 24,
               borderBottomEndRadius: 24,
            }]}>  
               {/* ---- Card */}
               <Animated.View
               style={[{
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  overflow: 'hidden'
               }]}
               >
                  <Animated.Image 
                  source={ServiceMainImages[`${id}`]}
                  style={[{
                     width: '100%',
                     height: '100%',
                     position: 'absolute',
                     top: 0, 
                     left: 0,
                     right: 0,
                     objectFit: 'cover',
                     opacity: imageOpacity
                  }]}
                  />
                  <Animated.Image 
                  source={require(`../../../../../../assets/images/backgrounds/graphic-bg7.png`)}
                  style={[{
                     width: '100%',
                     height: '100%',
                     position: 'absolute',
                     top: 0, 
                     left: 0,
                     right: 0,
                     objectFit: 'cover',
                     opacity: headerOpacity
                  }]}
                  />
                  <Animated.Text
                  style={{
                     position: 'absolute',
                     bottom: 0,
                     right: 0,
                     margin: 24,
                     textAlign: 'right',
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.xxxl,
                     color: 'white',
                     opacity: headerOpacity,
                     textShadowOffset: { width: 0, height: 2 },
                     textShadowRadius: 4,
                     textShadowColor: 'rgba(0, 0, 0, 0.25)',
                  }}>
                     {name}
                  </Animated.Text>

               </Animated.View>

               {/* ---- Search */}
               <Animated.View
               style={[{
                  display: 'flex',
                  height: 96,
                  justifyContent: 'center',
                  paddingHorizontal: 24,
                  backgroundColor: searchBackground, // Temporary
               }]}>
                  <Searchbar onChangeText={(e) => setSearchValue(e)} value={searchValue}/>
               </Animated.View>
            </Animated.View>

            {(isCategLoading) ? (
               <View
               style={[{
                  paddingHorizontal: 24,
                  paddingBottom: 48,
                  paddingTop: 310,  // Temporary
                  gap: 24
               }]}>
                  {[1,2,3].map((_, index) => (
                     <Animated.View 
                     key={index}
                     style={{
                        width: '100%',
                        height: 150,
                        backgroundColor: COLORS.strokes,
                        borderRadius: 8,
                        opacity: skeletonOpacity
                     }}/>
                  ))}
               </View>
            ) : (
               <FlatList 
               data={(searchValue) ? searchedCategories : serviceCategories}
               renderItem={({item}) => (
                  <ServiceCategoryItem 
                  item={item}
                  serviceName={name}
                  serviceId={id}
                  onPress={() => handleCategoryClick(item)}
                  />
               )}
               keyExtractor={(item) => item.id.toString()}
               showsVerticalScrollIndicator={true}
               contentContainerStyle={{
                  minHeight: height + 310,
                  paddingHorizontal: 24,
                  paddingBottom: 48,
                  paddingTop: 310,
                  gap: 24
               }}
               onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: scrollY}}}],
                  { useNativeDriver: false }
               )}
               scrollEventThrottle={16}
               em
               />
            )}

         </View>
      </>
   )
};

export default ServiceCategoryScreen