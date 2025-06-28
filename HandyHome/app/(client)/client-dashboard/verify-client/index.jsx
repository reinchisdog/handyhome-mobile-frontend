import { StyleSheet, ScrollView, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, useWindowDimensions, Animated, ImageBackground, Linking, Image } from 'react-native'
import { useRouter } from 'expo-router';
import React, {useState, useRef, useEffect} from 'react'
import { useClientVerification } from '../../../../context/ClientVerificationContext';
import { useCameraPermission } from 'react-native-vision-camera'

import Header from '../../../../components/dashboard/Header';
import Checkbox from '../../../../components/authentication/Checkbox';
import DropdownBox from '../../../../components/authentication/DropdownBox';
import CameraScreen from '../../../../components/CameraScreen';
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const ClientVerifyScreen = () => {
   const router = useRouter();
   const {width} = useWindowDimensions();

   const { setClientVerification } = useClientVerification();

   const scrollRef = useRef();

   const [currStep, setCurrStep] = useState(0);
   const pageScrollX = useRef(new Animated.Value(0)).current;

   const TOTAL_STEPS = 3
   const progressBars = Array.from({ length: TOTAL_STEPS - 1 }, () => useRef(new Animated.Value(0)).current)
   const [iconColors, setIconColors] = useState(Array(TOTAL_STEPS).fill(COLORS.lettersicons));

   const submitData = async () => {
      if (!idType || !idImage || !clientImage) return;

      console.log("Submitting");
      const idImageBlob = await fetch(idImage).then(res => res.blob());
      const clientImageBlob = await fetch(clientImage).then(res => res.blob());

      setClientVerification({
         validIdType: idType.value,
         validIdImage: idImageBlob,
         clientImage: clientImageBlob
      })
      router.replace('client-dashboard/verify-client/confirming')
   }

   const handleNext = () => {
      if (currStep >= TOTAL_STEPS - 1) {
         submitData();
         return;
      }

      scrollRef.current?.scrollTo({ y: 0, animated: true });

      setTimeout(() => {
         Animated.timing(pageScrollX, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true
         }).start(() => {
            pageScrollX.setValue(width);
            setCurrStep(prev => prev + 1);

            Animated.timing(pageScrollX, {
               toValue: 0,
               duration: 300,
               useNativeDriver: true
            }).start();
         })

         Animated.timing(progressBars[currStep], {
         toValue: 1,
         duration: 600,
         useNativeDriver: false
         }).start(() => {
         const updatedColors = [...iconColors];
         updatedColors[currStep + 1] = COLORS.primary;
         setIconColors(updatedColors);
         setCurrStep(currStep + 1);
         });
      }, 300)
   };
   
   const [agree, setAgree] = useState(false);
   const [idType, setIdType] = useState(null);
   const [idImage, setIdImage] = useState(null);
   const [clientImage, setClientImage] = useState(null);

   const { hasPermission, requestPermission } = useCameraPermission()

   const handleImageShow = async () => {
      if (!hasPermission) {
         const granted = await requestPermission();
         if (!granted){
            Linking.openSettings();
         }
      } else {
         setShowCamera(true);
      }

      
   };

   const [showCamera, setShowCamera] = useState(false)

   return (
      <>
         {(showCamera) ? 
         <CameraScreen 
         setShowCamera={setShowCamera}
         setImage={(currStep === 1)? setIdImage : setClientImage}
         cameraFace={(currStep === 1)? "back" : "front"}/> : 
         <></>
         }
         
         <View 
         style={[
            global.screenContainer, {
            backgroundColor: '#fff'
         }]}>

            {/* --------------------------------- Header --------------------------------- */}
            <Header 
            background='#fff'
            left={
            <TouchableOpacity
            onPress={() => router.back()}
            >
               <Arrows name={"chevron-left"} size={24} color={COLORS.primary} />
            </TouchableOpacity>}
            title={
               <Text 
               numberOfLines={1}
               style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.xl,
                     color: COLORS.darkblue,
                     flexShrink: 1
               }}
               >
                     {"Account Verification"}
               </Text>
            }
            />

            {/* --------------------------------- Content -------------------------------- */}
            <ScrollView
            ref={scrollRef}
            style={{flex: 1, position: 'relative', paddingHorizontal: 2,}}
            contentContainerStyle={{gap: 24, paddingBottom: 24}}>
               {/* -------- Progress */}
               <View style={{ paddingVertical: 50, paddingHorizontal: 24, paddingBottom: 26,gap: 8}}>
                  {/* ---- Icons */}
                  <View
                  style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     paddingHorizontal: 12,
                     gap: 4
                  }}>
                     <Icons name='file-document' size={40} color={COLORS.primary}/>
                     <View style={styles.progressBar}>
                        <Animated.View 
                        style={{
                           backgroundColor: COLORS.lightblue,
                           height: 2,
                           borderRadius: 1,
                           width: progressBars[0].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                              extrapolate: 'clamp'
                           })
                        }}
                        />
                     </View>
                     <Icons name='card-account-details' size={40} color={iconColors[1]}/>
                     <View style={styles.progressBar}>
                        <Animated.View 
                        style={{
                           backgroundColor: COLORS.lightblue,
                           height: 2,
                           borderRadius: 1,
                           width: progressBars[1].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                              extrapolate: 'clamp'
                           })
                        }}
                        />
                     </View>
                     <Icons name='account-box-outline' size={40} color={iconColors[2]}/>
                  </View>
                  {/* ---- Titles */}
                  <View
                  style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     gap: 4
                  }}>
                     <Text style={[styles.progressTitle, {color: COLORS.lettersicons}]}>Agreement</Text>
                     <Animated.Text style={[styles.progressTitle, {color: COLORS.lettersicons}]}>Valid ID</Animated.Text>
                     <Animated.Text style={[styles.progressTitle, {color: COLORS.lettersicons}]}>Photo</Animated.Text>
                  </View>
               </View>

               {/* -------- Content */}
               <Animated.View style={{
                  transform: [{translateX: pageScrollX}],
                  width: '100%',
               }}>
                  {currStep === 0 && <AgreementContent agree={agree} setAgree={setAgree}/>}
                  {currStep === 1 && (
                     <IdCardContent 
                     idType={idType} 
                     setIdType={setIdType} 
                     image={idImage} 
                     setImage={setIdImage}
                     onImageSelect={handleImageShow}/>
                  )}
                  {currStep === 2 && 
                     <ClientImageContent 
                     image={clientImage} 
                     setImage={setClientImage}
                     onImageSelect={handleImageShow}/>
                  }
               </Animated.View>
               
            </ScrollView>

            {/* -------- Button */}
            <View style={[global.buttonsContainer, {backgroundColor: '#fff'}]}>
               <TouchableHighlight style={global.primaryBtn}
                  underlayColor='#0072bc'
                  onPress={handleNext}>
                     <Text style={global.primaryBtnText}>Next Step</Text>
               </TouchableHighlight>
            </View>
            
         </View>
      </>
   )
}

