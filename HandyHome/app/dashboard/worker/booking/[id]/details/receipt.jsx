// Screen: E-Receipt

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Modal, FlatList, ImageBackground, Image } from 'react-native'
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
// ---- Other Components
import Header from '../../../../../../components/Header'
import MediaUpload from '../../../../../../components/MediaUpload';
import MainButton from '../../../../../../components/MainButton';
import GeneralModal from '../../../../../../components/GeneralModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialIcons';
// ---- Other Libs
import { useConvert } from '../../../../../../hooks/useConvert';
import { useBookingDetails } from '../../../../../../context/BookingDetailsContext';
import { useAuth } from '../../../../../../context/AuthContext';
import api from '../../../../../../lib/api';

const WorkerBookingReceipt = () => {
   // Hooks and States
   const {convertUriToFile} = useConvert();
   const {token} = useAuth();
   const { details, setErrorModal, setErrorMessage, setErrorType } = useBookingDetails();
   const insets = useSafeAreaInsets();

   const [materialsReceipt, setMaterialsReceipt] = useState([]);
   const [gcashReceipt, setGcashReceipt] = useState(null);
   const [initLoading, setInitLoading] = useState(true);
   const [uploading, setUploading] = useState(false);
   const [deleting, setDeleting] = useState(false);

   const [receipts, setReceipts] = useState({
      images: []
   });
   const [modalVisible, setModalVisible] = useState(false);
   const [imageModalVisible, setImageModalVisible] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);
   
   const [allowDelete, setAllowDelete] = useState(false);
   const [deleteModal, setDeleteModal] = useState(false);

   // Functions
   const fetchMaterials = async () => {
      try {
         const response = await api.get(`worker/bookings/${details?.id}/materials/receipts/view`, {
            headers: {'Authorization': `Bearer ${token}`},
         });

         console.log('MATERIALS RECEIPT:', response.data.data);
         setMaterialsReceipt(response.data.data);
         
      } catch (error) {

      }
   }

   const fetchGCash = async () => {
      try {
         const response = await api.get(`worker/bookings/${details?.id}/payment/receipt/view`, {
            headers: {'Authorization': `Bearer ${token}`},
         });

         console.log('GCASH RECEIPT:',response.data.data);
         setGcashReceipt(response.data.data);

      } catch (error) {

      }
   }

   const initializeReceipts = useCallback(async () => {
      try {
         // console.log('Getting Receipts')
         setInitLoading(true);
         await fetchMaterials();

         if (details?.payment_method === "GCash") {
            await fetchGCash();
         }
      } catch (error) {
         // handle error
      } finally {
         setInitLoading(false);
      }
   }, [])

   const uploadMaterialsReceipt = async () => {
      try {
         setUploading(true);

         const formData = new FormData();

         receipts.images.forEach((image, index) => {
            const file = convertUriToFile(image);
            console.log('File object:', file); // Should show {uri, name, type}
            
            if (file) {
               formData.append('receipts', file);
            }
         });

         console.log('FormData entries:', formData);

         const response = await api.post(`worker/bookings/${details?.id}/materials/receipts/upload`, formData, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
            },
         });
            
         // console.log('MATERIALS RECEIPT RESPONSE', response?.data?.data?.updated_booking[0].receipts);
         setMaterialsReceipt(response?.data?.data?.updated_booking[0].receipts || []);
         setReceipts({images: []});
         setModalVisible(false);
      } catch (error) {
         const message = error?.response?.data?.message || error.message || 'An unknown error occurred while uploading receipt. Please try again.';
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setUploading(false);
      }
   }

   const deleteReceipt = async () => {
      try {
         setDeleting(true);

         console.log(`Deleting Receipt: ${selectedImage} from booking ${details?.id}`);
         const formattedImage = selectedImage.split('/');
         const imageFile = formattedImage[formattedImage.length - 1];
         // const imageFile = selectedImage.replace('https://', "");

         const response = await api.delete(`worker/bookings/${details?.id}/materials/receipts/delete/${imageFile}`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('DELETING MATERIAL', response?.data?.data);
         setMaterialsReceipt(response?.data?.data?.updated_booking[0].receipts || []);
         setImageModalVisible(false);
      } catch (err) {
         const message = err?.response?.data?.message || err.message || 'Aban unknown error occurred while deleting receipt. Please try again.';
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setDeleting(false);
         setDeleteModal(false);
      }
   }

   const openImageModal = (image, canDelete) => {
      setSelectedImage(image);
      setAllowDelete(canDelete);
      setImageModalVisible(true);
   }

   // Effects
   useFocusEffect(
      useCallback(() => {
         initializeReceipts();
      }, [])
   )

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.primary, position: 'relative'}]}>
         {/* Modal Delete */}
         <GeneralModal 
         visible={deleteModal}
         setVisible={setDeleteModal}
         title={'Are you sure you want to delete this receipt?'}
         message={'By deleting this receipt, the system is requiring you to upload one if there are no other receipts.'}
         isAlert={true}
         primaryText={'Yes, Delete'}
         secondaryText={'Cancel'}
         primaryLoading={deleting}
         primaryFunction={deleteReceipt}
         secondaryFunction={() => setDeleteModal(false)}
         />

         {/* Modal Image */}
         <Modal
         visible={imageModalVisible}
         statusBarTranslucent={true}
         animationType='fade'
         backdropColor={'#000'}
         onRequestClose={() => setImageModalVisible(false)}
         >  
            <View style={{flex: 1}}>
               <Header 
               hasBack
               onBack={() => {
                  setImageModalVisible(false);
                  setSelectedImage(null)
               }}
               backColor='#fff'
               backgroundColor='#000'
               rightIcon={(allowDelete && 
                  (details?.status === "Upcoming" ||
                  details?.status === "Ongoing")
               )&& 
                  <TouchableOpacity onPress={() => setDeleteModal(true)}>
                     <Icons name='delete' color={COLORS.red} size={24}/>   
                  </TouchableOpacity>
               }
               />

               <View style={{flexShrink: 1, justifyContent: 'center', alignItems: 'center', width: '100%', maxHeight: '100%', paddingBottom: 64}}>
                  <Image 
                  source={{uri: selectedImage }}
                  style={{
                     height: '100%',
                     width: '100%',
                     resizeMode: 'contain',
                     objectFit: 'contain',
                  }}
                  />
               </View>
            </View>
         </Modal>

         {/* Modal Upload */}
         <Modal
         visible={modalVisible}
         animationType='slide'
         statusBarTranslucent={true}
         backdropColor={COLORS.modalbg}
         onRequestClose={uploading ? null : () => setModalVisible(false)}
         style={{flex: 1}}
         >
            <Pressable 
            style={{flex: 1}}
            onPress={uploading ? null : () => setModalVisible(false)}
            />

            <View 
            style={{
               paddingBottom: insets.bottom + 24,
               paddingHorizontal: 24,
               borderTopLeftRadius: 20,
               borderTopRightRadius: 20,
               backgroundColor: '#fff',
            }}>
               <Text
               style={{
                  padding: 24,
                  textAlign: 'center',
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.primary
               }}>
                  Upload Materials Receipt
               </Text>
               <View style={global.divider}/>

               <View style={{paddingVertical: 12, gap: 12}}>
                  <MediaUpload 
                  maxMedia={5}
                  data={receipts.images}
                  dataName={'images'}
                  setData={setReceipts}
                  mode='both'
                  hasSwitch={true}
                  initialCameraType = 'back'
                  />
               </View>

               <MainButton 
               text={'Upload Receipt'}
               type='primary'
               loading={uploading}
               disabled={receipts.images.length === 0}
               onPress={uploadMaterialsReceipt}
               />
            </View>
         </Modal>

         <Header 
         hasBack
         title="Receipts"
         backgroundColor='#fff'
         />
         <ScrollView
         contentContainerStyle={[{padding: 12, gap: 12}]}
         >  
            <View style={[styles.box]}>
               <Text style={[styles.boxTitle]}>Materials Receipt</Text>
               <View style={global.divider}/>

               <FlatList 
               data={materialsReceipt}
               // scrollEnabled={false}
               keyExtractor={(item, index) => `${item}-${index}`}
               horizontal={true}
               contentContainerStyle={{flexDirection: 'row', gap: 12, paddingVertical: 8, flexGrow: 1}}
               renderItem={({item}) => (
                  <Pressable onPress={() => openImageModal(item, true)}>
                     <ImageBackground
                     source={{uri: item}}
                     style={{
                        height: 72,
                        width: 72,
                        aspectRatio: '1/1',
                        backgroundColor: COLORS.secondary,
                        borderColor: COLORS.labels,
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderRadius: 8,
                        overflow: 'hidden',
                     }} />
                  </Pressable>
               )}
               ListEmptyComponent={
                  <View
                  style={{
                     height: 72,
                     flex: 1,
                     justifyContent: 'center',
                     alignItems: 'center',
                     backgroundColor: COLORS.secondary,
                     borderWidth: 1,
                     borderColor: COLORS.strokes,
                     borderRadius: 8,
                  }}>
                     <Text style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.labels,
                     }}>
                        No materials receipt uploaded yet.
                     </Text>
                  </View>
               }/>

               {(details?.status !== "Completed" && details?.status !== "Pending") &&
                  <UploadButton 
                  title={'Upload Material Receipt'}
                  onPress={() => {setModalVisible(true)}}
                  disabled={false}
                  />
               }
            </View>

            {details?.payment_method === "GCash" &&
               <View style={[styles.box]}>
                  <Text style={[styles.boxTitle]}>GCash Receipt</Text>
                  <View style={global.divider}/>
                  {gcashReceipt ?
                     <Pressable onPress={() => openImageModal(gcashReceipt, false)}>
                        <ImageBackground
                        source={{uri: gcashReceipt}}
                        style={{
                           width: '100%',
                           aspectRatio: '2/1',
                           backgroundColor: COLORS.secondary,
                           borderColor: COLORS.labels,
                           borderStyle: 'dashed',
                           borderWidth: 1,
                           borderRadius: 8,
                           overflow: 'hidden',
                        }} />
                     </Pressable> :
                     <View
                     style={{
                        height: 72,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.secondary,
                        borderWidth: 1,
                        borderColor: COLORS.strokes,
                        borderRadius: 8,
                     }}>
                        <Text style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.sm,
                           color: COLORS.labels,
                        }}>
                           No GCash receipt uploaded yet.
                        </Text>
                     </View>
                  }
                  
               </View>
            }
         </ScrollView>
      </View>
   )
}

export default WorkerBookingReceipt

const UploadButton = ({title, onPress, disabled, disabledText}) => (
   <Pressable 
   onPress={disabled ? null : onPress} 
   style={({pressed}) => [
       {
      opacity: disabled ? 0.8 : 1,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.strokes,
      borderStyle: 'dashed',
      paddingVertical: 4,
      alignItems: 'center',
      backgroundColor: disabled ? COLORS.secondary : (pressed ? COLORS.summaryPress : COLORS.secondary),
   }]}>
      <View 
      style={{
         marginLeft: -32,
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center',
         gap: 8
      }}>
         {!disabled ?
            <Icons name='add' size={24} color={COLORS.accent}/> :
            <View style={{width: 26, height: 26}}/>
         }
         <Text style={{
            fontFamily: FONTS.roboto400,
            fontSize: FONT_SIZES.md,
            color: COLORS.accent,
         }}>
            {disabled ? disabledText : title}
         </Text>
      </View>
   </Pressable>
)

const styles = StyleSheet.create({
   box: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      gap: 8,
   }, 
   boxTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.lg,
      color: COLORS.darkblue,
      textAlign: 'center',
   }
})