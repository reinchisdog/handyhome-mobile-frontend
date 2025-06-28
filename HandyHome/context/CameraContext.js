/* --------------------------------- Imports -------------------------------- */
import React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState,
   useRef
} from 'react';
import {
   Linking,
   Modal,
   View,
   useWindowDimensions,
   TouchableOpacity,
   Animated,
   Pressable
} from 'react-native';
import { 
   useCameraPermission,
   Camera,
   useCameraDevice
} from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';

import Header from '../components/dashboard/Header';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
   const { hasPermission, requestPermission } = useCameraPermission();

   const [ showCamera, setShowCamera ] = useState(false);
   const [ cameraFace, setCameraFace ] = useState("back");
   const [ image, setImage ] = useState(null);

   const openCamera = async () => {
      if (!hasPermission) {
         const granted = await requestPermission();
         if (!granted) Linking.openSettings();
      } else {
         setShowCamera(true);
      }
   }

   const forceCloseCamera = () => {
      setImage(null);
      setShowCamera(false);
   }

   return (
      <CameraContext.Provider 
      value={{
         openCamera,
         forceCloseCamera,
         image,
         setImage,
         setCameraFace
      }}>
         {children}

         <CameraScreen 
         visible={showCamera}
         setVisible={setShowCamera}
         setImage={setImage}
         cameraFace={cameraFace}
         />
      </CameraContext.Provider>
   )
}

const CameraScreen = ({visible, setVisible, setImage, cameraFace}) => {
   const { width, height } = useWindowDimensions();

   const [zoom, setZoom] = useState(device?.neutralZoom);
   const [exosure, setExposure] = useState(0);
   const [flash, setFlash] = useState("off");
   const [torch, setTorch] = useState("off");
   const cameraRef = useRef(null);

   const device = useCameraDevice(cameraFace)

   const [lightIcon, setLightIcon] = useState("flash-off")
   const handleLight = () => {
      if (lightIcon === "flash-off") {
         // ---- Flash Auto
         setFlash("on");
         setLightIcon("flash-auto")

      } else if (lightIcon === "flash-auto") {
         // ---- Flash On
         setFlash("off");
         setTorch("on")
         setLightIcon("flash")
         
      } else if (lightIcon === "flash") {
         // ---- Flash Off
         setTorch("off")
         setLightIcon("flash-off")
      }
   }

   const handleImagePick = async () => {
      const uriPath = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         quality: 1
      });

      if(!uriPath.canceled) {
         setImage(uriPath.assets[0].uri);
         setVisible(false);
         
      }
   }

   const handleImageTake = async () => {
      try {
         if (cameraRef.current == null) throw new Error("Camera ref is null");

         const photo = await cameraRef.current.takePhoto({
            flash: flash,
            enableShutterSound: true
         });

         const uriPath = photo.path.startsWith('file://') ?
         photo.path : `file://${photo.path}`;

         setImage(uriPath);
         setVisible(false);

      } catch (e) { console.log(e) }
   }

   const circlePress = useRef(new Animated.Value(0)).current;
   const circleScale = circlePress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.8],
      extrapolate: 'clamp'
   })

   const handlePressIn = () => {
      Animated.timing(circlePress, {
         toValue: 1,
         duration: 100,
         useNativeDriver: false
      }).start();
   }

   const handlePressOut = () => {
      Animated.timing(circlePress, {
         toValue: 0,
         duration: 100,
         useNativeDriver: false
      }).start();
   }

   return (
      <Modal
      animationType='slide'
      backdropColor={'#000'}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={() => {setVisible(false); setImage(null)}}
      >
         {/* ------------------------------ Flash Options ----------------------------- */}
         <Header 
         background='#000'
         left={
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setVisible(false)}>
               <Arrows name='chevron-left' size={24} color={'#fff'}/>
            </TouchableOpacity>
         }
         title={<></>}
         right={
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
               if (cameraFace === "back") handleLight()
               else () => {};
            }}>
               <Icons name={lightIcon} size={24} color={'#fff'}/>
            </TouchableOpacity>
         }/>

         {/* ------------------------------- Camera View ------------------------------ */}
         <Camera 
         ref={cameraRef}
         style={{flex: 1}}
         device={device}
         isActive={true}
         zoom={zoom}
         exposure={exosure}
         torch={torch}
         photo
         />

         {/* ----------------------------- Camera Options ----------------------------- */}
         <View 
         style={{
            backgroundColor: '#000',
            paddingHorizontal: 12,
            paddingTop: 24,
            paddingBottom: 88
         }}>
            <View 
            style={{
               position: 'relative',
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'center'
            }}>

               <TouchableOpacity
               activeOpacity={0.7}
               onPress={handleImagePick}
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 42,
                  width: 42,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: '#fff',
                  position: 'absolute',
                  left: 12,
               }}>
                  <Icons name='image-area' size={36} color={'#fff'}/>
               </TouchableOpacity>

               <Pressable
               style={{
                  height: 72,
                  aspectRatio: '1/1',
                  borderWidth: 2,
                  borderColor: '#fff',
                  borderRadius: '50%'
               }}
               onPressIn={handlePressIn}
               onPressOut={handlePressOut}
               onPress={handleImageTake}>
                  <Animated.View 
                  style={{
                     height: 54,
                     aspectRatio: '1/1',
                     backgroundColor: '#fff',
                     borderRadius: '50%',
                     margin: 'auto',
                     transform: [{scale: circleScale}]
                  }}
                  />
               </Pressable>

            </View>
         </View>
      </Modal>
   )
}