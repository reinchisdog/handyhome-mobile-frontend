// Context: Camera Context

// Imports
// ---- React and Expo Components
import React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState,
   useRef,
   useCallback
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
// ---- Styles and Icons
import Header from '../components/Header';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
   // Hooks and States
   const { hasPermission, requestPermission } = useCameraPermission();

   const [ showCamera, setShowCamera ] = useState(false);
   const [initialCameraFace, setInitialCameraFace] = useState("back");
   const [ canSwitch, setCanSwitch] = useState(false);
   const [ image, setImage ] = useState(null);

   // Functions
   const clearImage = useCallback(() => {
      setImage(null);
   }, []);

   const openCamera = useCallback(async (cameraFace = "back", allowSwitch = false) => {
      if (!hasPermission) {
         const granted = await requestPermission();
         if (!granted) {
            Linking.openSettings();
            return;
         }
      }
      setInitialCameraFace(cameraFace);
      setCanSwitch(allowSwitch);
      setShowCamera(true);
   }, [hasPermission, requestPermission]);

   const forceCloseCamera = useCallback(() => {
      setImage(null);
      setShowCamera(false);
   }, []);

   return (
      <CameraContext.Provider 
      value={{ 
         openCamera,
         forceCloseCamera,
         clearImage,
         image, 
      }}>
         {children}

         <CameraScreen 
         visible={showCamera}
         setVisible={setShowCamera}
         setImage={setImage}
         initialCameraFace={initialCameraFace}
         canSwitch={canSwitch}
         />
      </CameraContext.Provider>
   )
}

const CameraScreen = ({
   visible, 
   setVisible,
   setImage, 
   initialCameraFace = "back",
   canSwitch = false
}) => {
   // Hooks and States
   const [cameraFace, setCameraFace] = useState(initialCameraFace);
   const device = useCameraDevice(cameraFace);

   useEffect(() => {
      setCameraFace(initialCameraFace);
   }, [initialCameraFace])

   const [zoom, setZoom] = useState(0);
   const [exosure, setExposure] = useState(0);
   const [flash, setFlash] = useState("off");
   const [torch, setTorch] = useState("off");
   const [lightIcon, setLightIcon] = useState("flash-off");

   const cameraRef = useRef(null);

   // Functions
   useEffect(() => {
      if (device?.neutralZoom) {
         setZoom(device.neutralZoom);
      }
   }, [device]);

   const handleLight = useCallback(() => {
      if (lightIcon === "flash-off") {
         // Flash Auto
         setFlash("on");
         setLightIcon("flash-auto");

      } else if (lightIcon === "flash-auto") {
         // Flash On
         setFlash("off");
         setTorch("on")
         setLightIcon("flash");
         
      } else if (lightIcon === "flash") {
         // Flash Off
         setTorch("off")
         setLightIcon("flash-off");
      }
   }, [lightIcon]);

   const handleImagePick = useCallback(async () => {
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
            allowsEditing: false,
         });

         if (!result.canceled && result.assets?.length > 0) {
            setImage(result.assets[0].uri);
            setVisible(false);
         }
      } catch (error) {
         console.error('Error picking image:', error);
      }
   }, [setImage, setVisible]);

   const handleImageTake = useCallback(async () => {
      try {
         if (!cameraRef.current) {
            console.error("Camera ref is null");
            return;
         }

         const photo = await cameraRef.current.takePhoto({
            flash: flash,
            enableShutterSound: true
         });

         const uriPath = photo.path.startsWith('file://') 
            ? photo.path 
            : `file://${photo.path}`;

         setImage(uriPath);
         setVisible(false);

      } catch (error) { 
         console.error('Error taking photo:', error);
      }
   }, [flash, setImage, setVisible]);

   const handleClose = useCallback(() => {
      setVisible(false);
      setImage(null);
   }, [setVisible, setImage]);

   const handleSwitch = useCallback(() => {
      setCameraFace(prev => prev === "back" ? "front" : "back");

      setFlash("off");
      setTorch("off");
      setLightIcon("flash-off");
   }, []);

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

   if (!device) {
      return null;
   }

   return (
      <Modal
      animationType='slide'
      // backdropColor={'#000'}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={handleClose}
      >
         {/* ------------------------------ Flash Options ----------------------------- */}
         <Header 
         hasBack
         onBack={handleClose}
         backColor='#fff'
         backgroundColor='#000'
         rightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
               <TouchableOpacity
               activeOpacity={0.8}
               onPress={() => {
                  if (cameraFace === "back") handleLight()
                  else () => {};
               }}>
                  <Icons name={lightIcon} size={24} color={'#fff'}/>
               </TouchableOpacity>
            </View>
         }
         />

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

               {canSwitch && (
                  <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSwitch}
                  style={{
                     justifyContent: 'center',
                     alignItems: 'center',
                     height: 42,
                     width: 42,
                     borderRadius: 8,
                     borderWidth: 2,
                     borderColor: '#fff',
                     position: 'absolute',
                     right: 12,
                  }}
                  >
                     <Icons name='repeat' size={32} color={'#fff'}/>
                  </TouchableOpacity>
               )}

            </View>
         </View>
      </Modal>
   )
}