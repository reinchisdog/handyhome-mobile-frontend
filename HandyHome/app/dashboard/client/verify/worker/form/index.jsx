// Screen: Application Form Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, ImageBackground, Animated, useWindowDimensions } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../../../../../lib/api';
import { useConvert } from '../../../../../../hooks/useConvert';
import { useAuth } from '../../../../../../context/AuthContext';
// ---- Other Components
import Header from '../../../../../../components/Header';
import MainButton from '../../../../../../components/MainButton';
import ErrorModal from '../../../../../../components/ErrorModal';
import FormCredentials from './step-1';
import FormWorkSamples from './step-2';
import FormServices from './step-3';
import FormSummary from './step-4';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const ApplicationForm = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {width, height} = useWindowDimensions();
   const {token} = useAuth();
   const {convertUriToFile, convertDateToFormattedDate} = useConvert();

   const [application, setApplication] = useState({
      nbi: null,
      barangay: null,
      tesda: {  // ✅ Initialize as empty object instead of null
         uri: null,
         tesda_certificate_name: "",
         tesda_certificate_number: "",
         tesda_issue_date: null,
      },
      certificates: [
         // uri: file,
         // name[]: text
         // organization[]: text,
         // date[]: Date
      ],
      primary_id: [
         // uri: file,
         // type: text
      ],
      experience: [
         // title[]: text,
         // company[]: text,
         // start_date[]: Date,
         // end[]: Date,
      ],

      work_samples: [],

      service: null,
   })
   const [submitting, setSubmitting] = useState(false);
   
   const [step, setStep] = useState(1);
   const stepTitles = [
      `Upload \nCredentials`,
      `Upload Completed \nWork Samples`,
      `Select Services \nYou Offer`,
      `Submission \nSummary`,
   ]

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const verifyStep = () => {
      if (step === 1) {
         if (!application.primary_id || application.primary_id.length !== 2) {
            throw new Error("Two (2) Primary IDs are required");
         } 

         // if (!application.nbi) {
         //    throw new Error("NBI Clearance is required");
         // }

         if (!application.barangay) {
            throw new Error("Barangay Clearance is required");
         }

         if (!application.experience || application.experience.length === 0) {
            throw new Error("At least one (1) Work Experience is required");
         } 
      } else if (step === 3) {
         if (!application.service) {
            throw new Error("A Service must be selected");
         } 
      }
   }

   const nextStep = async () => {
      try {
         if(step < 4) {
         verifyStep();
         nextAnimation();
         } else {
            // Submit Application
         }
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when proceeding to the next step. Please try again."
         setErrorMessage(message);
         setErrorModal(true);
      }
   }

   const backStep = () => {
      if(step > 1) {
         backAnimation();
      } else {
         router.back();
      }
   }

   const createForm = async () => {
      const formData = new FormData;
      // Services
      formData.append("service_id", application.service.id);
      // Single Files
      formData.append("nbi", convertUriToFile(application.nbi.uri));
      formData.append("barangay", convertUriToFile(application.barangay.uri));

      formData.append("tesda", convertUriToFile(application.tesda.uri));
      formData.append("tesda_certificate_name", application.tesda.tesda_certificate_name);
      formData.append("tesda_certificate_number", application.tesda.tesda_certificate_number);
      formData.append("tesda_issue_date", convertDateToFormattedDate(application.tesda.tesda_issue_date, "-"));
      // Multiple Files
      // ---- Valid ID
      // ------ Primary ID 1
      formData.append("primary_id_1", convertUriToFile(application.primary_id[0].uri));
      formData.append("primary_id_1_type", application.primary_id[0].type);
      // ------ Primary ID 2
      formData.append("primary_id_2", convertUriToFile(application.primary_id[1].uri));
      formData.append("primary_id_2_type", application.primary_id[1].type);
      // ---- Certificates
      for (let i = 0; i < application.certificates.length; i++) {
         formData.append("certificates", convertUriToFile(application.certificates[i].uri));
         formData.append(`certificate_name[${i}]`, application.certificates[i].name);
         formData.append(`issue_organization[${i}]`, application.certificates[i].organization);
         formData.append(`issue_date[${i}]`, convertDateToFormattedDate(application.certificates[i].date, "-"));
      }
      // ---- Experience
      for (let i = 0; i < application.experience.length; i++) {
         formData.append(`title[${i}]`, application.experience[i].title);
         formData.append(`company[${i}]`, application.experience[i].company);
         formData.append(`start_date[${i}]`, convertDateToFormattedDate(application.experience[i].start_date, "-"));
         formData.append(`end_date[${i}]`, convertDateToFormattedDate(application.experience[i].end_date, "-"));
      }
      // ---- Work Samples
      for (let i = 0; i < application.work_samples.length; i++) {
         formData.append(`work_samples`, convertUriToFile(application.work_samples[i]));
      }
      
      return formData
   }

   const printFormData = async (formData) => {
      console.log("[2] Form Structure");

      for (let [key, value] of formData.entries()) {
         if (value instanceof File) {
            console.log(`${key}: [File] name=${value.name}, type=${value.type}`);
         } else {
            console.log(`${key}: ${value}`);
         }
      }
   };

   const handleSubmit = async () => {
      try {
         setSubmitting(true);
         console.log("---- [Worker Application] Submission Attempt ----");
         console.log("[1] Creating Form");
         const form = await createForm();
         await printFormData(form);

         console.log("[3] Submitting Form");
         await api.post(`/user/upload/application`, form, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
         })

         console.log("[4] Submission Succesful, Routing to Success");
         router.replace('/dashboard/client/verify/worker/success');

      } catch (err) {
         console.log("[0] Submission Error:", err);
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when submitting your application. Please try again."
         setErrorMessage(message);
         setErrorModal(true);
      } finally {
         setSubmitting(false);
      }
   }


   // Animation
   const stepWidth = useRef(new Animated.Value(1)).current;
   const stepPercent = stepWidth.interpolate({
      inputRange: [1, 2, 3, 4],
      outputRange: ['25%', '50%', '75%', '100%'],
      extrapolate: 'clamp'
   });

   const pageOpacity = useRef(new Animated.Value(1)).current;
   
   const nextAnimation = () => {
      Animated.parallel([
         Animated.timing(stepWidth, {
            toValue: step + 1,
            duration: 300,
            useNativeDriver: false
         }),
         Animated.timing(pageOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false
         }),
      ]).start(() => {
         setStep(step + 1);

         Animated.timing(pageOpacity, {
            toValue: 1,
            delay: 150,
            duration: 150,
            useNativeDriver: false
         }).start();
      });

   }

   const backAnimation = () => {
      Animated.parallel([
         Animated.timing(stepWidth, {
            toValue: step - 1,
            duration: 300,
            useNativeDriver: false
         }),
         Animated.timing(pageOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false
         }),
      ]).start(() => {
         setStep(step - 1);

         Animated.timing(pageOpacity, {
            toValue: 1,
            delay: 150,
            duration: 150,
            useNativeDriver: false
         }).start();
      });
   }

   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         <View style={[global.screenContainer, {backgroundColor: '#fff', position: 'relative'}]}>
            <ScrollView
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
               flexGrow: 1, 
               paddingBottom: insets.bottom + 24 ,
               gap: 24,
               alignItems: 'center',
            }}>
               <View style={{width: '100%', backgroundColor: '#fff'}}>
                  <Header hasBack={true} onBack={backStep}/>
                  <View 
                  style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     gap: 24,
                     paddingHorizontal: 24,
                     paddingBottom: 4,
                     // backgroundColor: 'green',
                     borderBottomLeftRadius: 8,
                     borderBottomRightRadius: 8,
                     overflow: 'hidden',
                     position: 'relative',
                     zIndex: 4
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary,
                     }}>
                        Step {step} of 4
                     </Text>

                     <View
                     style={{
                        height: 5,
                        flexGrow: 1,
                        backgroundColor: '#E0E0E0',
                        borderRadius: 2.5,
                     }}>
                        <Animated.View 
                        style={{
                           height: '100%',
                           width: stepPercent,
                           borderRadius: 2.5,
                           backgroundColor: COLORS.primary
                        }}
                        />
                     </View>
                  </View>
                  <ImageBackground
                  source={require('../../../../../../assets/images/backgrounds/graphic-bg7.png')}
                  style={{
                     width: '100%',
                     height: 136,
                     backgroundColor: '#fff',
                     borderBottomLeftRadius: 24,
                     borderBottomRightRadius: 24,
                     overflow: 'hidden',
                  }}
                  imageStyle={{
                     resizeMode: 'cover',
                     objectFit: 'cover',

                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.xxxl,
                        color: COLORS.darkblue,
                        padding: 24
                     }}>
                        {stepTitles[step-1]}
                     </Text>
                  </ImageBackground>
               </View>
               
               <Animated.View
               style={{
                  paddingHorizontal: 24,
                  paddingBottom: insets.bottom + 80,
                  width: '100%',
                  opacity: pageOpacity,
               }}>
                  {
                     step === 1 ? (
                        <FormCredentials data={application} setData={setApplication}/>
                     ) :
                     step === 2 ? (
                        <FormWorkSamples data={application} setData={setApplication}/>
                     ) :
                     step === 3 ? (
                        <FormServices data={application} setData={setApplication}/>
                     ) :
                     step === 4 ? (
                        <FormSummary data={application}/>
                     ) :
                     null
                  }
               </Animated.View>


            </ScrollView>
            <View 
            style={[
               global.shadowBottom, {
               width: '100%',
               position: 'absolute',
               bottom: 0,
               paddingHorizontal: 24,
               paddingTop: 16,
               paddingBottom: insets.bottom + 24,
               borderTopLeftRadius: 24,
               borderTopRightRadius: 24,
               borderTopStartRadius: 24,
               borderTopEndRadius: 24,
               backgroundColor: '#fff',
               borderWidth: StyleSheet.hairlineWidth,
               borderColor: COLORS.strokes
            }]}>
               <MainButton 
               type='primary'
               text={step === 4 ? 'Submit Application' : 'Next'}
               onPress={step === 4 ? handleSubmit : nextStep}
               loading={submitting}
               />
            </View>
         </View>
      </>
   )
}

export default ApplicationForm

const styles = StyleSheet.create({})