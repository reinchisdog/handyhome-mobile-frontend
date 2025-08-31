// DIY Question Screen

// Imports
// ---- Reacts and Expo Components
import { StyleSheet, Text, View, Image, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller'
// ---- Other Components
import Header from '../../../../../components/Header';
import Multiline from '../../../../../components/Multiline';
import MainButton from '../../../../../components/MainButton';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import Icons from '@expo/vector-icons/FontAwesome6';
// ---- Other Libraries
import { useAuth } from '../../../../../context/AuthContext';
import { useDiy } from '../../../../../context/DiyContext';

const DiyQuestionScreen = () => {
   // Hooks and States
   const { user } = useAuth();
   const { commonPrompts, prompt, setPrompt, promptLoading, handlePrompt } = useDiy();


   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <Header 
         hasBack={false} 
         title='DIY Solution'
         textColor='#fff'
         backgroundColor={COLORS.primary}
         />

         <KeyboardAwareScrollView
         contentContainerStyle={[{
            backgroundColor: COLORS.screenbg, 
            position: 'relative', 
            paddingBottom: 64 + 24,
            gap: 12
         }]}
         >

            <View style={{padding: 12, gap: 12, flex: 1}}>
               <View
               style={{
                  padding: 12,
                  paddingVertical: 24,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  gap: 24
               }}>
                  {/* ---- Greeting */}
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
                        Hi, <Text style={[{ color: COLORS.primary }]}>
                           {user?.full_name}!
                        </Text> <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.lg}}>
                           Got a Home Issue? Let our AI help you with DIY Tips.
                        </Text>
                     </Text>
                  </View>

                  <View style={global.divider}/>

                  {/* ---- Prompt */}
                  <View style={{ gap: 12 }}>
                     <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{
                           fontFamily: FONTS.roboto500,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.lettersicons
                        }}>
                           Description
                        </Text>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.xs,
                           color: prompt.length > 2000 ? COLORS.red : COLORS.labels
                        }}>
                           {`${prompt.length} / 2000`}
                        </Text>
                     </View>

                     <Multiline 
                     placeholder='Describe the problem you are facing.'
                     numberOfLines={8}
                     value={prompt}
                     onChangeText={(e) => setPrompt(e)}
                     />
                  </View>

                  {/* ---- Note */}
                  <View
                  style={{
                     padding: 12,
                     backgroundColor: COLORS.secondary,
                     borderRadius: 12,
                     gap: 24,
                     justifyContent: 'center',
                     alignItems: 'center'
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify'
                     }}>
                        NOTE: <Text style={{fontFamily: FONTS.roboto400}}>
                           These DIY tips are AI-generated and for guidance only. Proceed at your own risk as we are not liable for any issues. For safe results, book a verified service expert.
                        </Text>
                     </Text>
                  </View>
               </View>
            </View>

            <View style={{ gap: 6 }}>
               <Text 
               style={{
                  fontFamily: FONTS.roboto500,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons,
                  paddingHorizontal: 24
               }}>
                  Common Issues
               </Text>

               <FlatList 
               horizontal
               data={commonPrompts}
               renderItem={({item}) => (
                  <Pressable
                  onPress={() => setPrompt(item.value)}
                  style={({pressed}) => [{
                     flexDirection: 'row',
                     alignItems: 'center',
                     padding: 8,
                     gap: 8,
                     borderWidth: 1.5,
                     borderColor: pressed ? COLORS.primary : COLORS.strokes,
                     borderRadius: 8,
                     backgroundColor: '#fff'
                  }]}>
                     <Icons name={item.icon} size={20} color={COLORS.primary} />
                     <Text
                     style={{
                        fontFamily: FONTS.roboto500,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.lettersicons
                     }}>
                        {item.text}
                     </Text>
                  </Pressable>
               )}
               contentContainerStyle={{
                  paddingHorizontal: 24,
                  gap: 12
               }}
               />
            </View>

         </KeyboardAwareScrollView>

         <View 
         style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 12,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#fff',
         }}>
            <MainButton 
            type='primary'
            text='Submit'
            loading={promptLoading}
            onPress={handlePrompt}
            />
         </View>
      </View>
      
   )
}

export default DiyQuestionScreen

const styles = StyleSheet.create({})