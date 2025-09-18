// Context: Media Context - For Camera and General Media

// Imports
// ---- React and Expo Components
import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Linking, Modal, View, useWindowDimensions, TouchableOpacity, Animated, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
// ---- Other Components
import Header from '../components/Header';
// ---- Styles and Icons
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS } from '../styles/constants';

const MediaContext = createContext();

export const useMedia = () => useContext(MediaContext);

export const MediaProvider = ({ children }) => {
   // Hooks and States
   const [permission, requestPermission] = useCameraPermissions();
   const [returnedImage, setReturnedImage] = useState(null);

   const [cameraModal, setCameraModal] = useState(false);
   const [config, setConfig] = useState({
      hasSwitch: false,
      hasMediaPick: false,
      canEditMedia: false,
      initialCameraType: 'back'
   });

   // Functions
   const clearImage = useCallback(() => {
      setReturnedImage(null);
   }, []);

   const openCamera = useCallback(async (
      hasSwitch = false,
      hasMediaPick = false,
      initialCameraType = 'back'
   ) => {
      if (!permission?.granted) {
         const granted = await requestPermission();
         if (!granted.granted) {
            Linking.openSettings();
            return;
         }
      }
      
      setConfig(prev => ({
         ...prev,
         hasSwitch: hasSwitch,
         hasMediaPick: hasMediaPick,
         initialCameraType: initialCameraType
      }))
      setCameraModal(true);

   }, [permission, requestPermission]);

   const closeCamera = useCallback(() => {
      setReturnedImage(null);
      setCameraModal(false);
   }, [])

   const openImagePicker = async () => {
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
            allowsEditing: config.canEditMedia,
         });

         if (!result.canceled && result.assets?.length > 0) {
            setReturnedImage(result.assets[0].uri);
            if (cameraModal) {
               setCameraModal(false);
            }
         }

      } catch (err) {
         console.error('Error picking image:', err);
      }
   }

   const openDocumentPicker = async () => {
      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'avif'];

      try {
         const result = await DocumentPicker.getDocumentAsync({
            type: [
               'image/*', 
               'application/pdf', 
               'application/officedocument.wordprocessingml.document'
            ],
            multiple: false
         });

         if (result.canceled === false) {
            const extension = result.assets[0].name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
               alert('Invalid File Type');
               return;
            }
         }

         return result.assets[0];
      } catch (err) {
         console.error('File pick error: ', e);
      }
   }

   return (
      <MediaContext.Provider
      value={{
         setConfig,
         openCamera,
         closeCamera,
         openImagePicker,
         returnedImage,
         clearImage,
         openDocumentPicker,
      }}>
         <CameraScreen
         visible={cameraModal}
         setVisible={setCameraModal}
         closeCamera={closeCamera}
         setImage={setReturnedImage}
         openImagePicker={openImagePicker}
         config={config}
         />
         {children}
      </MediaContext.Provider>
   )
}

const CameraScreen = ({
   visible,
   setVisible,
   closeCamera,
   setImage,
   openImagePicker,
   config,
}) => {
   // Hooks and States
   const [facing, setFacing] = useState(config.initialCameraType);
   useEffect(() => {
      setFacing(config.initialCameraType);
   }, [config.initialCameraType]);

   const [light, setLight] = useState('flash-off')
   const [torch, setTorch] = useState(false);
   const [flash, setFlash] = useState('off');

   // Refs
   const cameraRef = useRef(null);
   
   // Functions
   const handleCaptureImage = useCallback(async () => {
      try {
         if (!cameraRef.current) {
            throw new Error('Camera ref is null');
         }

         const photo = await cameraRef.current?.takePictureAsync();
         setImage(photo?.uri);
         setVisible(false);

      } catch (err) {
         console.error('Error taking photo:', err);
      }
   }, [setImage]);

   const toggleFacing = () => {
      setFacing(prev => (prev === 'back' ? 'front' : 'back'));
   };

   const toggleLight = () => {
      if (light === 'flash-off') {
         setLight('flash-auto');
         setFlash('on');
         setTorch(false);
      } else if (light === 'flash-auto') {
         setLight('flash');
         setFlash('off');
         setTorch(true);
      } else if (light === 'flash') {
         setLight('flash-off');
         setFlash('off');
         setTorch(false)
      }
   }

   // Animation
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
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={() => {}}
      >
         <Header 
         hasBack
         onBack={closeCamera}
         backColor='#fff'
         backgroundColor='#000'
         rightIcon={
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
               <TouchableOpacity
               activeOpacity={0.8}
               onPress={
                  facing === 'back' ? toggleLight : () => {}
               }>
                  <Icons name={light} size={24} color={'#fff'}/>
               </TouchableOpacity>
            </View>
         }/>

         <CameraView
         autofocus='on'
         facing={facing}
         enableTorch={torch}
         flash={flash}
         mode='photo'
         style={{flex: 1}}
         ref={cameraRef}
         />

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
               {config.hasMediaPick &&
                  <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={openImagePicker}
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
               }

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
               onPress={handleCaptureImage}>
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

               {config.hasSwitch && 
                  <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={toggleFacing}
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
               }
            </View>
         </View>
      </Modal>
   )
}