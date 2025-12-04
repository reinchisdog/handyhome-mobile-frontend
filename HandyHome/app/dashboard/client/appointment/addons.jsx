// Screen: Appointment Add-ons

// Imports
// ---- React and Expo Components
import { FlatList, Image, ScrollView, StyleSheet, BackHandler, Text, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ---- Other Components
import Header from '../../../../components/Header';
import MaterialCheckItem from '../../../../components/MaterialCheckItem';
import MainButton from '../../../../components/MainButton';
import LoadingDots from '../../../../components/LoadingDots';
import GeneralModal from '../../../../components/GeneralModal';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import { globalStyles as global } from '../../../../styles/globalStyles';
// ---- Libraries
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { useAppointment } from '../../../../context/AppointmentContext';

const AppointmentAddonsScreen = () => {
   // Hooks and States
   const router = useRouter();
   const insets = useSafeAreaInsets();
   const {token} = useAuth();
   const {currentAppointment, materials, setMaterials, materialsLoading, fetchMaterials, setErrorMessage, setErrorType, setErrorModal, setMaterialsSelected} = useAppointment();

   const [total, setTotal] = useState(0);

   const [skipModal, setSkipModal] = useState(false);
   const [buttonLoading, setButtonLoading] = useState(false);

   // Functions
   const handleContinue = async () => {
      try {
         setButtonLoading(true);

         const filteredArray = materials.filter(material => (
            material.selected && material.quantity != 0
         ))

         if (filteredArray.length === 0) {
            throw new Error("You don't have any selected materials. Select one or skip instead.");
         }

         const formattedArray = filteredArray.map(material => ({
            id: material.id,
            quantity: material.quantity
         }))
         console.log(formattedArray);
         await api.put(`/user/book/${currentAppointment?.id}/materials`, formattedArray, {
            headers: {'Authorization' : `Bearer ${token}`}
         })
         await AsyncStorage.setItem('materialsSelected', 'true');
         setMaterialsSelected(true);

         router.replace('/dashboard/client/appointment/summary/');
         setMaterials([]);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when selecting the materials. Please try again.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setButtonLoading(false);
      }
   }

   const handleSkip = async () => {
      await AsyncStorage.setItem('materialsSelected', 'true');
      router.replace('/dashboard/client/appointment/summary/');
      setMaterials([]);
      setMaterialsSelected(true);
   }

   // Effects
   useFocusEffect(
      useCallback(() => {
         const onBackPress = () => {
            router.replace('/dashboard/client/home'); // ✅ Use replace
            return true;
         };

         const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
         return () => subscription?.remove();
      }, [])
   );

   useEffect(() => {
      if (!currentAppointment?.id) return;

      fetchMaterials(currentAppointment?.id);
   }, [currentAppointment?.id])

   useEffect(() => {
      const total = materials
         .filter(material => material.selected)
         .reduce((sum, material) => sum + (material.price * material.quantity), 0);
      
      setTotal(total);
   }, [materials])

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>
         <GeneralModal 
         isAlert={true}
         visible={skipModal}
         setVisible={setSkipModal}
         title='Are you sure to skip Add-ons?'
         message='Provider recommends these materials for best results. If you skip, please ensure you have them available at service time.'
         primaryText='Go Back'
         secondaryText='Yes, Skip'
         primaryFunction={() => setSkipModal(false)}
         secondaryFunction={handleSkip}/>

         <Header 
         hasBack
         onBack={() => router.replace('/dashboard/client/home')}
         backColor={COLORS.primary}
         title='Review Add-ons'
         />
   
         <ScrollView
         contentContainerStyle={{
            gap: 12,
            padding: 12,
            paddingBottom: insets.bottom + 48 + 148
         }}>
            <View style={[styles.container, {padding: 12, gap: 16}]}>
               <View style={{
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'center',
               }}>
                  <Image 
                  source={require('../../../../assets/images/logos/square-logo-1.png')}
                  style={{
                     width: 42,
                     aspectRatio: 1/1
                  }}/>

                  <Text
                  style={{
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.lettersicons,
                     textAlign: 'justify',
                     flexShrink: 1
                  }}>
                     Provider recommends these materials for best results. Please select the items that the worker needs to buy beforehand. Otherwise, please ensure you have them available at service time.
                  </Text>
               </View>
               
               <Text style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: COLORS.secondary,
                  // borderWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.strokes,
                  borderRadius: 6,
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons
               }}>
                  <Text style={{fontFamily: FONTS.roboto600}}>NOTE:</Text> Keep in mind that these materials can still change for further booking procedures, and is for transparency purposes only.
               </Text>

            </View>

            <View style={[styles.container]}>
               <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                  Suggested Materials
               </Text>

               <FlatList 
               data={materials}
               scrollEnabled={false}
               contentContainerStyle={{
                  padding: 12,
               }}
               renderItem={({item, index}) => (
                  <MaterialCheckItem 
                  key={item.id}
                  data={item}
                  onSelect={() => setMaterials(prev => 
                     prev.map((mat, i) =>
                        i === index 
                           ? {
                              ...mat, 
                              selected: !mat.selected,
                              // If selecting when quantity is 0, set quantity to 1
                              quantity: !mat.selected && mat.quantity === 0 ? 1 : mat.quantity
                           }
                           : mat
                     )
                  )}
                  onDecrease={() => {
                     if (item.quantity === 0) return;

                     if (item.quantity === 1) {
                        setMaterials(prev => 
                           prev.map((mat, i) =>
                              i === index ? {...mat, selected: false, quantity: mat.quantity - 1} : mat
                           )
                        )
                     } else {
                        setMaterials(prev => 
                           prev.map((mat, i) =>
                              i === index ? {...mat, quantity: mat.quantity - 1} : mat
                           )
                        )
                     }
                  }}
                  onIncrease={() => {
                     if (item.quantity === item.max_quantity) return;
                     setMaterials(prev => 
                        prev.map((mat, i) =>
                           i === index ? {...mat, quantity: mat.quantity + 1, selected: true} : mat
                        )
                     )
                  }}
                  onQtyChange={(text) => {
                     let quantity = text.replace(/[^0-9]/g, '');
                     quantity = quantity.replace(/^0+/, '') || '0';
                     
                     let quantityNumber = quantity === '' ? 0 : parseInt(quantity, 10);
                     
                     // Add max limit based on item.max_quantity
                     if (quantityNumber > item.max_quantity) {
                        quantityNumber = item.max_quantity;
                     }
                     
                     // Auto-deselect when quantity becomes 0, auto-select when going above 0
                     if (quantityNumber === 0) {
                        setMaterials(prev => 
                           prev.map((mat, i) =>
                              i === index ? {...mat, quantity: quantityNumber, selected: false} : mat
                           )
                        )
                     } else {
                        setMaterials(prev => 
                           prev.map((mat, i) =>
                              i === index ? {...mat, quantity: quantityNumber, selected: true} : mat
                           )
                        )
                     }
                  }}/>
               )} 
               />
            </View>
         </ScrollView>

         <View
         style={[
            global.shadowBottom, {
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 24,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: COLORS.strokes,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
            gap: 8,
            position: 'absolute',
            bottom: 0,
            width: '100%'
         }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
               <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.labels
               }}>
                  ADD-ONS TOTAL
               </Text>

               <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.primary
               }}>
                  {`\u20B1 ${total}`}
               </Text>
            </View>

            <MainButton 
            type='primary'
            text='Continue'
            loading={buttonLoading || materialsLoading}
            onPress={handleContinue}
            />

            <MainButton 
            type='secondary'
            text='Skip Add-ons'
            loading={buttonLoading || materialsLoading}
            onPress={() => {setSkipModal(true)}}
            />
         </View>
      </View>
   )
}

export default AppointmentAddonsScreen

const styles = StyleSheet.create({
   container: {
      borderRadius: 12,
      backgroundColor: '#fff',
      overflow: 'hidden'
   },
   sectionView: {
      padding: 12,
      gap: 6
   },
   sectionPressable: {
      padding: 6,
      gap: 6,
      borderRadius: 6
   },
   content : {
      gap: 6,
      padding: 6,
      flexShrink: 1
   },
   sectionTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.md,
      color: COLORS.labels
   }
})