const AgreementContent = ({agree, setAgree}) => {
   return (
      <View 
      style={{
         gap: 24,
         // paddingBottom: 24,
         paddingHorizontal: 24,
         // transform: [{translateX: pageScrollX}]
      }}>

         {/* -------------------------- Terms and Conditions -------------------------- */}
         <View style={styles.agreementCont}>
            <Text style={styles.agreementHeader}>TERMS AND CONDITION</Text>
            <View style={styles.agreementDescCont}>
               <Text style={styles.agreementDesc}>
                  {'\u2022'} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deleniti reprehenderit, odio explicabo quibusdam reiciendis inventore nesciunt ipsa optio, laudantium expedita! Reprehenderit natus dolor veniam ratione a aut culpa atque.
                  Voluptatum dolor eaque quibusdam ipsam odio, libero soluta officia laudantium velit cumque corporis animi error tenetur, dolores obcaecati maxime ex sequi porro molestias! Vero atque repellat laudantium tenetur nobis earum.
                  Voluptatibus iure in eos, rerum debitis praesentium repudiandae architecto. Quod aspernatur ad itaque dolor fugiat et, quis corrupti aperiam quae magni ratione cupiditate, ipsam quidem iure voluptatum alias vero minima.
                  Natus laboriosam debitis blanditiis animi? Voluptates ipsum et porro voluptas ullam nihil blanditiis deleniti quo in delectus tempore veniam, animi culpa odit totam expedita pariatur libero adipisci dolorem non aperiam?
               </Text>
               <Text style={styles.agreementDesc}>
                  {'\u2022'} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deleniti reprehenderit, odio explicabo quibusdam reiciendis inventore nesciunt ipsa optio, laudantium expedita! Reprehenderit natus dolor veniam ratione a aut culpa atque.
                  Voluptatum dolor eaque quibusdam ipsam odio, libero soluta officia laudantium velit cumque corporis animi error tenetur, dolores obcaecati maxime ex sequi porro molestias! Vero atque repellat laudantium tenetur nobis earum.
                  Voluptatibus iure in eos, rerum debitis praesentium repudiandae architecto. Quod aspernatur ad itaque dolor fugiat et, quis corrupti aperiam quae magni ratione cupiditate, ipsam quidem iure voluptatum alias vero minima.
                  Natus laboriosam debitis blanditiis animi? Voluptates ipsum et porro voluptas ullam nihil blanditiis deleniti quo in delectus tempore veniam, animi culpa odit totam expedita pariatur libero adipisci dolorem non aperiam?
               </Text>
            </View>
         </View>

         {/* ----------------------------- Privacy Policy ----------------------------- */}
         <View style={styles.agreementCont}>
            <Text style={styles.agreementHeader}>PRIVACY POLICY</Text>
            <View style={styles.agreementDescCont}>
               <Text style={styles.agreementDesc}>
                  {'\u2022'} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deleniti reprehenderit, odio explicabo quibusdam reiciendis inventore nesciunt ipsa optio, laudantium expedita! Reprehenderit natus dolor veniam ratione a aut culpa atque.
                  Voluptatum dolor eaque quibusdam ipsam odio, libero soluta officia laudantium velit cumque corporis animi error tenetur, dolores obcaecati maxime ex sequi porro molestias! Vero atque repellat laudantium tenetur nobis earum.
                  Voluptatibus iure in eos, rerum debitis praesentium repudiandae architecto. Quod aspernatur ad itaque dolor fugiat et, quis corrupti aperiam quae magni ratione cupiditate, ipsam quidem iure voluptatum alias vero minima.
                  Natus laboriosam debitis blanditiis animi? Voluptates ipsum et porro voluptas ullam nihil blanditiis deleniti quo in delectus tempore veniam, animi culpa odit totam expedita pariatur libero adipisci dolorem non aperiam?
               </Text>
               <Text style={styles.agreementDesc}>
                  {'\u2022'} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deleniti reprehenderit, odio explicabo quibusdam reiciendis inventore nesciunt ipsa optio, laudantium expedita! Reprehenderit natus dolor veniam ratione a aut culpa atque.
                  Voluptatum dolor eaque quibusdam ipsam odio, libero soluta officia laudantium velit cumque corporis animi error tenetur, dolores obcaecati maxime ex sequi porro molestias! Vero atque repellat laudantium tenetur nobis earum.
                  Voluptatibus iure in eos, rerum debitis praesentium repudiandae architecto. Quod aspernatur ad itaque dolor fugiat et, quis corrupti aperiam quae magni ratione cupiditate, ipsam quidem iure voluptatum alias vero minima.
                  Natus laboriosam debitis blanditiis animi? Voluptates ipsum et porro voluptas ullam nihil blanditiis deleniti quo in delectus tempore veniam, animi culpa odit totam expedita pariatur libero adipisci dolorem non aperiam?
               </Text>
            </View>
         </View>

         {/* ----------------------------- Agree Condition ---------------------------- */}
         <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <Checkbox onPress={() => setAgree(!agree)} value={agree}/>
            <TouchableWithoutFeedback onPress={() => setAgree(!agree)}>
               <Text style={[styles.agreementDesc, {flexShrink: 1, fontStyle: 'italic'}]}>
                  By continuing, I confirm that I have read and agree to the Terms and Conditions and the Privacy Policy.
               </Text>
            </TouchableWithoutFeedback>
            
         </View>
      </View >
   )
}

