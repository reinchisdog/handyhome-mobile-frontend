// Screen: Incoming Request Details

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, Image, Pressable, Modal, useWindowDimensions, StatusBar, FlatList, ScrollView, TextInput, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView, KeyboardAvoidingView} from 'react-native-keyboard-controller'
import api from '../../../../../lib/api';
import { useAuth } from '../../../../../context/AuthContext';
import { useRequestDetails } from '../../../../../context/RequestDetailsContext';
// ---- Other Components
import Header from '../../../../../components/Header';
import { ServiceCategoryImages } from '../../../../../components/ServiceCategoryMap';
import MainButton from '../../../../../components/MainButton';
import MaterialCheckItem from '../../../../../components/MaterialCheckItem';
// ---- Styles and Icons
import { globalStyles as global} from '../../../../../styles/globalStyles'
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants'
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
import Arrows from '@expo/vector-icons/Entypo';

const RequestMaterialsScreen = () => {
   // Hooks and States
   const {token} = useAuth();
   const router = useRouter();
   const {id} = useLocalSearchParams();
   const insets = useSafeAreaInsets();
   const {width, height} = useWindowDimensions();
   const {details, materials, setMaterials, setErrorModal, setErrorMessage, setErrorType} = useRequestDetails();

   const [total, setTotal] = useState(0);

   const [buttonLoading, setButtonLoading] = useState(false);
   const [descriptionModal, setDescriptionModal] = useState(false);

   const [newMaterial, setNewMaterial] = useState({
      name: "",
      description: "",
      price: 0,
      quantity: 1,
   });
   const [materialModal, setMaterialModal] = useState(false);
   const [addButtonDisabled, setAddButtonDisabled] = useState(true);

   // Functions
   const cancelNewMaterial = () => {
      setNewMaterial({
         name: "",
         description: "",
         price: 0,
         quantity: 1,
      })
      setMaterialModal(false);
   }

   const addNewMaterial = () => {
      const formattedMaterial = {
         ...newMaterial,
         id: createTempKey(),
         name: newMaterial.name.trim(),
         description: newMaterial.description.trim(),
         selected: true
      }
      setMaterials(prev => ([
         ...prev,
         formattedMaterial
      ]))
      setNewMaterial({
         name: "",
         description: "",
         price: 0,
         quantity: 1,
      })
      setMaterialModal(false)
   }

   const handleConfirm = async (type) => {
      try {
         setButtonLoading(true);
         let formattedArray;

         if (type === 'material') {
            const filteredArray = materials.filter(material => material.selected && material.quantity != 0);

            if (filteredArray.length === 0) {
               throw new Error("You don't have any selected materials. Select one or skip instead.")
            }

            formattedArray = filteredArray.map(material => ({
               material_id: material.id.toString().includes('temp') ? null : material.id,
               name: material.name,
               description: material.description,
               quantity: material.quantity,
               unit_price: material.price,
            }))
         } else if (type === 'skip') {
            formattedArray = [];
         }

         console.log(`WORKER MATERIAL CONFIRMATION FOR BOOKING ${id}:`, formattedArray);

         await api.post(`/worker/bookings/${id}/confirm_booking`, formattedArray, {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         router.replace('/dashboard/worker/request/[id]/success');
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when accepting the booking. Please try again.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setButtonLoading(false);
      }
   }


   // Effects
   useEffect(() => {
      const total = materials
         .filter(material => material.selected)
         .reduce((sum, material) => sum + (material.price * material.quantity), 0);
      
      setTotal(total);
   }, [materials])

   useEffect(() => {
      if (newMaterial.name.trim() === "" || newMaterial.price == 0) {
         setAddButtonDisabled(true);
      } else {
         setAddButtonDisabled(false);
      }
   }, [newMaterial])

   // Renders
   const createTempKey = () => `temp${new Date().toDateString()}${Math.random()}`;

   const formatDate = (dateString) => {
      if (!dateString) return null;

      const date = new Date(dateString + 'T00:00:00');
      const options = {month: 'short', day: 'numeric'};
      return date.toLocaleDateString('en-US', options);
   }

   const formatTime = (timeString) => {
      if (!timeString) return null;

      const [hours, minutes, seconds] = timeString.split(':').map(Number);

      const actualHours = hours === 24 ? 0 : hours;
      
      const period = actualHours >= 12 ? 'PM' : 'AM';
      const displayHours = actualHours === 0 ? 12 : actualHours > 12 ? actualHours - 12 : actualHours;
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
   }

   return (
      <View style={[global.screenContainer, {position: 'relative'}]}>

         {/* Materials Modal */}
         <Modal
         visible={materialModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setMaterialModal(false)}
         style={{flex: 1}}
         >  
            <KeyboardAvoidingView
               behavior='height'
               style={{ flex: 1, justifyContent: 'flex-end' }}
               keyboardVerticalOffset={-insets.bottom - 24 - 48}
            >
            <View
            style={{
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               maxHeight: height - StatusBar.currentHeight - 24,
               width: width,
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20,
               backgroundColor: '#fff',
               position: 'absolute',
               zIndex: 2
            }}>
               <Text
               style={{
                  padding: 24,
                  textAlign: 'center',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.primary
               }}>
                  Add New Material
               </Text>
   
               <View style={global.divider}/>

               <View style={{paddingVertical: 24, gap: 12}}>
                  {/* Name */}
                  <View style={{gap: 8}}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        Material Name
                     </Text>
                     <TextInput 
                     value={newMaterial.name}
                     onChangeText={(text) => setNewMaterial(prev => ({
                        ...prev,
                        name: text
                     }))}
                     style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: COLORS.strokes,
                        paddingHorizontal: 12,
                        height: 40,
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}
                     />
                  </View>

                  {/* Quantity and Price*/}
                  <View style={{gap: 8}}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        Price & Quantity
                     </Text>

                     <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                        <View style={{
                           flexDirection: 'row',
                           borderRadius: 8,
                           borderWidth: 1,
                           borderColor: COLORS.strokes,
                           alignItems: 'center',
                           flex: 1
                        }}>
                           <Text style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.lettersicons,
                              paddingHorizontal: 12
                           }}>
                              {`\u20B1`}
                           </Text>
                           <TextInput 
                           value={newMaterial.price.toString()}
                           onChangeText={(text) => {
                              let price = text.replace(/[^0-9]/g, '');
                              price = price.replace(/^0+/, '') || '0';

                              let priceNumber = price === '' ? 0 : parseInt(price, 10);
                           
                              setNewMaterial(prev => ({
                                 ...prev,
                                 price: priceNumber
                              }));
                           }}
                           keyboardType='number-pad'
                           inputMode='numeric'
                           style={{
                              paddingHorizontal: 12,
                              height: 40,
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.lettersicons,
                              flex: 1
                           }}
                           />
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'stretch', borderRadius: 8, borderWidth: 1, borderColor: COLORS.strokes, overflow: 'hidden'}}>
                           <Pressable
                           onPress={() => {
                              if (newMaterial.quantity === 0) return;

                              setNewMaterial(prev => ({
                                 ...prev,
                                 quantity: prev.quantity - 1
                              }))
                           }}
                           style={({pressed}) => [{
                              backgroundColor: pressed ? COLORS.summaryPress : '#fff',
                              justifyContent: 'center',
                              alignItems: 'center'
                           }]}
                           >
                              <Icons name='minus' size={20} color={COLORS.labels}/>
                           </Pressable>

                           <TextInput 
                           style={{
                              width: 24,
                              textAlign: 'center',
                              backgroundColor: COLORS.secondary,
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons
                           }}
                           onChangeText={(text) => {
                              let quantity = text.replace(/[^0-9]/g, '');
                              quantity = quantity.replace(/^0+/, '') || '0';

                              let quantityNumber = quantity === '' ? 0 : parseInt(quantity, 10);
                           
                              setNewMaterial(prev => ({
                                 ...prev,
                                 quantity: quantityNumber
                              }));
                           }}
                           value={newMaterial.quantity.toString()}
                           maxLength={2}
                           keyboardType='number-pad'
                           inputMode='numeric'
                           />

                           <Pressable
                           onPress={() => {
                              if (newMaterial.quantity === 99) return;
                              setNewMaterial(prev => ({
                                 ...prev,
                                 quantity: prev.quantity + 1
                              }))
                           }}
                           style={({pressed}) => [{
                              backgroundColor: pressed ? COLORS.summaryPress : '#fff',
                              justifyContent: 'center',
                              alignItems: 'center'
                           }]}
                           >
                              <Icons name='plus' size={20} color={COLORS.labels}/>
                           </Pressable>
                        </View>
                     </View>
                     
                  </View>

                  {/* Description */}
                  <View style={{gap: 8}}>
                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        Notes <Text style={{fontFamily: FONTS.roboto400, fontStyle: 'italic'}}>(Optional)</Text>
                     </Text>
                     <TextInput 
                     value={newMaterial.description}
                     onChangeText={(text) => setNewMaterial(prev => ({
                        ...prev,
                        description: text
                     }))}
                     style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: COLORS.strokes,
                        paddingHorizontal: 12,
                        height: 40,
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}
                     />
                  </View>
               </View>

               <View style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                  // backgroundColor: 'green'
                  width: '100%'
               }}>
                     <MainButton 
                     type='secondary'
                     size='flex'
                     text='Cancel'
                     onPress={cancelNewMaterial}
                     />

                     <MainButton 
                     type='primary'
                     size='flex'
                     text='Add Material'
                     onPress={addNewMaterial}
                     disabled={addButtonDisabled}
                     />
               </View>

            </View>
            </KeyboardAvoidingView>
         </Modal>


         {/* Description Modal */}
         <Modal
         visible={descriptionModal}
         statusBarTranslucent={true}
         animationType='slide'
         backdropColor={COLORS.modalbg}
         onRequestClose={() => setDescriptionModal(false)}
         style={{flex: 1}}
         >
            <View
            style={{
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               maxHeight: height - StatusBar.currentHeight - 24,
               width: width,
               borderRadius: 20,
               backgroundColor: '#fff',
               position: 'absolute',
               bottom: 0,
               zIndex: 2
            }}>
               <Text
               style={{
                  padding: 24,
                  textAlign: 'center',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.lg,
                  color: COLORS.primary
               }}>
                  Service Description
               </Text>
   
               <View style={global.divider}/>

               <ScrollView 
               style={{flexShrink: 1, width: '100%'}} 
               contentContainerStyle={{flexGrow: 1, paddingVertical: 24, gap: 12}}
               >
                  {details?.attachment &&
                     <View 
                     style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        width: '100%'
                     }}>
                        <Image 
                        source={{uri: details?.attachment}}
                        // source={require('../../../../../assets/placeholder-base.png')}
                        style={{
                           width: '100%',
                           height: undefined,
                           aspectRatio: 1/1,
                        }}
                        resizeMode='cover'
                        />
                     </View>
                  }
                  
                  <View
                  style={{
                     borderRadius: 12,
                     padding: 12,
                     borderWidth: 1.5,
                     borderColor: COLORS.strokes,
                     backgroundColor: COLORS.secondary
                  }}>
                     <Text
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify'
                     }}>
                        {details?.description}
                     </Text>
                  </View>
               </ScrollView>
            
               <MainButton 
               text={'Close'}
               type='secondary'
               onPress={() => setDescriptionModal(false)}
               />

            </View>
         </Modal>

         <Header 
         hasBack
         title={'Set Materials'}
         />

         <KeyboardAwareScrollView
         bottomOffset={24}
         contentContainerStyle={{
            gap: 12,
            padding: 12,
            paddingBottom: insets.bottom + 48 + 148
         }}>
            {/* Service */}
            <View style={[styles.container]}>
               <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                  Service
               </Text>
               <View style={[styles.sectionView, {flexDirection: 'row', gap: 12}]}>
                  <Image 
                  source={ServiceCategoryImages[details?.sub_service_id]}
                  style={{
                     borderRadius: 8,
                     width: 64,
                     height: 64
                  }}/>

                  <View style={{flex: 1, justifyContent: 'space-between'}}>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels
                     }}>
                        {`${formatDate(details?.date)}  |  ${formatTime(details?.time)}`}
                     </Text>

                     <Text style={{
                        fontFamily: FONTS.roboto600,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.primary
                     }}>
                        {details?.sub_services?.name}
                     </Text>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}>
                        {details?.service?.name}
                     </Text>
                  </View>
               </View>

               <Text style={[styles.sectionTitle, {paddingHorizontal: 12, paddingBottom: 0}]}>
                  Instructions
               </Text>
               <View style={[styles.sectionPressable]}>
                  <Pressable 
                  onPress={() => {setDescriptionModal(true)}}
                  style={({pressed}) => [
                     styles.sectionPressable, {
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: pressed ? COLORS.summaryPress : 'transparent'
                  }]}>
                     {details?.attachment &&
                        <Image 
                        source={{uri: details?.attachment}}
                        // source={require('../../../../../assets/placeholder-base.png')}
                        style={{
                           borderRadius: 8,
                           width: 64,
                           height: 64
                        }}/>
                     }
                     <Text
                     numberOfLines={3}
                     style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        flex: 1,
                        textAlign: 'justify'
                     }}>   
                        {details?.description}
                     </Text>
                     <Arrows name='chevron-right' size={24} color={COLORS.accent}/>
                  </Pressable>
               </View>
            </View>

            {/* Materials */}
            <View style={[styles.container]}>
               <Text style={[styles.sectionTitle, {padding: 12, paddingBottom: 0}]}>
                  Materials
               </Text>  

               <FlatList 
               data={materials}
               scrollEnabled={false}
               contentContainerStyle={{
                  // backgroundColor: 'green',
                  padding: 12,
               }}
               renderItem={({item, index}) => (
                  <MaterialCheckItem 
                  key={item.id}
                  data={item}
                  onSelect={() => setMaterials(prev => 
                     prev.map((mat, i) =>
                        i === index ? {
                           ...mat, 
                           selected: !mat.selected,
                           quantity: !mat.selected && mat.quantity === 0 ? 1 : mat.quantity
                        } : mat
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
                     
                     // Add max limit of 99
                     if (quantityNumber > 99) {
                        quantityNumber = 99;
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
               ListEmptyComponent={
                  <Text style={{
                     textAlign: 'center',
                     padding: 16,
                     fontFamily: FONTS.roboto400,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.accent,
                     borderWidth: 1,
                     borderRadius: 8,
                     borderColor: COLORS.strokes
                  }}>
                     You currently have no materials added.
                  </Text>
               }
               />

               <View style={[styles.sectionView, {paddingTop: 0}]}>
                  <Pressable
                  onPress={() => setMaterialModal(true)}
                  style={({pressed}) => [{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: 8,
                     padding: 8,
                     borderWidth: 1,
                     borderColor: COLORS.labels,
                     borderRadius: 8,
                     borderStyle: 'dashed',
                     backgroundColor: pressed ? COLORS.secondaryPress : '#fff'
                  }]}>
                     <Icons name='plus' size={16} color={COLORS.labels}/>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.md,
                        color: COLORS.labels
                     }}>
                        Add Material
                     </Text>
                  </Pressable>
               </View>
            </View>
         </KeyboardAwareScrollView>

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
            text='Send to Client'
            loading={buttonLoading}
            onPress={() => handleConfirm('material')}
            />

            <MainButton 
            type='secondary'
            text='Skip (No Materials Needed)'
            loading={buttonLoading}
            onPress={() => handleConfirm('skip')}
            />
         </View>
      </View>
   )
}

export default RequestMaterialsScreen

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