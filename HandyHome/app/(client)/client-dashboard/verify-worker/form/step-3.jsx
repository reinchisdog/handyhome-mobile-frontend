import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';

import Icons from '@expo/vector-icons/MaterialCommunityIcons'

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const WorkSamplesScreen = () => {
   const {height} = useWindowDimensions();

   const {
      workerVerify,
      setWorkerVerify,
   } = useWorkerVerify();

   const handleImagePick = async () => {
      const uriPath = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         quality: 1
      });

      if(!uriPath.canceled) {
         setWorkerVerify(prev => {
            const current = prev.workSamples;
            const newUri = uriPath.assets[0].uri;  

            return {
               ...prev,
               workSamples: Array.isArray(current) ?
                  [...current, newUri] :
                  current ?
                     [current, newUri] :
                     newUri,
            };
         });
      }
   }

   const handleDelete = (index) => {
      setWorkerVerify(prev => {
         const current = prev.workSamples;

         if (Array.isArray(current) && index !== null) {
            const updated = [...current];
            updated.splice(index, 1);
            return { ...prev, workSamples: updated };
         } else {
            return {...prev, workSamples: null};
         }
      })
   }

   return (
      <View 
      style={{
         alignItems: 'center',
         gap: 24,
         minHeight: height - 144 - 48 - 64,
      }}>
         <Text style={styles.instruction}>{`Show us your best completed projects. \n(Up to 5 images)`}</Text>

         <View 
         style={{
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            flex: 1,
            width: '100%'
         }}>
            {(workerVerify.workSamples.length !== 5) &&
               <TouchableOpacity
               activeOpacity={0.9}
               onPress={handleImagePick}>
                  <View
                  style={styles.imageContainer}>
                     <View style={{alignItems: 'center', gap: 4}}>
                        <Icons name='image-plus' size={24} color={COLORS.lettersicons}/>
                        <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.xs, color: COLORS.labels}}>Add Photo</Text>
                     </View>
                  </View>
               </TouchableOpacity>
            }
            {workerVerify.workSamples.map((item, index) => (
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
      </View>
   )
}

export default WorkSamplesScreen

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
   instruction: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'left',
      width: '100%'
   }
})