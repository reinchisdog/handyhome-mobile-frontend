// Screen: Application Preview Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';

const ApplicationPreview = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();

   return (
      <View style={[global.screenContainer, {backgroundColor: '#fff'}]}>
         <Header hasBack={true} />
         
         <ScrollView 
         contentContainerStyle={{
            flexGrow: 1, 
            paddingHorizontal: 24, 
            paddingBottom: insets.bottom + 24 ,
            gap: 24, 
            justifyContent: 'space-between', 
         }}>
            <View style={{gap: 12}}>
               <View style={{gap: 8}}>
                  <Text style={{
                     fontFamily: FONTS.nunito700,
                     fontSize: FONT_SIZES.xxl,
                     color: COLORS.primary,
                     textAlign: 'center'
                  }}>
                     Submit Documents
                  </Text>
                  <Text style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons,
                     textAlign: 'center',
                  }}>
                     We need to verify your information.
                     Please submit the documents below to process your application.
                  </Text>
               </View>

               <View style={styles.document}>
                  <Text style={styles.documentText}>Photo Verification</Text>
                  <Icons name='account-box' size={32} color={COLORS.primary}/>
               </View>

               <View style={styles.document}>
                  <Text style={styles.documentText}>Credentials</Text>
                  <Icons name='file-document' size={32} color={COLORS.primary}/>
               </View>

               <View style={{paddingHorizontal: 24}}>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>2 Valid IDs</Text>
                  </View>
                     <View style={styles.bulletDivider}/>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>NBI/Police Clearance (Optional)</Text>
                  </View>
                     <View style={styles.bulletDivider}/>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>Barangay Clearance</Text>
                  </View>
                     <View style={styles.bulletDivider}/>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>TESDA Certificate (Optional)</Text>
                  </View>
                     <View style={styles.bulletDivider}/>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>Licenses & Certifications (Optional)</Text>
                  </View>
                     <View style={styles.bulletDivider}/>
                  <View style={styles.bulletItem}>
                     <View style={styles.bullet}/>
                     <Text style={styles.bulletText}>Work Experience</Text>
                  </View>
               </View>

               <View style={styles.document}>
                  <Text style={styles.documentText}>Proof of Work</Text>
                  <Icons name='archive-search' size={32} color={COLORS.primary}/>
               </View>

               <View style={styles.document}>
                  <Text style={styles.documentText}>Service Selection</Text>
                  <Icons name='pipe-wrench' size={32} color={COLORS.primary}/>
               </View>
            </View>

            <MainButton 
            type='primary'
            text='Get Started'
            onPress={() => {router.push('/dashboard/client/verify/worker/form')}}
            />
         </ScrollView>
      </View>
   )
}

export default ApplicationPreview

const styles = StyleSheet.create({
   document: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 8,
      height: 56,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.screenbg,
      borderRadius: 8,
   }, 
   documentText: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
   },
   bulletItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
   },
   bullet: {
      width: 8,
      height: 8,
      aspectRatio: '1/1',
      borderRadius: 4,
      backgroundColor: COLORS.accent,
   },
   bulletText: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
   },
   bulletDivider: {
      width: 1,
      height: 12,
      backgroundColor: COLORS.labels,
      marginLeft: 3.5,
   }
})