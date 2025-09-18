// Screem: Terms and Conditions in Profile Settings

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Pressable, ScrollView, FlatList } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../components/Header';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const ProfileTerms = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   return (
      <ScrollView
      stickyHeaderIndices={[0]}
      style={[global.screenContainer]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24}}
      >
         <Header hasBack={true} backColor='#fff' title="Terms & Conditions" textColor='#fff' backgroundColor={COLORS.primary}/>

         <View style={{ paddingHorizontal: 12, paddingVertical: 24, gap: 24 }}>
            <View style={[styles.container, {paddingVertical: 24}]}>
               <View style={{gap: 12}}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.lg,
                     color: COLORS.primary,
                     textAlign: 'center',
                  }}>
                     Welcome to HandyHome!
                  </Text>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels,
                     textAlign: 'justify',
                     paddingHorizontal: 6
                  }}>
                     By accessing and using our mobile application and services, you agree to comply with the following Terms and Conditions. These terms govern your rights, responsibilities, and interactions on our platform. Please read them carefully.
                  </Text>
               </View>

               <View style={global.divider}/>
               
               <View style={{gap: 24}}>
                  <View style={styles.block}>
                     <Text style={styles.blockTitle}>
                        1. Introduction
                     </Text>
                     <Text style={styles.blockBody}>
                        HandyHome is a mobile platform designed to match clients with qualified and verified home service providers ("workers"). The app also offers tools for workforce coordination and service booking management. HandyHome acts solely as a facilitator between clients and workers and does not directly provide home services.
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
                        Clients can browse a range of home services, post service requests, and upload photos or videos for clarity. Once a request is submitted, available and qualified workers within the client's location will receive job notifications. Bookings are accepted on a first-come, first-served basis to ensure fairness and responsiveness. Once a worker accepts the job, both parties will receive booking confirmation details, including service scope, schedule, and estimated fees. Clients are encouraged to provide accurate service descriptions to avoid disputes or incomplete job execution.
                     </Text>
                  </View>
      
                  <View style={styles.block}>
                     <Text style={styles.blockTitle}>
                        5. Pricing and Payment
                     </Text>
                     <Text style={styles.blockBody}>
                        All service fees are transparently displayed before booking confirmation. HandyHome facilitates payment transactions through secure third-party payment gateways, such as PayMongo with GCash integration. Clients authorize HandyHome to process payments on their behalf at the time of booking. Funds are held securely by the platform until the completion of the service, after which the worker receives their payment minus HandyHome's platform fee. HandyHome does not store any card or banking information.
                     </Text>
                  </View>
      
                  <View style={styles.block}>
                     <Text style={styles.blockTitle}>
                        6. Cancellation and Refunds
                     </Text>
                     <Text style={styles.blockBody}>
                        Clients may cancel service bookings free of charge within the allowed cancellation window, typically two hours after booking or at least one hour before the scheduled service time. Workers are also expected to notify the client promptly in case of cancellation or unforeseen absence.
                     </Text>
                     <Text style={styles.blockBody}>
                        Late cancellations by either party may incur cancellation fees, as outlined in HandyHome's Cancellation Policy. Refund requests, if applicable, will be reviewed on a case-by-case basis and processed according to the timeline of our payment partner.
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
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Submitting false or misleading information.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Engaging in harassment, discrimination, or abusive behavior.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Circumventing the platform by soliciting off-app transactions.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
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
                        HandyHome is a technology platform that connects clients with independent service providers. As such, HandyHome is not responsible for the conduct, performance, or quality of services delivered by workers.
                     </Text>
                     <Text style={styles.blockBody}>
                        By using the app, you acknowledge that HandyHome is not liable for damages, injuries, losses, or disputes arising from service transactions. Users are encouraged to communicate clearly and report any incidents to our support team for investigation.
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
                        We encourage users to resolve any disputes through direct communication and our in-app resolution channels. If a resolution cannot be reached, disputes shall be subject to arbitration under the laws of Marikina City's Jurisdiction.
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

               <View style={global.divider}/>
            </View>
         </View>
      </ScrollView>
   )
}

export default ProfileTerms

const styles = StyleSheet.create({
   container: {
      padding: 12,
      gap: 24,
      borderRadius: 20,
      backgroundColor: '#fff'
   },
   block: {
      // gap: 8,
   },
   blockTitle: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.primary,
      textTransform: 'capitalize',
      marginBottom: 4,
   },
   blockBody: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      textAlign: 'justify',
      paddingHorizontal: 8,
      marginBottom: 8,
   },
   // Regular bullet items (•)
   bulletItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingLeft: 16,
      paddingRight: 12,
      marginBottom: 6,
   },
   bullet: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.accent,
      width: 16,
      textAlign: 'center',
      lineHeight: 20,
   },
   // Bullet text style
   bulletText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      textAlign: 'left',
      flexShrink: 1,
      lineHeight: 20,
   },
})