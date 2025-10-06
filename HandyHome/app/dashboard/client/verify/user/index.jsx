// Screen: Client Verification

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Animated, useWindowDimensions, Pressable, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
// ---- Contexts
import { useClientVerification } from '../../../../../context/ClientVerificationContext';
// ---- Other Components
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
import InputCheckbox from '../../../../../components/InputCheckbox';
import InputDropdown from '../../../../../components/InputDropdown';
import InputBasic from '../../../../../components/InputBasic';
import MediaUpload from '../../../../../components/MediaUpload';
// ---- Styles and Icons
import Arrows from '@expo/vector-icons/Entypo';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const ClientVerificationScreen = () => {
   // Hooks and States
   const router = useRouter();
   const {height} = useWindowDimensions();
   const insets = useSafeAreaInsets();
   const { 
      clientVerification, 
      clearClientVerification, 
      handleClientVerification,
      verificationLoading,
      setShowErrorModal,
      setErrorMessage,
      } = useClientVerification();
   const [buttonDisabled, setButtonDisabled] = useState(false);

   const [step, setStep] = useState(1);
   const [agree, setAgree] = useState(false);

   // Functions
   const handleNext = () => {
      console.log(clientVerification);

      if (step === 2 && isIdPageEmpty()) {
         setErrorMessage("Valid ID Fields are incomplete. Please fill all the inputs to proceed.");
         setShowErrorModal(true);
      } else if (step === 3 && isSelfiePageEmpty()) {
         setErrorMessage("Selfie image is empty. Please fill all the inputs to proceed.");
         setShowErrorModal(true);
      } else if (step === 3) {
         handleClientVerification();
      } else {
         nextAnimation();
      }
   }

   const handleBack = async () => {
      if (step === 1) {
         clearClientVerification();
         router.back()
      } else {
         backAnimation();
      }
   }

   const isIdPageEmpty = () => {
      const idType = typeof clientVerification?.id_type === "string" && clientVerification.id_type.trim() !== "";
      const idNumber = typeof clientVerification?.id_number === "string" && clientVerification.id_number.trim() !== "";
      const idImage = clientVerification?.primary_id;

      return !idType || !idNumber || !idImage;
   }

   const isSelfiePageEmpty = () => {
      const selfieImage = clientVerification?.selfie;

      return !selfieImage;
   }

   // Effects
   useEffect(() => {
      if (step === 1 && agree === false) {
         setButtonDisabled(true);
      } else {
         setButtonDisabled(false);
      }

   }, [agree, clientVerification])

   // Refs
   const scrollRef = useRef();
   const progressBars = Array.from({ length: 2 }, () => useRef(new Animated.Value(0)).current)

   const pageAnimation = useRef(new Animated.Value(1)).current;
   const pageOpacity = pageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
   });

   // Animation
   const nextAnimation = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });

      Animated.timing(pageAnimation, {
         toValue: 0,
         duration: 500,
         delay: 300,
         useNativeDriver: true
      }).start(() => {
         setStep(prev => prev + 1);

         Animated.sequence([
            Animated.timing(pageAnimation, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true
            }),
            Animated.timing(progressBars[step - 1], {
               toValue: 1,
               duration: 500,
               useNativeDriver: false
            })
         ]).start();
      });
   }

   const backAnimation = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });

      Animated.timing(pageAnimation, {
         toValue: 0,
         duration: 500,
         delay: 300,
         useNativeDriver: true
      }).start(() => {
         setStep(prev => prev - 1);

         Animated.sequence([
            Animated.timing(pageAnimation, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true
            }),
            Animated.timing(progressBars[step - 2], {
               toValue: 0,
               duration: 500,
               useNativeDriver: false
            })
         ]).start();
      });
   };


   return (
      <KeyboardAwareScrollView
      style={global.screenContainer}
      contentContainerStyle={{
         minHeight: height,
         backgroundColor: COLORS.screenbg
      }}
      stickyHeaderIndices={[0]}
      ref={scrollRef}
      bottomOffset={24}
      >
         <Header 
         hasBack
         onBack={handleBack}
         title={"Account Verification"}
         backgroundColor={COLORS.screenbg}
         />
         {/* ---- Progress */}
         <View
         style={{
            paddingVertical: 24,
            paddingHorizontal: 12,
            marginBottom: 24,
            marginHorizontal: 12,
            backgroundColor: '#fff',
            borderRadius: 24,
         }}>
            {/* ---- Icons */}
            <View
            style={{
               flexDirection: 'row',
               justifyContent: 'center',
               alignItems: 'center',
               paddingHorizontal: 12,
               gap: 4,
            }}>
               <Icons 
               name='file-document' 
               size={40} 
               color={COLORS.primary}
               />

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
                  }} />
               </View>

               <Icons 
               name='card-account-details' 
               size={38} 
               color={step > 1 ? 
               COLORS.primary : COLORS.labels}
               />

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
                  }} />
               </View>

               <Icons 
               name='account-box-outline' 
               size={40} 
               color={step > 2 ? 
               COLORS.primary : COLORS.labels}
               />

            </View>
            {/* ---- Labels */}
            <View style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               alignItems: 'center',
               gap: 4
            }}>
               <Text
               style={[
                  styles.progressTitle, {
                  color: COLORS.lettersicons
               }]}>
                  Agreement
               </Text>
               <Text
               style={[
                  styles.progressTitle, {
                  color: COLORS.lettersicons
               }]}>
                  Valid ID
               </Text>
               <Text
               style={[
                  styles.progressTitle, {
                  color: COLORS.lettersicons
               }]}>
                  Photo
               </Text>
            </View>
         </View>

         <View
         style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: 12,
            marginHorizontal: 12,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'space-between'
         }}>
            {/* ---- Content */}
            <Animated.View style={{opacity: pageOpacity, width: '100%', flex: 1}}>
               {step === 1 && <AgreementPage agree={agree} setAgree={setAgree}/>}
               {step === 2 && <ValidIdPage />}
               {step === 3 && <SelfiePage />}
            </Animated.View>
            {/* ---- Button */}
            <View
            style={{ paddingBottom: insets.bottom + 24, width: '100%'}}>
               <MainButton 
               type='primary'
               text={step === 3 ? "Submit" : "Next"}
               disabled={buttonDisabled}
               loading={verificationLoading}
               onPress={handleNext}
               />
            </View>
         </View>

      </KeyboardAwareScrollView>
   )
}

