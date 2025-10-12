// Screen: DIY Loading Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../../components/Header';
import MainButton from '../../../../../components/MainButton';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other libs
import { useDiy } from '../../../../../context/DiyContext';

const DiyResultScreen = () => {
   // Hooks and States
   const router = useRouter();
   const { result } = useDiy();

   const parseFormattedText = (text) => {
      if (!text || typeof text !== 'string') {
         return text;
      }

      const parts = [];
      let currentIndex = 0;
      let key = 0;

      // Combined regex to match both ** ** and / /
      const regex = /(\*\*[^*]+\*\*|\/\/[^/]+\/\/)/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
         // Add text before the match
         if (match.index > currentIndex) {
            parts.push(
            <Text key={key++}>
               {text.slice(currentIndex, match.index)}
            </Text>
            );
         }

         const matchedText = match[0];
         
         // Check if it's bold (**text**)
         if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
            const boldText = matchedText.slice(2, -2);
            parts.push(
            <Text key={key++} style={{ fontWeight: 'bold' }}>
               {boldText}
            </Text>
            );
         }
         // Check if it's italic (/text/)
         else if (matchedText.startsWith('//') && matchedText.endsWith('//')) {
            const italicText = matchedText.slice(1, -1);
            parts.push(
            <Text key={key++} style={{ fontStyle: 'italic' }}>
               {` ${italicText} `}
            </Text>
            );
         }

         currentIndex = match.index + matchedText.length;
      }

      // Add remaining text
      if (currentIndex < text.length) {
         parts.push(
            <Text key={key++}>
            {text.slice(currentIndex)}
            </Text>
         );
      }

      return parts;
   };

   return (
      <ScrollView
      stickyHeaderIndices={[0]}
      style={[global.screenContainer]}
      contentContainerStyle={[{
         backgroundColor: COLORS.screenbg
      }]}>
         <Header 
         hasBack
         backColor='#fff'
         title='Problem Analysis'
         textColor='#fff'
         backgroundColor={COLORS.primary}
         />

         <View style={{padding: 12, gap: 24, flex: 1}}>
            <View
            style={{
               padding: 16,
               backgroundColor: '#fff',
               borderRadius: 20,
               gap: 24
            }}>
               {/* Issue */}
               <View 
               style={[{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  gap: 16
               }]}>
                  <Image 
                  source={
                     require(`../../../../../assets/images/logos/square-logo-1.png`)
                  }
                  style={{
                     width: 42,
                     aspectRatio: 1/1
                  }}
                  />

                  {result?.unrelated_message && result?.unrelated_message !== "null" ?
                     <Text 
                     style={[
                        global.headingText, {
                        color: COLORS.accent,
                        flexShrink: 1,
                     }]}>
                        Not a DIY Request
                     </Text> :
                     <Text 
                     style={[
                        global.headingText, {
                        color: COLORS.lettersicons,
                        flexShrink: 1,
                     }]}>
                        To solve your issue: <Text style={[{ color: COLORS.primary, fontFamily: FONTS.roboto500 }]}>
                           "{result?.issue_phrase}"
                        </Text>
                     </Text>
                  }
               </View>

               <View style={global.divider}/>
               
               {/* Unrelated Message */}
               {result?.unrelated_message && result?.unrelated_message !== "null" &&
                  <Text style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.md,
                     color: COLORS.lettersicons
                  }}>
                     {parseFormattedText(result?.unrelated_message)}
                  </Text>
               }

               {/* Tools/Materials */}
               {result?.tools_materials &&
                  <View style={{ gap: 6 }}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        To start, you will need:
                     </Text>
                     <View style={{gap: 4}}>
                        {result?.tools_materials.map((item, index) => (
                           <View 
                           key={index}
                           style={{
                              flexDirection: 'row',
                              gap: 6
                           }}>
                              <Text
                              style={{
                                 fontFamily: FONTS.roboto600,
                                 fontSize: FONT_SIZES.md,
                                 color: COLORS.labels,
                              }}>
                                 –
                              </Text>
                              <Text
                              style={{
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.md,
                                 color: COLORS.lettersicons,
                                 flexShrink: 1
                              }}>
                                 {parseFormattedText(item)}
                              </Text>
                           </View>
                        ))}
                     </View>
                  </View>
               }

               {/* Steps */}
               {result?.steps &&
                  <View style={{ gap: 12 }}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        Here's what you can do:
                     </Text>
                     <View style={{gap: 8}}>
                        {result?.steps?.map((item, index) => (
                           <React.Fragment key={index}>
                           <Text 
                           style={{
                              fontFamily: FONTS.roboto500,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.primary
                           }}>
                              {item.title}
                           </Text>

                           <View style={{gap: 4, paddingHorizontal: 6}}>
                              {item?.substeps?.map((subitem, subindex) => (
                                 <View 
                                 key={subindex}
                                 style={{
                                    flexDirection: 'row',
                                    gap: 6
                                 }}>
                                    <Text
                                    style={{
                                       fontFamily: FONTS.roboto600,
                                       fontSize: FONT_SIZES.sm,
                                       color: COLORS.labels,
                                    }}>
                                       –
                                    </Text>
                                    <Text
                                    style={{
                                       fontFamily: FONTS.roboto400,
                                       fontSize: FONT_SIZES.sm,
                                       color: COLORS.lettersicons,
                                       flexShrink: 1
                                    }}>
                                       {parseFormattedText(subitem)}
                                    </Text>
                                 </View>
                              ))}
                           </View>
                           </React.Fragment>
                        ))}
                     </View>
                  </View>
               }

               {/* Remarks */}
               {result?.remarks &&
                  <View style={{ gap: 12 }}>
                     <Text style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        Remarks:
                     </Text>
                     <Text 
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify',
                        paddingHorizontal: 12
                     }}>
                        {parseFormattedText(result?.remarks)}
                     </Text>
                  </View>
               }

            </View>

            <View
            style={{
               padding: 12,
               paddingVertical: 24,
               backgroundColor: '#fff',
               borderRadius: 20,
               gap: 24
            }}>
               <Text
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons, 
                  textAlign: 'center',
                  paddingHorizontal: 48
               }}>
                  Not sure how to fix it? <Text style={{color: COLORS.primary}}>
                     Hire Someone
                  </Text> to do it for you.
               </Text>

               <View
               style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'center',
                  width: '100%',
               }}>
                  <MainButton 
                  type='secondary'
                  text='Done'
                  size='grow'
                  onPress={() => router.replace('/dashboard/client')}
                  />

                  <MainButton 
                  type='primary'
                  text='Get Help'
                  size='grow'
                  onPress={() => router.replace('/dashboard/client/home/services')}
                  />
               </View>
            </View>
         </View>
      </ScrollView>
   )
}

export default DiyResultScreen

const styles = StyleSheet.create({})