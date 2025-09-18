// Component: Step 1 - Credentials

// Imports
// ---- React Components
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
// ---- Other Components
import Header from '../../../../../../components/Header';
import MainButton from '../../../../../../components/MainButton';
import InputBasic from '../../../../../../components/InputBasic';
import InputDropdown from '../../../../../../components/InputDropdown';
import InputDateTime from '../../../../../../components/InputDateTime';
import DatePicker from 'react-native-date-picker';
import MediaUpload from '../../../../../../components/MediaUpload'
import ApplicationUpload from '../../../../../../components/ApplicationUpload';
import ErrorModal from '../../../../../../components/ErrorModal';
// Contexts
import { useMedia } from '../../../../../../context/MediaContext';
import { useConvert } from '../../../../../../hooks/useConvert';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
import FileIcon from '@expo/vector-icons/FontAwesome6'

const FormCredentials = ({data, setData}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const {convertDateToFormattedDate} = useConvert();

   const { setConfig, returnedImage, openCamera, openImagePicker, openDocumentPicker } = useMedia();
   const [showModal, setShowModal] = useState(false);
   const [modalType, setModalType] = useState(null); //"ids", "certs", "work"
   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const handleSingleData = async (variable) => {
      const file = await openDocumentPicker();

      setData(prev => ({
         ...prev,
         [variable]: file
      }))
   }

   const openModal = (type) => {
      setModalType(type);
      setShowModal(true);
   }

   const verifyModalData = (data) => {
      // console.log(data);
      
      for (const [key, value] of Object.entries(data)) {
         // Check for null/undefined
         if (value === null || value === undefined) {
            throw new Error("All fields must be filled to proceed.");
         }
         
         // Check for invalid dates
         if (value instanceof Date && isNaN(value.getTime())) {
            throw new Error("All fields must be filled to proceed.");
         }
         
         // Check for empty strings
         if (typeof value === 'string' && value.trim() === "") {
            throw new Error("All fields must be filled to proceed.");
         }
         
         // Check for empty arrays
         if (Array.isArray(value) && value.length === 0) {
            throw new Error("All fields must be filled to proceed.");
         }
      }
   };

   const handleModalData = async (data, variable) => {
      try {
         verifyModalData(data);

         setData(prev => ({
            ...prev,
            [variable]: [...prev[variable], data]
         }))

         setShowModal(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when saving your credentials."

         setErrorMessage(message);
         setErrorModal(true);
      }
   }


   return (
      <>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         <Modal
         animationType='slide'
         visible={showModal}
         backdropColor={'#fff'}
         statusBarTranslucent={true}
         >
            <Header 
            hasBack={false}
            leftIcon={
               <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icons2 name='window-close' size={24} color={COLORS.primary}/>
               </TouchableOpacity>
            }/>
            
            {
               modalType === "ids" ? 
                  <ValidIdModal handleModalData={handleModalData}/> :
               modalType === "certs" ? 
                  <CertificateModal handleModalData={handleModalData}/> :
               modalType === "work" ?
                  <ExperienceModal handleModalData={handleModalData}/> :
               null
            }
            
         </Modal>

         <View style={{ gap: 40 }}>
            {/* Valid IDs */}
            <ApplicationUpload 
            icon={<Icons2 name='card-account-details' size={24} color={COLORS.primary}/>}
            maxUpload={2}
            title="2 Valid IDs"
            label="Add Valid ID"
            data={data.primary_id}
            renderData={
               <FlatList 
               scrollEnabled={false}
               data={data.primary_id}
               renderItem={({item, index}) => (
                  <View 
                  style={{
                     width: '100%',
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     paddingVertical: 8,
                     gap: 8
                  }}>
                     <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 1}}>
                        <Image 
                        source={{uri: item.uri}}
                        style={{
                           height: 48,
                           width: 72,
                           objectFit: 'cover',
                           resizeMode: 'cover',
                           borderRadius: 12,
                           borderWidth: 1.5,
                           borderColor: COLORS.strokes,
                        }}/>
                        <View style={{gap: 4, flexShrink: 1}}>
                           <Text 
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.sm,
                              color: COLORS.lettersicons,
                              flexShrink: 1
                           }} 
                           numberOfLines={1}>
                              {item.type}
                           </Text>
                           <Text 
                           style={{
                              fontFamily: FONTS.roboto400,
                              fontSize: FONT_SIZES.xs,
                              color: COLORS.lettersicons
                           }}>
                              {item.number}
                           </Text>
                        </View>
                     </View>
                     <TouchableOpacity 
                     onPress={() => {
                        setData(prev => ({
                           ...prev,
                           primary_id: prev.primary_id.filter((_, i) => i !== index)
                        }))
                     }}>
                        <Icons2 name='window-close' size={24} color={COLORS.lettersicons}/>
                     </TouchableOpacity>
                  </View>
               )}
               />
            }
            onPress={() => openModal("ids")}
            />

            {/* NBI Clearance */}
            <ApplicationUpload 
            icon={<Icons2 name='file-document' size={24} color={COLORS.primary}/>}
            title="NBI Clearance"
            label="Add File"
            data={data.nbi}
            renderData={
               <FileContainer 
               file={data.nbi}
               onDelete={() => setData(prev => ({
                  ...prev, nbi: null
               }))}/>
            }
            onPress={() => handleSingleData("nbi")}
            />

            {/* Barangay Clearance */}
            <ApplicationUpload 
            icon={<Icons1 name='home-filled' size={24} color={COLORS.primary}/>}
            title="Barangay Clearance / Proof of Residence"
            label="Add File"
            data={data.barangay}
            renderData={ 
               <FileContainer 
               file={data.barangay}
               onDelete={() => setData(prev => ({
                  ...prev, barangay: null
               }))}/>
            }
            onPress={() => handleSingleData("barangay")}
            />

            {/* License/Certificates */}
            <ApplicationUpload 
            icon={<Icons2 name='certificate' size={24} color={COLORS.primary}/>}
            maxUpload={3}
            title="License & Certifications (Optional)"
            label="Add Certificate"
            data={data.certificates}
            renderData={
               <FlatList 
               scrollEnabled={false}
               data={data.certificates}
               renderItem={({item, index}) => {
                  return (
                     <View 
                     style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        gap: 8
                     }}>
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 1}}>
                           <Image 
                           source={{uri: item.uri}}
                           style={{
                              height: 48,
                              width: 72,
                              objectFit: 'cover',
                              resizeMode: 'cover',
                              borderRadius: 12,
                              borderWidth: 1.5,
                              borderColor: COLORS.strokes,
                           }}/>

                           <View style={{gap: 4, flexShrink: 1}}>
                              <Text 
                              style={{
                                 fontFamily: FONTS.roboto500,
                                 fontSize: FONT_SIZES.sm,
                                 color: COLORS.lettersicons,
                                 flexShrink: 1
                              }} 
                              numberOfLines={1}>
                                 {item.name}
                              </Text>
                              <Text 
                              style={{
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.xs,
                                 color: COLORS.lettersicons
                              }}>
                                 {`${item.organization} (${convertDateToFormattedDate(item.date, '/')})`}
                              </Text>
                           </View>
                        </View>
                        <TouchableOpacity 
                        onPress={() => {
                           setData(prev => ({
                              ...prev,
                              certificates: prev.certificates.filter((_, i) => i !== index)
                           }))
                        }}>
                           <Icons2 name='window-close' size={24} color={COLORS.lettersicons}/>
                        </TouchableOpacity>
                     </View>
                  )}}
               />
            }
            onPress={() => openModal("certs")}
            />

            {/* Work Experience */}
            <ApplicationUpload 
            icon={<Icons2 name='tools' size={24} color={COLORS.primary}/>}
            maxUpload={3}
            title="Work Experience"
            label="Add Experience"
            data={data.experience}
            renderData={
               <FlatList 
               scrollEnabled={false}
               data={data.experience}
               renderItem={({item, index}) => {
                  return (
                     <View 
                     style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        gap: 8
                     }}>
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 1}}>
                           <View style={{gap: 4, flexShrink: 1}}>
                              <Text 
                              style={{
                                 fontFamily: FONTS.roboto500,
                                 fontSize: FONT_SIZES.sm,
                                 color: COLORS.lettersicons,
                                 flexShrink: 1
                              }} 
                              numberOfLines={1}>
                                 {`${item.company} (${item.title})`}
                              </Text>
                              <Text 
                              style={{
                                 fontFamily: FONTS.roboto400,
                                 fontSize: FONT_SIZES.xs,
                                 color: COLORS.lettersicons
                              }}>
                                 {`${convertDateToFormattedDate(item.start_date, '/')} - ${convertDateToFormattedDate(item.end_date, '/')}`}
                              </Text>
                           </View>
                        </View>
                        <TouchableOpacity 
                        onPress={() => {
                           setData(prev => ({
                              ...prev,
                              experience: prev.experience.filter((_, i) => i !== index)
                           }))
                        }}>
                           <Icons2 name='window-close' size={24} color={COLORS.lettersicons}/>
                        </TouchableOpacity>
                     </View>
                  )}}
               />
            }
            onPress={() => openModal("work")}
            />
         </View>
      </>
   )
}

