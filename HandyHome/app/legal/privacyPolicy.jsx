// Screen: Privacy Polocy Screen - 

// React and React Native Imports
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Custom Components
import Header from '../../components/dashboard/Header';
// Styles and Icons
import Arrows from '@expo/vector-icons/Entypo';
import { globalStyles as global } from '../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../styles/constants';
// Other Libraries

const PrivacyPolicyScreen = ({handleBack}) => {
   const insets = useSafeAreaInsets();

   return (
      <View style={[global.screenContainer, {paddingBottom: insets.bottom + 24}]}>
         <Header 
         background={"#fff"}
         left={
            <TouchableOpacity
            onPress={handleBack}>
               <Arrows name='chevron-left' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
         }
         title={
            <Text style={[global.headingText, {color: COLORS.primary}]}>
               Privacy Policy
            </Text>
         }/>

         <ScrollView 
         style={{flex: 1}} 
         contentContainerStyle={styles.container}
         showsVerticalScrollIndicator={true}>
            <View style={styles.block}>
               <Text style={styles.blockBody}>
                  HandyHome values your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and disclose your information when you use our app and services.
               </Text>
            </View>

            <View style={global.divider} />

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
 
            <View style={{
               flexDirection: 'row',
               justifyContent: 'center',
               alignItems: 'center',
               marginTop: 32,
            }}>
               <View style={{flexShrink: 1, height: 1, width: '100%', backgroundColor: COLORS.strokes}} />

               <Text 
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.labels,
                  textAlign: 'center',
                  flexGrow: 1,
                  paddingHorizontal: 8
               }}>
                  End of Privacy Policy
               </Text>

               <View style={{flexShrink: 1, height: 1, width: '100%', backgroundColor: COLORS.strokes}} />
            </View>
         </ScrollView>
      </View>
   )
}

export default PrivacyPolicyScreen

const styles = StyleSheet.create({
   container: {
      padding: 24,
      gap: 20
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
      fontSize: FONT_SIZES.md,
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