// Screen: DIY Loading Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import Header from '../../../../../components/Header';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other libs
import { useDiy } from '../../../../../context/DiyContext';

const DiyResultScreen = () => {
   // Hooks and States
   const { result } = useDiy();

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

         <View style={{padding: 12, gap: 12, flex: 1}}>
            <View
            style={{
               padding: 12,
               paddingVertical: 24,
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
               </View>

               <View style={global.divider}/>
               
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
                                 {item}
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
                              fontSize: FONT_SIZES.sm,
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
                                       {subitem}
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
                        {result?.remarks}
                     </Text>
                  </View>
               }

            </View>
         </View>
      </ScrollView>
   )
}

export default DiyResultScreen

const styles = StyleSheet.create({})