const FileContainer = ({file, onDelete}) => {
   const getFileIconName = () => {
      const mime = file?.mimeType?.toLowerCase();

      if (mime === "application/pdf") return "file-pdf";
      if (mime === "image/png" || mime === "image/jpeg") return "file-image";
      if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "file-word";
      
      return "file"; // fallback
   };

   return (
      <View 
      style={{
         width: '100%',
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         paddingVertical: 8,
         gap: 8
      }}>
         <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 1}}>
            <FileIcon 
            name={getFileIconName()}
            size={24}
            color={COLORS.lettersicons}
            />
            <View style={{gap: 4, flexShrink: 1}}>
               <Text 
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons,
                  flexShrink: 1
               }} 
               numberOfLines={1}>
                  {file.name}
               </Text>
               <Text 
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.xs,
                  color: COLORS.lettersicons
               }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
               </Text>
            </View>
         </View>
         <TouchableOpacity onPress={onDelete}>
            <Icons2 name='window-close' size={24} color={COLORS.lettersicons}/>
         </TouchableOpacity>
      </View>
   )
}

// Components: Modals
const ValidIdModal = ({handleModalData}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();

   const idTypes = [
      {title: "UMID", value: "UMID"},
      {title: "Driver's License", value: "Driver's License"},
      {title: "PRC ID", value: "PRC ID"},
      {title: "Passport", value: "Passport"},
      {title: "SSS ID", value: "SSS ID"},
      {title: "National ID", value: "National ID"},
      {title: "Other", value: "Other"},
   ]   
   const [data, setData] = useState({
      uri: null,
      number: "",
      type: ""
   })

   const handleSave = () => {
      handleModalData(data, "primary_id")

   }

   return (
      <KeyboardAwareScrollView
      contentContainerStyle={{
         flexGrow: 1,
         paddingHorizontal: 24,
         paddingBottom: insets.bottom + 24,
         gap: 24,
         justifyContent: 'space-between',
      }}>
         <View style={{gap: 24, flex: 1,}}>
            {/* ---- Title */}
            <Text 
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.darkblue,
               textAlign: 'left',
            }}>
               Add Valid ID
            </Text>
            {/* ---- Content */}

             <Image 
               source={require(`../../../../../../assets/images/illustrations/Photo-Guide-2.png`)}
               style={{
                  width: 148,
                  height: 148,
                  aspectRatio: 1/1,
                  alignSelf: 'center'
               }}/>

            <InputDropdown 
            placeholder='Type of ID'
            items={idTypes}
            onSelect={(e) => setData(prev => ({
               ...prev,
               type: e.value
            }))}
            selectedItem={data.type}
            />

            <InputBasic 
            placeholder='ID Number'
            onChangeText={(e) => setData(prev => ({
               ...prev,
               number: e
            }))}
            value={data.number}
            floatColor='#fff'
            />

            <MediaUpload 
            maxMedia={1}
            data={data.uri}
            dataName={"uri"}
            setData={setData}
            mode = "both"
            hasSwitch ={false}
            initialCameraType={'back'}
            />
         </View>
         
         <MainButton 
         type='primary'
         text='Save'
         onPress={handleSave}
         />
      </KeyboardAwareScrollView>
   )
}

