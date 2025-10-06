// Component: Review Container

// Imports
// ---- React Components
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useState, useRef } from 'react';
// ---- Hooks
import { useConvert } from '../hooks/useConvert';
// ---- Styles and Icons
import Star from '@expo/vector-icons/Octicons';
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const MAX_LINES = 3;

const ReviewContainer = ({review, handleImageModal}) => {
   // Hooks and States
   const {convertDateToFormattedDate} = useConvert();
   const [isExpanded, setIsExpanded] = useState(false);
   const [showMore, setShowMore] = useState(false);

   // Functions
   const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
   };

   const onTextLayout = (e) => {
      if (e.nativeEvent.lines.length > MAX_LINES && !showMore) {
         setShowMore(true);
      }
   };

   // Ref
   const moreButtonRef = useRef().current;

   return (
      <View
      style={{
         padding: 12,
         borderRadius: 12,
         backgroundColor: '#fff',
      }}>
         {/* ---- Service and Rating */}
         <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', gap: 16, marginBottom: 8, }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1}}>
               <Text
               numberOfLines={1}
               style={{
                  flexShrink: 1,
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels
               }}>
                  {review.user_name || review.user.name}
               </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
               <Star name='star-fill' size={20} color={COLORS.accent}/>
               <Text style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels
               }}>({review.rating})</Text>
            </View>  
         </View>
               
         
         <Text style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.sm,
            color: COLORS.primary
         }}>
            {review.service}
         </Text>

         <View style={[global.divider, {marginVertical: 12}]}/>

         <Text
         style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.sm,
            color: COLORS.lettersicons,
            lineHeight: 20
         }}
         numberOfLines={isExpanded ? undefined : MAX_LINES}
         onTextLayout={onTextLayout}
         >
            {review.review || review.comment}
         </Text>

         {showMore && (
            <Pressable
            onPress={toggleExpanded}
            >
               {({pressed}) => (
                  <Text style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.accent,
                  paddingVertical: 4,
                  textAlign: 'center',
                  opacity: pressed ? 0.5 : 1
                  }}>
                     {isExpanded ? 'Read Less' : 'Read More'}
                  </Text>
               )}
               
            </Pressable>
         )}

         {review.attachment &&
         <Pressable onPress={() => handleImageModal(review.attachment)}>
            <Image 
            source={{uri: review?.attachment}}
            style={{
               height: 72,
               borderRadius: 8,
               backgroundColor: COLORS.secondary,
               marginVertical: 8
            }}
            />
         </Pressable>
         }

         <Text
         style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.xs,
            color: COLORS.strokes,
            textAlign: 'right'
         }}>
            {convertDateToFormattedDate(new Date(review.created_at))}
         </Text>

      </View>
   )
}

export default ReviewContainer

const styles = StyleSheet.create({})