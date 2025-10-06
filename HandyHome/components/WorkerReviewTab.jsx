// Component: Worker Review Tab

// Imports
// ---- React Components
import { StyleSheet, Text, View, Pressable, Modal, TouchableHighlight, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
// ---- Other Components
import { ScrollView, Tabs } from 'react-native-collapsible-tab-view'
import Header from './Header'
import ReviewContainer from './ReviewContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Styles and Icons
import { globalStyles as global } from '../styles/globalStyles';
import { authStyles as auth } from '../styles/authStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import Arrows from '@expo/vector-icons/Entypo';
import Star from '@expo/vector-icons/Octicons';

const WorkerReviewTab = ({
   reviews,
   reviewCount,
   reviewsLoading, 
   loadingMore,
   fetchReviews, 
   fetchMore,
   hasMore
}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   const ratings = [0, 1, 2, 3, 4, 5];
   const [isFilterMedia, setIsFilterMedia] = useState(false);
   const [filterRating, setFilterRating] = useState(0);

   const [showRating, setShowRating] = useState(false);
   const [currentImage, setCurrentImage] = useState(null);  
   const [showImage, setShowImage] = useState(false);

   // Functions
   const handleFilter = async (filter) => {
      switch (filter) {
         case 'all': {
            setIsFilterMedia(false);
            setFilterRating(0);

            await fetchReviews(1);
            return;
         }
         case 'media': {
            setIsFilterMedia(true);

            await fetchReviews(1, true);
            return;
         }
         case 'rating': {
            setShowRating(true);
            return;
         }
         default: {
            return;
         }
      };
   };

   const handleRatingFilter = async (rating) => {
      setFilterRating(rating);
      setShowRating(false);

      const filter = rating == 0 ? 'all' : rating.toString();
      console.log(filter);

      if (isFilterMedia) {
         await fetchReviews(1, true, filter);
      } else {
         await fetchReviews(1, false, filter);
      }
   };

   const handleImageModal = (attachment) => {
      setCurrentImage(attachment);
      setShowImage(true);
   }

   // Renders
   const renderEmpty = () => (
      !reviewsLoading && !loadingMore &&
         <View style={{
         width: '100%',
         paddingVertical: 32,
         // backgroundColor: COLORS.accent
         alignItems: 'center',
         justifyContent: 'center'
         }}>
            <Text
            style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.labels
            }}>
               No Reviews Found.
            </Text>
         </View>   
   )

   const renderFooter = () => (
      <View style={{
         width: '100%',
         paddingVertical: 32,
         // backgroundColor: COLORS.accent
         alignItems: 'center',
         justifyContent: 'center'
      }}>
         {loadingMore && (
            <LoadingDots size={12} />
         )}
         
         {(reviewsLoading && reviews.length === 0) && (
            <LoadingDots size={12} />
         )}

         {/* Show divider only when done and no more data */}
         {(!hasMore && !loadingMore && !reviewsLoading) && (
            <View style={global.divider}/>
         )}
      </View>
   )

   return (
      <>
         {/* Image Modal */}
         <Modal
         visible={showImage}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={'#00000080'}
         onRequestClose={() => setShowImage(false)}
         >  
            <View style={{flex: 1}}>
               <Header 
               hasBack
               onBack={() => {
                  setShowImage(false);
                  setCurrentImage(null)
               }}
               backColor='#fff'
               backgroundColor='transparent'
               />

               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                  <Image 
                  source={{uri: currentImage }}
                  style={{
                     marginTop: -64,
                     height: '100%',
                     width: '100%',
                     resizeMode: 'contain',
                     objectFit: 'contain'
                  }}
                  />
               </View>
            </View>
         </Modal>

         {/* Rating Modal */}
         <Modal
         visible={showRating}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setShowRating(false)}
         >
            <Pressable
            onPress={() => setShowRating(false)}
            style={{
               flex: 1,
               justifyContent: 'center',
               alignItems: 'center'
            }}>
               <View 
               style={{
                  width: '90%',
                  backgroundColor: 'white',
                  borderRadius: 8,
                  flexShrink: 1,
               }}>
               {ratings?.map((rating, index) => (
                  <TouchableHighlight
                  underlayColor={'#7FCDEE20'}
                  key={index}
                  onPress={() => {handleRatingFilter(rating)}}>
                     <View style={{
                        height: 48,
                        paddingHorizontal: 24,
                        borderBottomColor: '#c9c9c9',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: (filterRating === rating) ? '#7FCDEE40' : 'transparent'
                     }}>
                     <Text style={auth.inputText}>
                        {rating === 0 ? "No Rating" : `${rating} Star${rating > 1 ? "s" : ""}`}
                     </Text>
                     { rating !== 0 &&
                        <View style={{flexDirection: 'row', gap: 2, alignItems: 'center'}}>
                           {[...Array(rating)].map((_, i) => (
                              <Star key={i} name="star-fill" size={20} color={COLORS.accent} />
                           ))}
                        </View>
                     }
                     </View>
                  </TouchableHighlight>
               ))}
               </View>
            </Pressable>
         </Modal>

         <Tabs.FlatList
         stickyHeaderIndices={[0]}
         ListHeaderComponent={() => (
            <View
            style={{
               width: '100%',
               backgroundColor: COLORS.screenbg,
               paddingTop: 12,
               borderBottomLeftRadius: 12,
               borderBottomRightRadius: 12
            }}>
               <View style={styles.section}>
                  <Text style={styles.title}>Reviews</Text>
                  <View style={global.divider}/>
                  {/* ---- Filters */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                     
                     {/* ---- All */}
                     <Pressable
                     onPress={() => handleFilter('all')}
                     style={({pressed}) => [
                        styles.filterButton, {
                        borderColor: filterRating === 0 && !isFilterMedia ? COLORS.primary : COLORS.strokes,
                        backgroundColor: filterRating === 0 && !isFilterMedia ? COLORS.primary : pressed ? COLORS.lightblue : '#fff'
                     }]}>
                        <Text
                        style={[
                           styles.filterTitle, {
                           color: filterRating === 0 && !isFilterMedia ? '#fff' : COLORS.lettersicons
                        }]}>
                           All
                        </Text>

                        <Text
                        style={[
                           styles.filterDetail, {
                           color: filterRating === 0 && !isFilterMedia ? '#fff' : COLORS.lettersicons
                        }]}>
                           {reviewCount.total || '——'}
                        </Text>
                     </Pressable>

                     {/* ---- With Media */}
                     <Pressable
                     onPress={() => handleFilter('media')}
                     style={({pressed}) => [
                        styles.filterButton, {
                        borderColor: isFilterMedia ? COLORS.primary : COLORS.strokes,
                        backgroundColor: isFilterMedia ? COLORS.primary : pressed ? COLORS.lightblue : '#fff'
                     }]}>
                        <Text
                        style={[
                           styles.filterTitle, {
                           color: isFilterMedia ? '#fff' : COLORS.lettersicons
                        }]}>
                           With Media
                        </Text>

                        <Text
                        style={[
                           styles.filterDetail, {
                           color: isFilterMedia ? '#fff' : COLORS.lettersicons
                        }]}>
                           {reviewCount.attachment || '——'}
                        </Text>
                     </Pressable>

                     {/* ---- Rating */}
                     <Pressable
                     onPress={() => handleFilter('rating')}
                     style={({pressed}) => [
                        styles.filterButton, {
                        borderColor: filterRating !== 0 ? COLORS.primary : COLORS.strokes,
                        backgroundColor: filterRating !== 0 ? COLORS.primary : pressed ? COLORS.lightblue : '#fff'
                     }]}>
                        <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                           <Text
                           style={[
                              styles.filterTitle, {
                              color: filterRating !== 0 ? '#fff' : COLORS.lettersicons
                           }]}>
                              Rating
                           </Text>
                           <Arrows name='chevron-down' size={12} color={filterRating === 0 ? COLORS.labels : '#fff'}/>
                        </View>

                        <Text
                        style={[
                           styles.filterDetail, {
                           color: filterRating !== 0 ? '#fff' : COLORS.lettersicons
                        }]}>
                           {filterRating === 0 ? 'All' : `(${filterRating})`}
                        </Text>
                     </Pressable>
                  </View>
               </View>
            </View>
         )}
         data={reviews}
         contentContainerStyle={{
            gap: 12,
            paddingHorizontal: 12,
            paddingBottom: insets.bottom + 24
         }}
         renderItem={({item}) => (
            <ReviewContainer
            review={item}
            handleImageModal={handleImageModal}
            />
         )}
         keyExtractor={(item, index) => item?.id?.toString() ?? `review-${index}`}
         onEndReached={() => fetchMore(isFilterMedia, filterRating === 0 ? 'all' : filterRating.toString())}
         onEndReachedThreshold={0.1}
         ListEmptyComponent={renderEmpty}
         ListFooterComponent={renderFooter} 
         />
      </>
      
   )
}

export default WorkerReviewTab

const styles = StyleSheet.create({
   section: {
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#fff',
      width: '100%',
      gap: 8
   },
   title: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons
   },
   service: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: COLORS.secondary,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.xs,
      color: COLORS.primary,
      flexShrink: 1,
      textAlign: 'center'
   },
   filterButton: {
      alignItems: 'center',
      flexGrow: 1,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 4,
      height: 40,
      justifyContent: 'center'
   },
   filterTitle: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm
   },
   filterDetail: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.xs,
      opacity: 0.5
   }
})