const CertificateModal = ({handleModalData}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const {convertDateToFormattedDate} = useConvert();

   const [data, setData] = useState({
      uri: null,
      name: "",
      organization: "",
      date: null
   })
   const [showPicker, setShowPicker] = useState(false);
   
   // Functions
   const handleSave = () => {
      handleModalData(data, "certificates")
   }

   return (
      <KeyboardAwareScrollView
      contentContainerStyle={{
         flexGrow: 1,
         paddingHorizontal: 24,
         paddingBottom: insets.bottom + 24,
         gap: 24,
         justifyContent: 'space-between',
      }}>
         <DatePicker 
         modal
         open={showPicker}
         date={data.date || new Date()}
         mode="date"
         onConfirm={(result) => {
            setData(prev => ({
               ...prev,
               date: result
            }))
            setShowPicker(false);
         }}
         onCancel={() => {setShowPicker(false)}}
         theme='light'
         dividerColor={COLORS.accent}
         maximumDate={new Date()}
         />

         <View style={{gap: 24, flex: 1,}}>
            {/* ---- Title */}
            <Text 
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.darkblue,
               textAlign: 'left',
            }}>
               Add License of Certification
            </Text>
            {/* ---- Content */}
            <InputBasic 
            placeholder='Name of Certificate'
            onChangeText={(e) => setData(prev => ({
               ...prev,
               name: e
            }))}
            value={data.name}
            floatColor='#fff'
            />

            <InputBasic 
            placeholder='Issue Organization'
            onChangeText={(e) => setData(prev => ({
               ...prev,
               organization: e
            }))}
            value={data.organization}
            floatColor='#fff'
            />

            <InputDateTime 
            type={"date"}
            placeholder={"Issue Date"}
            value={convertDateToFormattedDate(data.date, "long")}
            onPress={() => setShowPicker(true)}
            />

            <MediaUpload 
            maxMedia={1}
            data={data.uri}
            dataName={"uri"}
            setData={setData}
            mode = "both"
            hasSwitch ={false}
            initialCameraType={'back'}
            />
         </View>
         
         <MainButton 
         type='primary'
         text='Save'
         onPress={handleSave}
         />
      </KeyboardAwareScrollView>
   )
}