export default ClientVerificationScreen

const AgreementPage = ({agree, setAgree}) => {
   return (
      <View style={{ gap: 24, paddingTop: 12, paddingBottom: 24}}>
         {/* ---- Terms and Condition */}
         <View style={{ gap: 20 }}>
            <Text
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.lg,
               color: COLORS.primary,
               textAlign: 'center'
            }}>
               Terms and Conditions
            </Text>

            <View style={styles.container}>
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     1. Introduction
                  </Text>
                  <Text style={styles.blockBody}>
                     HandyHome is a mobile platform designed to match clients with qualified and verified home service providers (“workers”). The app also offers tools for workforce coordination and service booking management. HandyHome acts solely as a facilitator between clients and workers and does not directly provide home services.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     2. User Eligibility
                  </Text>
                  <Text style={styles.blockBody}>
                     To register and use HandyHome, you must be at least 18 years old. By creating an account, you affirm that all information provided during registration is truthful, complete, and current. Misrepresentation of identity, age, or qualifications may result in suspension or termination of your account.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     3. Account Creation and Verification
                  </Text>
                  <Text style={styles.blockBody}>
                     Account security and verification are critical to ensure a safe user environment. Clients are required to submit a valid government-issued ID and a real-time selfie for identity verification. Workers, on the other hand, must undergo a skill verification process and submit relevant certifications or credentials. HandyHome reserves the right to approve, reject, or deactivate accounts based on compliance with these verification requirements.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     4. Service Booking Process
                  </Text>
                  <Text style={styles.blockBody}>
                     Clients can browse a range of home services, post service requests, and upload photos or videos for clarity. Once a request is submitted, available and qualified workers within the client’s location will receive job notifications. Bookings are accepted on a first-come, first-served basis to ensure fairness and responsiveness. Once a worker accepts the job, both parties will receive booking confirmation details, including service scope, schedule, and estimated fees. Clients are encouraged to provide accurate service descriptions to avoid disputes or incomplete job execution.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     5. Pricing and Payment
                  </Text>
                  <Text style={styles.blockBody}>
                     All service fees are transparently displayed before booking confirmation. HandyHome facilitates payment transactions through secure third-party payment gateways, such as PayMongo with GCash integration. Clients authorize HandyHome to process payments on their behalf at the time of booking. Funds are held securely by the platform until the completion of the service, after which the worker receives their payment minus HandyHome’s platform fee. HandyHome does not store any card or banking information.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     6. Cancellation and Refunds
                  </Text>
                  <Text style={styles.blockBody}>
                     {`Clients may cancel service bookings free of charge within the allowed cancellation window, typically two hours after booking or at least one hour before the scheduled service time. Workers are also expected to notify the client promptly in case of cancellation or unforeseen absence.\n\nLate cancellations by either party may incur cancellation fees, as outlined in HandyHome’s Cancellation Policy. Refund requests, if applicable, will be reviewed on a case-by-case basis and processed according to the timeline of our payment partner.
                     `}
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     7. Ratings and Reviews
                  </Text>
                  <Text style={styles.blockBody}>
                     To promote service quality, only clients with completed transactions are allowed to leave ratings and written reviews of workers. HandyHome monitors all submitted feedback and reserves the right to remove reviews that contain abusive language, false claims, or spam.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     8. User Conduct and Prohibited Activities
                  </Text>
                  <Text style={styles.blockBody}>
                     Users of HandyHome agree to engage responsibly on the platform. The following actions are strictly prohibited:
                  </Text>
   
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Submitting false or misleading information.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Engaging in harassment, discrimination, or abusive behavior.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Circumventing the platform by soliciting off-app transactions.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Attempting to hack, reverse-engineer, or disrupt HandyHome systems.
                     </Text>
                  </View>
   
                  <Text style={styles.blockBody}>
                     Violations may lead to temporary suspension, permanent account termination, or legal action.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     9. Limitation of Liability
                  </Text>
                  <Text style={styles.blockBody}>
                     {`HandyHome is a technology platform that connects clients with independent service providers. As such, HandyHome is not responsible for the conduct, performance, or quality of services delivered by workers.\n\nBy using the app, you acknowledge that HandyHome is not liable for damages, injuries, losses, or disputes arising from service transactions. Users are encouraged to communicate clearly and report any incidents to our support team for investigation.`}
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     10. Intellectual Property Rights
                  </Text>
                  <Text style={styles.blockBody}>
                     All content, features, branding, and platform design are the exclusive intellectual property of HandyHome. Unauthorized copying, reproduction, or use of any part of the platform is strictly prohibited.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     11. Termination of Service
                  </Text>
                  <Text style={styles.blockBody}>
                     HandyHome reserves the right to suspend or terminate user accounts that violate these Terms or compromise the safety and integrity of the platform. Users may also request voluntary account deactivation by contacting our support team.
                  </Text>
               </View>
               
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     12. Dispute Resolution
                  </Text>
                  <Text style={styles.blockBody}>
                     We encourage users to resolve any disputes through direct communication and our in-app resolution channels. If a resolution cannot be reached, disputes shall be subject to arbitration under the laws of Marikina City's Jurisdriction.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     13. Update to Terms
                  </Text>
                  <Text style={styles.blockBody}>
                     HandyHome may update these Terms and Conditions periodically. Users will be notified of significant changes through in-app notifications or email. Continued use of the platform after changes implies acceptance of the updated Terms.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     14. Contact Us
                  </Text>
                  <Text style={styles.blockBody}>
                     For inquiries, concerns, or support, please contact us at: <Text style={{color: COLORS.accent, fontStyle: 'italic'}}>
                        info.handyhome25@gmail.com
                        </Text>
                  </Text>
               </View>
            </View>
         </View>

         <View style={[global.divider, {backgroundColor: COLORS.strokes, paddingHorizontal: 24}]}/>

         {/* ---- Privacy Policy */}
         <View style={{ gap: 20 }}>
            <Text
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.lg,
               color: COLORS.primary,
               textAlign: 'center'
            }}>
               Privacy Policy
            </Text>

            <View style={styles.container}>
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     1. Information We Collect
                  </Text>
                  <Text style={styles.blockBody}>
                     We collect the following types of information:
                  </Text>

                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>a.</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, textAlign: 'left'}]}>
                        <Text style={{color: COLORS.accent}}>Personal Information: </Text>
                        This includes your name, address, phone number, email, government-issued ID, and selfies for verification.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>b.</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, textAlign: 'left'}]}>
                        <Text style={{color: COLORS.accent}}>Service-Related Date: </Text>
                        Details about your bookings, service preferences, and any media (photos or videos) you upload related to service requests.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>c.</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, textAlign: 'left'}]}>
                        <Text style={{color: COLORS.accent}}>Payment Information: </Text>
                        We collect transaction-related details like amount paid and payment status. However, we do not store your credit card or banking details.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>d.</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, textAlign: 'left'}]}>
                        <Text style={{color: COLORS.accent}}>Usage Data: </Text>
                        We collect device information, log data, and usage patterns to improve platform performance and security.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>e.</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, textAlign: 'left'}]}>
                        <Text style={{color: COLORS.accent}}>Location Data: </Text>
                        We may collect your approximate location to match you with nearby service providers.
                     </Text>
                  </View>


                  <Text style={styles.blockBody}>
                     Violations may lead to temporary suspension, permanent account termination, or legal action.
                  </Text>
               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     2. How We Use Your Information
                  </Text>
                  <Text style={styles.blockBody}>
                     HandyHome uses your information for the following purposes:
                  </Text>

                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To verify your identity and prevent fraudulent activities.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To facilitate and manage service bookings.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To process payments securely.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To provide customer support.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To monitor platform performance and conduct analytics.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To send important notifications about your bookings.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        To comply with legal obligations.
                     </Text>
                  </View>

               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     3. Data Security Measures
                  </Text>
                  <Text style={styles.blockBody}>
                     We implement robust security measures to protect your data, including:
                  </Text>

                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Encrypted communication protocols (TLS/SSL).
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Token-based session management.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Rate limiting and suspicious activity monitoring.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Encrypted storage for sensitive files (like IDs and selfies).
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        Limited access controls for employee data handling.
                     </Text>
                  </View>

                  <Text style={styles.blockBody}>
                     Despite our efforts, no system can be 100% secure. Users are encouraged to use strong passwords and update them regularly.
                  </Text>
               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     4. Sharing and Disclosure of Information
                  </Text>
                  <Text style={styles.blockBody}>
                     We only share your data under the following circumstances:
                  </Text>

                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     With workers (for confirmed bookings).
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        With payment processing partners for transaction completion.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        With third-party service providers for app maintenance and analytics.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                        With law enforcement agencies if required by law.
                     </Text>
                  </View>

                  <Text style={styles.blockBody}>
                     HandyHome does not sell or rent your personal information to advertisers or other third parties.
                  </Text>
               </View>
         
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     5. Your Data Rights
                  </Text>
                  <Text style={styles.blockBody}>
                     You have the right to:
                  </Text>

                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     Access the personal data we hold about you.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     Request corrections to inaccurate information.
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     Request deletion of your personal data (subject to regulatory retention requirements).
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     Object to certain types of processing (e.g., marketing communications).
                     </Text>
                  </View>
                  <View style={styles.bulletItem}>
                     <Text style={[styles.blockBody, {color: COLORS.accent}]}>{`\u25cf`}</Text>
                     <Text style={[styles.blockBody, {color: COLORS.lettersicons, fontStyle: 'italic', textAlign: 'left'}]}>
                     Request a copy of your data in a portable format.
                     </Text>
                  </View>

                  <Text style={styles.blockBody}>
                     To exercise your rights, contact our Data Protection Officer at <Text style={{color: COLORS.accent, fontStyle: 'italic'}}>
                        info.handyhome25@gmail.com
                     </Text>
                  </Text>
               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     6. Data Retention
                  </Text>
                  <Text style={styles.blockBody}>
                  We retain your information only as long as necessary for the purposes outlined in this policy or as required by law. When your account is deleted, we securely erase your personal data, except for records needed to comply with legal or financial obligations.
                  </Text>
               </View>
   
               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     7. Cookies and Tracking Technologies
                  </Text>
                  <Text style={styles.blockBody}>
                  We use cookies and similar technologies to analyze user behavior, enhance app performance, and personalize user experience. Users may control cookie settings via their device preferences.
                  </Text>
               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     8. Changes to This Privacy Policy
                  </Text>
                  <Text style={styles.blockBody}>
                  We may update this Privacy Policy to reflect changes in technology, laws, or our business operations. Users will be notified of significant changes, and continued use of the app implies agreement with the revised policy.
                  </Text>
               </View>

               <View style={styles.block}>
                  <Text style={styles.blockTitle}>
                     9. Contact Information
                  </Text>
                  <Text style={styles.blockBody}>
                  For privacy-related inquiries, please contact: <Text style={{color: COLORS.accent, fontStyle: 'italic'}}>info.handyhome25@gmail.com</Text>
                  </Text>
               </View>
            </View>
         </View>

         <View style={[global.divider, {backgroundColor: COLORS.strokes, paddingHorizontal: 24}]}/>
         
         {/* ---- Agreement */}
         <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 6}}>
            <InputCheckbox onPress={() => setAgree(!agree)} value={agree}/>
            <Pressable onPress={() => setAgree(!agree)} style={{flexShrink: 1}}>
               <Text style={[styles.agreementDesc, {fontStyle: 'italic'}]}>
                  By continuing, I confirm that I have read and agree to the Terms and Conditions and the Privacy Policy.
               </Text>
            </Pressable>
         </View>

      </View>
   );
};

