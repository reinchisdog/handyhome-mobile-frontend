// Screen: Frequently Asked Questions (FAQs)

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Other Components
import Header from '../../../../components/Header';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

const ProfileFAQs = () => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   const languageOptions = ['english', 'filipino'];
   const [language, setLanguage] = useState('english');

   const content = {
      english: [
         {
            question: "What is HandyHome?",
            answer: "HandyHome is a mobile app that lets you book verified home service providers—like electricians, plumbers, and cleaners—quickly and securely, all from your phone."
         }, {
            question: "Where is HandyHome available?",
            answer: "The app is currently available in Marikina City as part of our pilot launch. We plan to expand to other areas soon."
         }, {
            question: "How do I know the workers are trustworthy?",
            answer: "All service providers on HandyHome are pre-screened and verified through ID checks and skills profiling. You can also view their ratings once available."
         }, {
            question: "What happens when I press the emergency button?",
            answer: "Pressing the emergency button sends a real-time alert with your location to our admin team and your emergency contact. It’s only available during active bookings."
         }, {
            question: "Do I need to verify my identity to book a service?",
            answer: "Yes. Identity verification helps prevent fraud and ensures a safer experience for both clients and workers."
         }, {
            question: "What if I don’t have internet?",
            answer: "You’ll need an internet connection to browse services, book a worker, or use the emergency alert. Offline use is not supported in this version."
         }, {
            question: "Is there a fee for booking through HandyHome?",
            answer: "The app is free to use. Service fees will depend on the provider and will be shown before you confirm your booking."
         }, {
            question: "Can I cancel a booking?",
            answer: "Yes, you can cancel before the provider confirms the appointment. Cancellation policies will apply once confirmation is made."
         }, {
            question: "Is my data secure?",
            answer: "Yes. We follow the Philippine Data Privacy Act (RA 10173) and use encryption to keep your personal information safe."
         }, {
            question: "What features are coming next?",
            answer: "Upcoming features include smart matching, worker skill assessments, and real-time chat. Stay tuned!"
         }
      ],
      filipino: [
         {
            question: "Ano ang HandyHome?",
            answer: "Ang HandyHome ay isang mobile app na nagbibigay daan upang makapag-book ka ng mga beripikadong manggagawa gaya ng elektrisyan, tubero, at tagalinis—mabilis at ligtas gamit lang ang iyong telepono."
         }, {
            question: "Saan available ang HandyHome?",
            answer: "Available pa lamang ang app sa Marikina City bilang bahagi ng aming pilot implementation. May plano kaming palawakin ito sa iba pang lugar."
         }, {
            question: "Paano ko malalaman kung mapagkakatiwalaan ang mga manggagawa?",
            answer: "Lahat ng service providers sa HandyHome ay dumaan sa screening at ID verification. May skills profiling din. Makikita rin ang kanilang ratings kapag available na."
         }, {
            question: "Anong mangyayari kapag pinindot ko ang emergency button?",
            answer: "Kapag pinindot ang emergency button, magpapadala ito ng alerto na may kasamang lokasyon sa aming admin at sa iyong emergency contact. Available lamang ito kapag may aktibong booking."
         }, {
            question: "Kailangan ko bang magpaberipika ng pagkakakilanlan?",
            answer: "Oo. Ang identity verification ay nakatutulong upang maiwasan ang panloloko at masiguro ang kaligtasan ng kliyente at manggagawa."
         }, {
            question: "Paano kung wala akong internet?",
            answer: "Kailangan mo ng internet connection upang makapag-browse, mag-book, o gumamit ng emergency button. Hindi gumagana ang app offline sa MVP na ito."
         }, {
            question: "May bayad ba ang pag-book gamit ang HandyHome?",
            answer: "Libre ang paggamit ng app. Ang singil para sa serbisyo ay depende sa provider at ipapakita bago ka mag-confirm ng booking."
         }, {
            question: "Pwede ba akong mag-cancel ng booking?",
            answer: "Oo, maaari kang mag-cancel bago makumpirma ang appointment ng provider. Mag-aapply ang cancellation policy kapag nakumpirma na."
         }, {
            question: "Ligtas ba ang aking personal na impormasyon?",
            answer: "Oo. Sinusunod namin ang Philippine Data Privacy Act (RA 10173) at gumagamit kami ng encryption para sa iyong seguridad."
         }, {
            question: "Anong mga bagong features ang paparating?",
            answer: "Kasama sa mga susunod na feature ang smart matching, skills assessment para sa workers, at real-time chat. Abangan!"
         }
      ],
   }

   return (
      <ScrollView
      stickyHeaderIndices={[0]}
      style={[global.screenContainer]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 12}}
      >
         <Header hasBack={true} backColor='#fff' title="FAQs" textColor='#fff' backgroundColor={COLORS.primary}/>

         <View style={{ padding: 12, gap: 24 }}>
            <View style={styles.container}>
               <Text
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.primary,
                  textAlign: 'center',
               }}>
                  Frequently Asked Questions
               </Text>

               <View
               style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 8,
                  outlineWidth: 1,
                  outlineColor: COLORS.strokes
               }}>
               {languageOptions.map((item, index) => (
                  <Pressable
                  onPress={() => setLanguage(item)}
                  key={index}
                  style={({pressed}) => [{
                     padding: 4,
                     flexGrow: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                     backgroundColor: pressed 
                        ? (language === item ? COLORS.primaryPress : COLORS.secondaryPress)
                        : (language === item ? COLORS.primary : COLORS.secondary),
                     borderColor: COLORS.strokes,
                     borderLeftWidth: index === 0 ? 0 : 1
                  }]}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: item === language ? '#fff' : COLORS.primary,
                        textTransform: 'capitalize'
                     }}>
                        {item === 'taglish' ? 'mixed' : item}
                     </Text>
                  </Pressable>
               ))}
               </View>
            </View>

            <FlatList 
            data={content[language]}
            scrollEnabled={false}
            contentContainerStyle={[styles.container, {gap: 0}]}
            renderItem={({item, index}) => (
               <View style={{gap: 6, padding: 12}}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto600,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons,
                  }}>
                     {index + 1}. {item.question}
                  </Text>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels,
                     textAlign: 'justify'
                  }}>
                     {item.answer}
                  </Text>
               </View>
            )}
            />
         </View>
      </ScrollView>
   )
}

export default ProfileFAQs

const styles = StyleSheet.create({
   container: {
      padding: 12,
      gap: 12,
      borderRadius: 20,
      backgroundColor: '#fff'
   }
})