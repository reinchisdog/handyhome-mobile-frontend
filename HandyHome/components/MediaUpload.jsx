// Component: Media Upload

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, TouchableOpacity, useWindowDimensions, ImageBackground } from 'react-native';
import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
// ---- ErrorModal
import ErrorModal from '../components/ErrorModal';
// ---- Contexts
import { useMedia } from '../context/MediaContext';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

const MediaUpload = ({
   maxMedia = 3,
   data,
   dataName,
   setData,
   mode = "both", // "both", "camera", "picker"
   hasSwitch = false,
   initialCameraType = 'back'
}) => {
   // Hooks and States
   const { openCamera, openImagePicker, returnedImage, clearImage } = useMedia();

   const hasProcessedImage = useRef(false);

   // Functions
   const handleMediaPick = useCallback(async () => {
      if (mode === "both") {
         await openCamera(
            hasSwitch, true, initialCameraType
         )
      } else if (mode === "camera") {
         await openCamera(
            hasSwitch, false, initialCameraType
         )
      } else if (mode === "picker") {
         await openImagePicker()
      }

   }, [hasSwitch, openCamera]);

   const handleDelete = useCallback((index) => {
      setData(prev => {
         const current = prev[dataName];

         if (maxMedia === 1) {
            return { ...prev, [dataName]: null };
         } else {
            if (Array.isArray(current) && index !== null && index < current.length) {
               const updated = [...current];
               updated.splice(index, 1);
               return { ...prev, [dataName]: updated.length > 0 ? updated : null };
            } else {
               return { ...prev, [dataName]: null };
            }
         }
      });
   }, [dataName, maxMedia, setData]);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Effects
   useEffect(() => {
      if (!returnedImage) {
         hasProcessedImage.current = false;
         return;
      }

      if (hasProcessedImage.current) return;

      if (!returnedImage.endsWith('jpg') && !returnedImage.endsWith('jpeg')) { 
         setErrorMessage("Only images in the jpg/jpeg are allowed. Please try again.");
         setErrorModal(true);
         clearImage();
         return;
      }

      setData(prev => {
         const current = prev[dataName];

         if (maxMedia === 1) {
            // For maxMedia = 1
            return { ...prev, [dataName]: returnedImage };
         } else {
            // For maxMedia > 1
            if (Array.isArray(current)) {
               // Don't add if already at max capacity
               if (current.length >= maxMedia) return prev;
               return { ...prev, [dataName]: [...current, returnedImage] };
            } else if (current) {
               // Convert single item to array and add new image
               return { ...prev, [dataName]: [current, returnedImage] };
            } else {
               // First image
               return { ...prev, [dataName]: [returnedImage] };
            }
         }
      });

      hasProcessedImage.current = true;
      clearImage();
   }, [returnedImage, dataName, maxMedia, setData, clearImage])

   const normalizedData = useMemo(() => {
      return Array.isArray(data) ? data : (data ? [data] : []);
   }, [data]);

   const canAddMore = normalizedData.length < maxMedia;

   return (
      <>
      <ErrorModal 
      visible={errorModal}
      setVisible={setErrorModal}
      title={'Something went wrong!'}
      message={errorMessage}
      />

      <View 
      style={{
         flexDirection: 'row',
         gap: 12,
         justifyContent: 'flex-start',
         flexWrap: 'wrap',
         width: '100%'
      }}>
         {canAddMore &&
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleMediaPick}
            >
               <View style={styles.imageContainer}>
                  <View style={{alignItems: 'center', gap: 4}}>
                     <Icons name='image-plus' size={24} color={COLORS.lettersicons}/>
                     <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.xs, color: COLORS.labels}}>Add Photo</Text>
                  </View>
               </View>
            </TouchableOpacity>
         }

         {normalizedData?.map((item, index) => (
            <ImageBackground
            key={`${item}-${index}`}
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
      </>
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