const ValidIdPage = () => {
   const {clientVerification, setClientVerification} = useClientVerification();
   const idTypes = [
      {title: "UMID", value: "UMID"},
      {title: "Driver's License", value: "Driver's License"},
      {title: "PRC ID", value: "PRC ID"},
      {title: "Passport", value: "Passport"},
      {title: "SSS ID", value: "SSS ID"},
      {title: "National ID", value: "National ID"},
   ]   

   return (
      <View style={{ gap: 24, paddingTop: 12, paddingBottom: 24}}>
         <View style={{alignItems: 'center', gap: 12}}>
            <Image 
            source={require(`../../../../../assets/images/illustrations/Photo-Guide-1.png`)}
            style={{
               width: 148,
               height: 148,
               aspectRatio: 1/1,
            }}/>
            <Text
            style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons,
               textAlign: 'justify',
               padding: 12,
               width: '100%',
               backgroundColor: COLORS.secondary,
               borderRadius: 10,
            }}>
               <Text style={{fontFamily: FONTS.roboto700}}>NOTE: </Text>Please select a valid government-issued ID from the dropdown below. Ensure your ID is clear, unexpired, and all text is readable for faster verification.
            </Text>
         </View>

         <View style={{alignItems: 'center', gap: 12}}>
            <InputDropdown 
            placeholder='Type of ID'
            items={idTypes}
            onSelect={(e) => setClientVerification(prev => ({
               ...prev,
               id_type: e.value
            }))}
            selectedItem={clientVerification.id_type}
            />

            <InputBasic 
            placeholder='ID Number'
            onChangeText={(e) => setClientVerification(prev => ({
               ...prev,
               id_number: e
            }))}
            value={clientVerification.id_number}
            floatLabel={false}
            />

            <MediaUpload 
            maxMedia={1}
            data={clientVerification.primary_id}
            dataName={"primary_id"}
            setData={setClientVerification}
            canSwitch
            />

         </View>
      </View>
   );
};

