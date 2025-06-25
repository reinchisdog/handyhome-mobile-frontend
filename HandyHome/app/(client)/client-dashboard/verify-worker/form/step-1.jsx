import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useCamera } from '../../../../../context/CameraContext';
import { useWorkerVerification } from '../../../../../context/WorkerVerificationContext';

import Icons from '@expo/vector-icons/MaterialCommunityIcons'

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const PhotoVerificationScreen = () => {
   const { 
      openCamera,
      // forceCloseCamera,
      image,
      setImage,
      setCameraFace
   } = useCamera();

   const {
      workerVerification,
      setWorkerVerification,
   } = useWorkerVerification();

   useEffect(() => {
      setCameraFace("front")
   }, [])

   useEffect(() => {
      if (image) {
         setWorkerVerification(prev => ({
            ...prev,
            verificationPhoto: image
         }))
         
      }
      
      setImage(null)

   }, [image])

   return (
      <View 
      style={{
         alignItems: 'center',
         gap: 24
      }}>
         <Image 
         source={require('../../../../../assets/images/illustrations/Photo-Guide-2.png')}
         style={styles.illustrationCont}/>

         <View style={{ gap: 16 }}>
            {/* ---- Note */}
            <View style={styles.noteCont}>
               <Text style={styles.noteText}>
                  <Text style={{fontFamily: FONTS.roboto700}}>NOTE: </Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
               </Text>
            </View>

            {/* ---- Image */}
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               if (!workerVerification.verificationPhoto) openCamera()
            }}>
               <ImageBackground
               source={{uri: workerVerification.verificationPhoto}}
               style={styles.imageContainer}
               imageStyle={styles.imageUpload}>
                  {(workerVerification.verificationPhoto) ? 
                     <TouchableOpacity
                     style={styles.imageDelete}
                     onPress={() => setWorkerVerification(prev => ({
                        ...prev,
                        verificationPhoto: null
                     }))}>
                        <Icons name='window-close' size={12} color={'#fff'}/>
                     </TouchableOpacity> :
                     <View style={{alignItems: 'center', gap: 4}}>
                        <Icons name='image-plus' size={24} color={COLORS.lettersicons}/>
                        <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.xs, color: COLORS.labels}}>Add Photo</Text>
                     </View>
                  }
               </ImageBackground>
            </TouchableOpacity>
         </View>
      </View>
   )
}

export default PhotoVerificationScreen

const styles = StyleSheet.create({
   illustrationCont: {
      aspectRatio: '1/1',
      height: 148,
      margin: 'auto'
   },
   noteCont: {
      backgroundColor: COLORS.secondary,
      padding: 10,
      borderRadius: 12
   },
   noteText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons
   },
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
   }
})