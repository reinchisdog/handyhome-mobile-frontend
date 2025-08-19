// Component: Media Upload

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, TouchableOpacity, useWindowDimensions, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
// ---- Contexts
import { useCamera } from '../context/CameraContext';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const MediaUpload = ({
   maxMedia = 3,
   data,
   dataName,
   setData,
}) => {
   // Hooks and States
   const { openCamera, image } = useCamera();
   const {width} = useWindowDimensions();

   // Functions
   const handleMediaPick = async () => {
      openCamera();
   }

   const handleDelete = (index) => {
      setData(prev => {
         const current = prev[dataName];

         if (maxMedia === 1) {
            // For maxMedia = 1
            return { ...prev, [dataName]: null };
         } else {
            // For maxMedia > 1
            if (Array.isArray(current) && index !== null) {
               const updated = [...current];
               updated.splice(index, 1);

               return { ...prev, [dataName]: updated.length > 0 ? updated : null };
            } else {
               // Fallback: set to null
               return { ...prev, [dataName]: null };
            }
         }
      })
   }

   // Effects
   useEffect(() => {
      if (!image) return;

      setData(prev => {
         const current = prev[dataName];

         if (maxMedia === 1) {
            // For maxMedia = 1
            return { ...prev, [dataName]: image };
         } else {
            // For maxMedia > 1
            return {
               ...prev,
               [dataName]: Array.isArray(current) ?
                  [...current, image] :
                  current ?
                     [current, image] :
                     [image], 
            };
         }
      });
   }, [image, maxMedia, dataName])

   const normalizedData = Array.isArray(data) ? data : (data ? [data] : []);

   return (
      <View 
      style={{
         flexDirection: 'row',
         gap: 12,
         justifyContent: 'flex-start',
         flexWrap: 'wrap',
         width: '100%'
      }}>
         {(normalizedData.length !== maxMedia) &&
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleMediaPick}>
               <View
               style={styles.imageContainer}>
                  <View style={{alignItems: 'center', gap: 4}}>
                     <Icons name='image-plus' size={24} color={COLORS.lettersicons}/>
                     <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.xs, color: COLORS.labels}}>Add Photo</Text>
                  </View>
               </View>
            </TouchableOpacity>
         }
         {normalizedData.map((item, index) => (
            <ImageBackground
            key={index}
            source={{uri: item}}
            style={styles.imageContainer}
            imageStyle={styles.imageUpload}>
               <TouchableOpacity
               style={styles.imageDelete}
               onPress={() => handleDelete(index)}>
                  <Icons name='window-close' size={12} color={'#fff'}/>
               </TouchableOpacity> 
            </ImageBackground>
         ))}
      </View>
   )
}

export default MediaUpload

const styles = StyleSheet.create({
   imageContainer: {
      height: 72,
      width: 72,
      aspectRatio: '1/1',
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.labels,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
   },
   imageUpload: {
      objectFit: 'cover'
   },
   imageDelete: {
      position: 'absolute',
      top: 6,
      right: 6,
      opacity: 0.5,
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: COLORS.lettersicons,
      justifyContent: 'center',
      alignItems: 'center'
   },
})