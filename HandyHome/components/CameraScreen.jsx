import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, TouchableHighlight, Platform, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Camera, useCameraDevice } from 'react-native-vision-camera'

import Header from './dashboard/Header'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const CameraScreen = ({setShowCamera, setImage, cameraFace}) => {
   const { width, height } = useWindowDimensions();

   const device = useCameraDevice(cameraFace);

   const [zoom, setZoom] = useState(device?.neutralZoom);
   const [exposure, setExposure] = useState(0);
   const [flash, setFlash] = useState("off");
   const [torch, setTorch] = useState("off");
   const cameraRef = useRef(null);

   const handleImagePick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         quality: 1
      });

      if (!result.canceled) {
         setImage(result.assets[0].uri);
         setShowCamera(false);
      }
   }

   const handleImageTake = async () => {
      try {
         if (cameraRef.current == null) throw new Error("Camera ref is null");

         const photo = await cameraRef.current.takePhoto({
            flash: flash,
            enableShutterSound: true
         });
         const normalizedUri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
         setImage(normalizedUri);
         setShowCamera(false);
      } catch (e) {
         console.log(e);
      }
   }

   return (
      <View style={{position: 'absolute', top: 0, left: 0, zIndex: 999, width: width, height: height, paddingBottom: 64, backgroundColor: '#000', }}>
         <View style={{flex: 1, position: 'relative'}}>
            <Header 
            background='#000'
            left={
               <TouchableOpacity  activeOpacity={0.8} onPress={() => setShowCamera(false)}>
                  <Icons name='close' size={24} color={'#fff'}/>
               </TouchableOpacity>
            }
            title={<></>}
            right={
               <TouchableOpacity activeOpacity={0.8}
               onPress={() => 
               {
                  if (cameraFace === "back") setTorch(t => (t === "off" ? "on" : "off"));
                  else () => {};
               }
               }>
                  <Icons 
                  name={(torch === "off")? "flashlight-off" : "flashlight"} 
                  size={24}
                  color={(torch === "off")? "#ffffff80" : "#fff"}
                  />
               </TouchableOpacity>
            }
            />
            <Camera 
            ref={cameraRef}
            style={{flex: 1}}
            device={device}
            isActive={true}
            zoom={zoom}
            exposure={exposure}
            torch={torch}
            photo
            />

            <View style={{
               position: 'absolute',
               paddingHorizontal: 12,
               
               bottom: 12,
               // backgroundColor: 'green',
               width: '100%',
               height: 72,
            }}>
               <View style={{position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                  <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={handleImagePick}
                  style={{
                     justifyContent: 'center',
                     alignItems: 'center',
                     height: 54,
                     width: 54,
                     borderRadius: 8,
                     borderWidth: 2,
                     borderColor: '#fff',
                     position: 'absolute',
                     left: 12,

                  }}>
                     <Icons name='image-area' size={36} color={'#fff'}/>
                  </TouchableOpacity>
               
                  <View style={{
                     height: '100%',
                     aspectRatio: '1/1',
                     borderWidth: 4,
                     borderColor: '#fff',
                     borderRadius: '50%',
                  }}>
                     <TouchableOpacity
                     activeOpacity={0.7} 
                     onPress={handleImageTake}
                     style={{
                        height: 54,
                        aspectRatio: '1/1',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        margin: 'auto'
                     }}
                     />
                  </View>

               </View>
            </View>
         </View>
      </View>
   )
}

export default CameraScreen