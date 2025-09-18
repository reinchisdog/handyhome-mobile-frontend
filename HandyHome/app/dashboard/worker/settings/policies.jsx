// Screem: Privacy Policies in Profile Settings

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

const ProfilePolicies = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   return (
      <ScrollView
      stickyHeaderIndices={[0]}
      style={[global.screenContainer]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24}}
      >
         <Header hasBack={true} backColor='#fff' title="Privacy Policy" textColor='#fff' backgroundColor={COLORS.primary}/>

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
                     We value your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and disclose your information when you use our app and services.
                  </Text>
               </View>

               <View style={global.divider}/>
               
               <View style={{gap: 12}}>
                  <View style={styles.block}>
                     <Text style={styles.blockTitle}>
                        1. Information We Collect
                     </Text>
                     <Text style={styles.blockBody}>
                        We collect the following types of information:
                     </Text>
      
                     <View style={styles.letterBulletItem}>
                        <Text style={styles.letterBullet}>a.</Text>
                        <Text style={styles.bulletText}>
                           <Text style={styles.bulletLabel}>Personal Information: </Text>
                           This includes your name, address, phone number, email, government-issued ID, and selfies for verification.
                        </Text>
                     </View>
                     
                     <View style={styles.letterBulletItem}>
                        <Text style={styles.letterBullet}>b.</Text>
                        <Text style={styles.bulletText}>
                           <Text style={styles.bulletLabel}>Service-Related Data: </Text>
                           Details about your bookings, service preferences, and any media (photos or videos) you upload related to service requests.
                        </Text>
                     </View>
                     
                     <View style={styles.letterBulletItem}>
                        <Text style={styles.letterBullet}>c.</Text>
                        <Text style={styles.bulletText}>
                           <Text style={styles.bulletLabel}>Payment Information: </Text>
                           We collect transaction-related details like amount paid and payment status. However, we do not store your credit card or banking details.
                        </Text>
                     </View>
                     
                     <View style={styles.letterBulletItem}>
                        <Text style={styles.letterBullet}>d.</Text>
                        <Text style={styles.bulletText}>
                           <Text style={styles.bulletLabel}>Usage Data: </Text>
                           We collect device information, log data, and usage patterns to improve platform performance and security.
                        </Text>
                     </View>
                     
                     <View style={styles.letterBulletItem}>
                        <Text style={styles.letterBullet}>e.</Text>
                        <Text style={styles.bulletText}>
                           <Text style={styles.bulletLabel}>Location Data: </Text>
                           We may collect your approximate location to match you with nearby service providers.
                        </Text>
                     </View>
                  </View>
      
                  <View style={styles.block}>
                     <Text style={styles.blockTitle}>
                        2. How We Use Your Information
                     </Text>
                     <Text style={styles.blockBody}>
                        HandyHome uses your information for the following purposes:
                     </Text>
      
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To verify your identity and prevent fraudulent activities.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To facilitate and manage service bookings.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To process payments securely.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To provide customer support.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To monitor platform performance and conduct analytics.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           To send important notifications about your bookings.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
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
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Encrypted communication protocols (TLS/SSL).
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Token-based session management.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Rate limiting and suspicious activity monitoring.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Encrypted storage for sensitive files (like IDs and selfies).
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
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
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           With workers (for confirmed bookings).
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           With payment processing partners for transaction completion.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           With third-party service providers for app maintenance and analytics.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
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
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Access the personal data we hold about you.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Request corrections to inaccurate information.
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Request deletion of your personal data (subject to regulatory retention requirements).
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
                           Object to certain types of processing (e.g., marketing communications).
                        </Text>
                     </View>
                     
                     <View style={styles.bulletItem}>
                        <Text style={styles.bullet}>{`\u25cf`}</Text>
                        <Text style={styles.bulletText}>
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

               <View style={global.divider}/>
            </View>
         </View>
      </ScrollView>
   )
}

export default ProfilePolicies

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
   // Letter bullet items (a, b, c, d, e)
   letterBulletItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingLeft: 16,
      paddingRight: 12,
      marginBottom: 8,
   },
   letterBullet: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.sm,
      color: COLORS.accent,
      width: 20,
      textAlign: 'left',
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
   // Shared bullet text style
   bulletText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      textAlign: 'left',
      flexShrink: 1,
      lineHeight: 20,
   },
   bulletLabel: {
      color: COLORS.accent,
      fontFamily: FONTS.roboto700,
   },
})