const IdCardContent = ({idType, setIdType, image, setImage, onImageSelect}) => {
   const idTypes = [
      {
         value: "UMID",
         title: "UMID"
      },
      {
         value: "Driver's License",
         title: "Driver's License"
      },
      {
         value: "Passport",
         title: "Passport"
      },
      {
         value: "National ID",
         title: "National ID"
      },
   ]

   return (
      <View 
      style={{
         gap: 24,
         // paddingBottom: 24,
         paddingHorizontal: 24,
         // transform: [{translateX: pageScrollX}]
      }}>
         {/* -------- Illustration */}
         <Image 
         source={require('../../../../assets/images/illustrations/Photo-Guide-1.png')}
         style={styles.illustrationCont} />

         {/* -------- Note */}
         <View style={styles.noteCont}>
            <Text style={styles.noteText}>
               <Text style={{fontFamily: FONTS.roboto700}}>NOTE: </Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </Text>
         </View>

         {/* -------- Inputs */}
         <View style={{gap: 16}}>
            <DropdownBox 
            defaultItem = 'Type of ID'
            items = {idTypes}
            onSelect = {(e) => setIdType(e)}
            selectedItem = {idType}
            />

            <TouchableOpacity
            activeOpacity={0.9}
            onPress={
               (image) ? 
               () => {console.log("Has Image")} :
               onImageSelect
            }
            >
               <ImageBackground
               source={{uri: image}}
               style={styles.imageContainer}
               imageStyle={styles.imageUpload}>
                  {(image) ? 
                     <TouchableOpacity
                     style={styles.imageDelete}
                     onPress={() => {setImage(null); console.log("Deleted Image")}}
                     >
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

const ClientImageContent = ({image, setImage, onImageSelect}) => {

   return (
      <View 
      style={{
         gap: 24,
         // paddingBottom: 24,
         paddingHorizontal: 24,
         // transform: [{translateX: pageScrollX}]
      }}>
         {/* -------- Illustration */}
         <Image 
         source={require('../../../../assets/images/illustrations/Photo-Guide-2.png')}
         style={styles.illustrationCont} />

         {/* -------- Note */}
         <View style={styles.noteCont}>
            <Text style={styles.noteText}>
               <Text style={{fontFamily: FONTS.roboto700}}>NOTE: </Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </Text>
         </View>

         {/* -------- Inputs */}
         <View style={{gap: 16}}>
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={
               (image) ? 
               () => {console.log("Has Image")} :
               onImageSelect
            }
            >
               <ImageBackground
               source={{uri: image}}
               style={styles.imageContainer}
               imageStyle={styles.imageUpload}>
                  {(image) ? 
                     <TouchableOpacity
                     style={styles.imageDelete}
                     onPress={() => {setImage(null); console.log("Deleted Image")}}
                     >
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

export default ClientVerifyScreen

const styles = StyleSheet.create({
   progressBar: {
      flexGrow: 1,
      height: 2,
      borderRadius: 1,
      backgroundColor: COLORS.strokes,
      alignItems: 'flex-start'
   },
   progressTitle: {
      width: 64,
      textAlign: 'center',
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.sm,
   },
   agreementCont: {
      gap: 12
   },
   agreementHeader: {
      width: '100%',
      textAlign: 'center',
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.primary
   },
   agreementDescCont: {
      gap: 4
   },
   agreementDesc: {
      textAlign: 'justify',
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons
   },
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