const SelfiePage = () => {
   const {clientVerification, setClientVerification} = useClientVerification();

   return (
      <View style={{ gap: 24, paddingTop: 12, paddingBottom: 24}}>
         <View style={{alignItems: 'center', gap: 12}}>
            <Image 
            source={require(`../../../../../assets/images/illustrations/Photo-Guide-2.png`)}
            style={{
               width: 148,
               height: 148,
               aspectRatio: 1/1,
            }}/>
            <Text
            style={{
               fontFamily: FONTS.roboto400,
               fontSize: FONT_SIZES.sm,
               color: COLORS.lettersicons,
               textAlign: 'justify',
               padding: 12,
               width: '100%',
               backgroundColor: COLORS.secondary,
               borderRadius: 10,
            }}>
               <Text style={{fontFamily: FONTS.roboto700}}>NOTE: </Text>Please take a clear selfie in a well-lit place. Make sure your face is fully visible (no masks, hats, or sunglasses). This will be used only to verify your identity and keep your account secure.
            </Text>
         </View>

         <MediaUpload 
         maxMedia={1}
         data={clientVerification.selfie}
         dataName={"selfie"}
         setData={setClientVerification}
         setCameraFace='front'
         />
      </View>
   );
};

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
   container: {
      paddingHorizontal: 12,
      gap: 12
   },
   block: {
      gap: 4,
   },
   blockTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.primary,
      textTransform: 'capitalize',
   },
   blockBody: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      textAlign: 'justify',
   },
   bulletItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingLeft: 8,
      paddingRight: 16
   }
})