const ExperienceModal = ({handleModalData}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const {convertDateToFormattedDate} = useConvert();

   const [data, setData] = useState({
      title: "",
      company: "",
      start_date: null,
      end_date: null
   })
   const [showPicker, setShowPicker] = useState(false);
   const [pickerMode, setPickerMode] = useState(null);

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("")
   
   // Functions
   const handleSave = () => {
      try {
         validateDates();
         handleModalData(data, "experience");
      } catch (err) {
         const message = err?.message || "An unknown error has occurred when setting the date. Please try again.";
         setErrorMessage(message);
         setErrorModal(true);
      }
      
   }

   const validateDates = () => {
      // Check if both dates are selected
      if (!data.start_date || !data.end_date) {
         // You might want to show an error message here
         throw new Error("Please select both start and end dates");
      }

      // Check if start date is before end date
      if (data.start_date >= data.end_date) {
         // You might want to show an error message here
         throw new Error("Start date must be before end date");
      }
   }

   const handleDatePicker = (mode) => {
      setPickerMode(mode);
      setShowPicker(true);
   }

   const onDateConfirm = (selectedDate) => {
      setData(prev => {
         const newData = {
            ...prev,
            [pickerMode]: selectedDate
         };

         // Auto-adjust dates if they become invalid
         if (pickerMode === "start_date" && prev.end_date && selectedDate >= prev.end_date) {
            // If new start date is after current end date, clear end date
            newData.end_date = null;
         }

         return newData;
      });
      setShowPicker(false);
   }

   // Calculate date constraints
   const getDateConstraints = () => {
      const today = new Date();
      
      if (pickerMode === "start_date") {
         return {
            maximumDate: data.end_date ? new Date(data.end_date.getTime() - 24 * 60 * 60 * 1000) : today, // Day before end date or today
            minimumDate: null // No minimum constraint for start date
         };
      } else if (pickerMode === "end_date") {
         return {
            maximumDate: today, // Can't be in the future
            minimumDate: data.start_date ? new Date(data.start_date.getTime() + 24 * 60 * 60 * 1000) : null // Day after start date
         };
      }
      
      return {
         maximumDate: today,
         minimumDate: null
      };
   };

   const constraints = getDateConstraints();

   return (
      <KeyboardAwareScrollView
      contentContainerStyle={{
         flexGrow: 1,
         paddingHorizontal: 24,
         paddingBottom: insets.bottom + 24,
         gap: 24,
         justifyContent: 'space-between',
      }}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title={"Something went wrong"}
         message={errorMessage}
         />

         <DatePicker 
         modal
         open={showPicker}
         date={data[pickerMode] || new Date()}
         mode="date"
         onConfirm={onDateConfirm}
         onCancel={() => {setShowPicker(false)}}
         theme='light'
         dividerColor={COLORS.accent}
         maximumDate={constraints.maximumDate}
         minimumDate={constraints.minimumDate}
         />

         <View style={{gap: 24, flex: 1,}}>
            {/* ---- Title */}
            <Text 
            style={{
               fontFamily: FONTS.roboto700,
               fontSize: FONT_SIZES.xxl,
               color: COLORS.darkblue,
               textAlign: 'left',
            }}>
               Company Affiliation
            </Text>
            {/* ---- Content */}
            <InputBasic 
            placeholder='Job Title'
            onChangeText={(e) => setData(prev => ({
               ...prev,
               title: e
            }))}
            value={data.title}
            floatColor='#fff'
            />

            <InputBasic 
            placeholder='Company'
            onChangeText={(e) => setData(prev => ({
               ...prev,
               company: e
            }))}
            value={data.company}
            floatColor='#fff'
            />

            <InputDateTime 
            type={"date"}
            placeholder={"From"}
            value={convertDateToFormattedDate(data.start_date, "long")}
            onPress={() => handleDatePicker("start_date")}
            />

            <InputDateTime 
            type={"date"}
            placeholder={"To"}
            value={convertDateToFormattedDate(data.end_date, "long")}
            onPress={() => handleDatePicker("end_date")}
            />

         </View>
         
         <MainButton 
         type='primary'
         text='Save'
         onPress={handleSave}
         />
      </KeyboardAwareScrollView>
   )
}


export default FormCredentials

const styles = StyleSheet.create({})