import { 
   StyleSheet, 
   Text, 
   View, 
   Image, 
   TouchableOpacity, 
   TouchableHighlight, 
   ImageBackground, 
   Pressable, 
   Modal, 
   useWindowDimensions,
   ScrollView,
   TextInput
 } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCamera } from '../../../../../context/CameraContext';
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';
import DropdownBox from '../../../../../components/authentication/DropdownBox';

import Icons1 from '@expo/vector-icons/MaterialIcons';
import Icons2 from '@expo/vector-icons/MaterialCommunityIcons';
import FileIcon from '@expo/vector-icons/FontAwesome6'
import Header from '../../../../../components/dashboard/Header';

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const AddButton = ({label, children, onPress}) => {
   const [ modal, setModal ] = useState(false);

   const handlePress = () => {
      if (children)
         setModal(true)
      else if (onPress)
         onPress();
   }

   return (
      <>
         <Pressable
         onPress={handlePress}
         style={({pressed}) => [{
            backgroundColor: pressed ? COLORS.lightblue : COLORS.secondary,
            paddingVertical: 4,
            borderRadius: 24,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: COLORS.strokes,
            width: '100%',
         }]}>
            <View style={{
               marginLeft: -24,
               flexDirection: 'row',
               justifyContent: 'center',
               alignItems: 'center',
            }}>
               <Icons1 name='add' size={24} color={COLORS.primary}/>
               <Text 
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.lettersicons,
                  opacity: 0.8
               }}>
                  {label}
               </Text>
            </View>
         </Pressable>

         <Modal
         animationType='slide'
         visible={modal}
         backdropColor={'#fff'}
         statusBarTranslucent={true}
         >
            <Header 
            background='#fff'
            left={
               <TouchableOpacity onPress={() => setModal(false)}>
                  <Icons2 name='window-close' size={24} color={COLORS.primary}/>
               </TouchableOpacity>
            }/>

            {children && children({ setModal })}

         </Modal>
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
      <View style={[styles.fileContainer]}>
         <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexShrink: 1}}>
            <FileIcon 
            name={getFileIconName()}
            size={24}
            color={COLORS.lettersicons}
            />
            <View style={{gap: 4, flexShrink: 1}}>
               <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
               <Text style={styles.fileSize}>
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

export default CredentialsScreen = () => {
   const {height} = useWindowDimensions();

   const {
      workerVerify,
      setWorkerVerify,
      fileInfo,
      setFileInfo,
   } = useWorkerVerify();

   const handleDocument = async (variable) => {
      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'avif']

      try {
         const result = await DocumentPicker.getDocumentAsync({
            type: [
               'image/*', 
               'application/pdf', 
               'application/officedocument.wordprocessingml.document'
            ],
            multiple: false
         });

         if (result.canceled === false) {
            const extension = result.assets[0].name.split('.').pop().toLowerCase();  //name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
               alert('Invalid File Type');
               return;
            }

            setWorkerVerify(prev => {
               const current = prev[variable];
               const newUri = result.assets[0].uri;  //uri;

               return {
                  ...prev,
                  [variable]: Array.isArray(current) ?
                     [...current, newUri] :
                     current ?
                        [current, newUri] :
                        newUri,
               };
            });

            setFileInfo(prev => {
               const current = prev[variable];

               return {
                  ...prev,
                  [variable]: Array.isArray(current) ?
                     [...current, result.assets[0]] :
                     current ?
                        [current, result.assets[0]] :
                        result.assets[0],
               };
            });
         }
      } catch (e) {
         console.error('File pick error: ', e);
      }
   };

   const deleteDocument = (variable, index = null) => {
      setWorkerVerify(prev => {
         const current = prev[variable];
         if (Array.isArray(current) && index !== null) {
            const updated = [...current];
            updated.splice(index, 1);
            return { ...prev, [variable]: updated };
         } else {
            return {...prev, [variable]: null};
         }
      })

      setFileInfo(prev => {
         const current = prev[variable];
         if (Array.isArray(current) && index != null) {
            const updated = [...current];
            updated.splice(index, 1);
            return { ...prev, [variable]: updated };
         } else {
            return { ...prev, [variable]: null };
         }
      })
   };

   return (
      <View 
      style={{
         alignItems: 'center',
         gap: 40,
         minHeight: height - 144 - 48 -64
      }}>

         {/* -------------------------------- Valid IDs ------------------------------- */}
         <View style={styles.category}>
            {/* ---- Header */}
            <View style={styles.categoryHeaderCont}>
               <Icons2 name='card-account-details' size={24} color={COLORS.primary}/>
               <Text style={styles.categoryHeaderText}>2 Valid IDs</Text>
            </View>

            {/* ---- Content */}
            
            {/* -------- Render Valid IDs  */}
            <View 
            style={{
               flexDirection: 'row',
               gap: 4,
               flexWrap: 'wrap'
            }}>
            {workerVerify.validIds.map((item, index) => (   
               <ImageBackground
               key={index}
               source={{uri: item.file}}
               style={styles.imageContainer}
               imageStyle={styles.imageUpload}>
                  <TouchableOpacity
                  style={styles.imageDelete}
                  onPress={() => setWorkerVerify(prev => {
                     const current = prev.validIds;
                     
                     if (Array.isArray(current) && index !== null) {
                        const updated = [...current];
                        updated.splice(index, 1);
                        return { ...prev, validIds: updated };
                     } else {
                        return {...prev, validIds: null};
                     }
                  })}>
                     <Icons2 name='window-close' size={12} color={'#fff'}/>
                  </TouchableOpacity>
               </ImageBackground>
            ))}
            </View>
            
            {// -------- Add Button
            (workerVerify.validIds.length !== 2) && (
               <AddButton label={"Add Valid ID"}>
                  {({setModal}) => (
                     <ValidIdModal setModal={setModal}/>
                  )}
               </AddButton>
            )
            }
         </View>

         {/* ------------------------------ NBI Clearance ----------------------------- */}
         <View style={styles.category}>
            {/* ---- Header */}
            <View style={styles.categoryHeaderCont}>
               <Icons2 name='file-document' size={24} color={COLORS.primary}/>
               <Text style={styles.categoryHeaderText}>NBI Clearance</Text>
            </View>
            
            {/* ---- Content */}

            {// -------- NBI Clearance Render and Add Button
            (workerVerify.nbiClearance || fileInfo.nbiClearance) ? 
               <FileContainer
               file={fileInfo.nbiClearance}
               onDelete={() => deleteDocument('nbiClearance')}
               /> :
               
               <AddButton 
               label={"Add File"} 
               onPress={() => handleDocument('nbiClearance')}
               />
            }
         </View>

         {/* ------------------ Barangay Clearance/Proof of Residence ----------------- */}
         <View style={styles.category}>
            {/* ---- Header */}
            <View style={styles.categoryHeaderCont}>
               <Icons1 name='home-filled' size={24} color={COLORS.primary}/>
               <Text style={styles.categoryHeaderText}>Barangay Clearance / Proof of Residence</Text>
            </View>

            {/* ---- Content */}

            {// -------- Barangay Clearance Render and Add Button
            (workerVerify.brgyClearance || fileInfo.brgyClearance) ? 
               <FileContainer
               file={fileInfo.brgyClearance}
               onDelete={() => deleteDocument('brgyClearance')}
               /> :
               
               <AddButton 
               label={"Add File"} 
               onPress={() => handleDocument('brgyClearance')}
               />
            }
         </View>

         {/* ----------------------------- Certifications ----------------------------- */}
         <View style={styles.category}>
            {/* ---- Header */}
            <View style={styles.categoryHeaderCont}>
               <Icons2 name='certificate' size={24} color={COLORS.primary}/>
               <Text style={styles.categoryHeaderText}>License & Certifications (Optional)</Text>   
            </View>

            {/* ---- Content */}

            {// -------- Certifications Render 
            fileInfo.certifications.map((item, index) => (
               <React.Fragment key={index}>
                  <FileContainer
                  file={item}
                  onDelete={() => deleteDocument('certifications', index)}
                  />
               </React.Fragment>
            ))
            }

            {// -------- Add Button
            (workerVerify.certifications.length !== 5 || fileInfo.certifications.length !== 5) && (
               <AddButton label={"Add Valid ID"}>
                  {({setModal}) => (
                     <CertificationsModal setModal={setModal}/>
                  )}
               </AddButton>
            )
            }
         </View>

         {/* ------------------------------- Experience ------------------------------- */}
         <View style={styles.category}>
            {/* ---- Header */}
            <View style={styles.categoryHeaderCont}>
               <Icons2 name='tools' size={24} color={COLORS.primary}/>
               <Text style={styles.categoryHeaderText}>Work Experience</Text>
            </View>


            {// -------- Experience Render 
            (workerVerify.experience)? (
               <View style={[styles.fileContainer]}>
                  <View style={{gap: 4, alignItems: 'flex-start', flexShrink: 1}}>
                     <Text style={styles.fileName} numberOfLines={1}>
                        {workerVerify.experience.title}
                     </Text>
                     <Text style={styles.fileSize}>
                        {`${workerVerify.experience.fromDate.toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                        })} - ${workerVerify.experience.toDate.toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                        })}`}
                     </Text>
                  </View>
                  <TouchableOpacity 
                  onPress={() => setWorkerVerify(prev => ({
                     ...prev,
                     experience: null
                  }))}>
                     <Icons2 name='window-close' size={24} color={COLORS.lettersicons}/>
                  </TouchableOpacity>
               </View>
            ) : (
               <AddButton label={"Add Valid ID"}>
                  {({setModal}) => (
                     <ExperienceModal setModal={setModal}/>
                  )}
               </AddButton>
            )
            }

         </View>
      </View>
   )
}

/* --------------------------------- MODALS --------------------------------- */
const ValidIdModal = ({setModal}) => {
   const { 
      openCamera,
      // forceCloseCamera,
      image,
      setImage,
      setCameraFace
   } = useCamera();

   const {
      setWorkerVerify,
   } = useWorkerVerify();
      
   useEffect(() => {
      setCameraFace("back");
   }, []);

   const [validId, setValidId] = useState({
      type: null,
      number: "",
      file: null
   })

   useEffect(() => {
      if (image) {
         setValidId(prev => ({
            ...prev,
            file: image
         }))
         
      }

      setImage(null)

   }, [image])

   const handleSave = () => {
      setWorkerVerify(prev => {
         const current = prev.validIds

         return {
            ...prev,
            validIds: Array.isArray(current) ?
               [...current, validId] :
               current ?
                  [current, validId] :
                  validId,
         };
      });
      setModal(false);
   }

   return (
      <View style={{flex: 1}}>
         {/* --------------------------------- Content -------------------------------- */}
         <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Valid ID</Text>

            <Image 
            source={require('../../../../../assets/images/illustrations/Photo-Guide-1.png')}
            style={[styles.illustrationCont]}/>
            
            {/* ---- ID Type */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Type of Valid ID</Text>
               <DropdownBox 
               defaultItem = 'Type of ID'
               items = {[
                  {title: "UMID", value: "UMID"},
                  {title: "Driver's License", value: "Driver's License"},
                  {title: "Passport", value: "Passport"},
                  {title: "National ID", value: "National ID"},
               ]}
               onSelect={(e) => setValidId(prev => ({
                  ...prev,
                  type: e
               }))}
               selectedItem={validId.type}
               />
            </View>

            {/* ---- ID Number */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>ID Number</Text>
               <View style={styles.modalInputBox}>
                  <TextInput 
                  onChangeText={(e) => setValidId(prev => ({
                     ...prev,
                     number: e
                  }))}
                  value={validId.number}
                  placeholder='(e.g., 1234-56789-ABC)'
                  placeholderTextColor={COLORS.labels}
                  style={[styles.modalInputText, {paddingHorizontal: 16}]}
                  />
               </View>
            </View>
            
            {/* ---- ID Image */}
            <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               if (!validId.file) openCamera()
            }}>
               <ImageBackground
               source={{uri: validId.file}}
               style={styles.imageContainer}
               imageStyle={styles.imageUpload}>
                  {(validId.file) ? 
                     <TouchableOpacity
                     style={styles.imageDelete}
                     onPress={() => setValidId(prev => ({
                        ...prev,
                        file: null
                     }))}>
                        <Icons2 name='window-close' size={12} color={'#fff'}/>
                     </TouchableOpacity> :
                     <View style={{alignItems: 'center', gap: 4}}>
                        <Icons2 name='image-plus' size={24} color={COLORS.lettersicons}/>
                        <Text style={{fontFamily: FONTS.roboto400, fontSize: FONT_SIZES.xs, color: COLORS.labels}}>Add Photo</Text>
                     </View>
                  }
               </ImageBackground>
            </TouchableOpacity>
         </ScrollView>

         {/* --------------------------------- Button --------------------------------- */}
         <View style={[global.buttonsContainer]}>
            <TouchableHighlight style={global.primaryBtn}
            underlayColor='#0072bc'
            onPress={handleSave}>
               <Text style={global.primaryBtnText}>Save</Text>
            </TouchableHighlight>
         </View>
      </View>
   )
}

const CertificationsModal = ({setModal}) => {
   const {
      setWorkerVerify,
      setFileInfo
   } = useWorkerVerify();
   
   const [showDate, setShowDate] = useState(false);

   const [certification, setCertification] = useState({
      name: "",
      organization: "",
      date: null,
      file: null
   })

   const handleDate = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShowDate(false);
      setCertification(prev => ({
         ...prev,
         date: currentDate
      }))
   }

   const handleFile = async () => {
      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'avif']

      try {
         const result = await DocumentPicker.getDocumentAsync({
            type: [
               'image/*', 
               'application/pdf', 
               'application/officedocument.wordprocessingml.document'
            ],
            multiple: false
         });

         if (result.canceled === false) {
            const extension = result.assets[0].name.split('.').pop().toLowerCase();  //name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
               alert('Invalid File Type');
               return;
            }

            setCertification(prev => ({
               ...prev,
               file: result.assets[0]
            }))
         }
      } catch (e) {
         console.error('File pick error: ', e);
      }
   }

   const handleSave = () => {
      setWorkerVerify(prev => {
         const current = prev.certifications;
         const newUri = certification.file.uri;  //uri;

         return {
            ...prev,
            certifications: Array.isArray(current) ?
               [...current, {...certification, file: newUri}] :
               current ?
                  [current, {...certification, file: newUri}] :
                  {...certification, file: newUri},
         };
      });

      setFileInfo(prev => {
         const current = prev.certifications;

         return {
            ...prev,
            certifications: Array.isArray(current) ?
               [...current, certification.file] :
               current ?
                  [current, certification.file] :
                  certification.file,
         };
      });

      setModal(false);
   }

   return (
      <View style={{flex: 1}}>
         {/* --------------------------------- Content -------------------------------- */}
         <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add License or Certification</Text>

            {/* ---- Certificate Name */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Name of Certificate</Text>
               <View style={styles.modalInputBox}>
                  <TextInput 
                  onChangeText={(e) => setCertification(prev => ({
                     ...prev,
                     name: e
                  }))}
                  value={certification.name}
                  placeholder='(e.g., Plumbing Associate)'
                  placeholderTextColor={COLORS.labels}
                  style={[styles.modalInputText, {paddingHorizontal: 16}]}
                  />
               </View>
            </View>

            {/* ---- Certiticate Organization */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Issue Organization</Text>
               <View style={styles.modalInputBox}>
                  <TextInput 
                  onChangeText={(e) => setCertification(prev => ({
                     ...prev,
                     organization: e
                  }))}
                  value={certification.organization}
                  placeholder='(e.g., TESDA)'
                  placeholderTextColor={COLORS.labels}
                  style={[styles.modalInputText, {paddingHorizontal: 16}]}
                  />
               </View>
            </View>
            
            {/* ---- Certificate Date */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Issue Date</Text>
               <Pressable 
               onPress={() => setShowDate(true)}
               style={styles.modalInputBox}>
               {!certification.date ?
                  <Text style={[styles.modalInputText, {paddingHorizontal: 16, color: COLORS.labels}]}>
                     Select issue date
                  </Text> :
                  <Text style={[styles.modalInputText, {paddingHorizontal: 16}]}>
                     {certification.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                     })}
                  </Text> 
               }
                  <Icons2 name='calendar-month' size={24} color={COLORS.lettersicons} />
               </Pressable>
            </View>

            {/* ---- Certificate File */}
            {(certification.file) ?
               <FileContainer
               file={certification.file}
               onDelete={() => setCertification(prev => ({
                  ...prev,
                  file: null
               }))}
               /> :

               <AddButton 
               label={"Add File"}
               onPress={handleFile}
               />
            }
            
         </ScrollView>

         {/* --------------------------------- Button --------------------------------- */}
         <View style={[global.buttonsContainer]}>
            <TouchableHighlight style={global.primaryBtn}
            underlayColor='#0072bc'
            onPress={handleSave}>
               <Text style={global.primaryBtnText}>Save</Text>
            </TouchableHighlight>
         </View>

         {(showDate) &&
            <DateTimePicker
            value={certification.date ?? new Date()}
            mode='date'
            maximumDate={new Date()}
            onChange={handleDate}/>
         }
      </View>
   )
}

const ExperienceModal = ({setModal}) => {
   const {
      setWorkerVerify,
   } = useWorkerVerify();

   const [experience, setExperience] = useState({
      title: "",
      company: "",
      fromDate: null,
      toDate: null
   })

   const [showDate, setShowDate] = useState(false);
   const [activeField, setActiveField] = useState(null);

   const handleDate = (event, selectedDate) => {
      if (event.type === 'set' && selectedDate) {
         setExperience(prev => ({
            ...prev,
            [activeField]: selectedDate
         }));
      }
      setShowDate(false);
      setActiveField(null);
   }

   const handleSave = () => {
      setWorkerVerify(prev => ({
         ...prev,
         experience
      }));

      setModal(false);
      console.log("finish save")
   }

   return (
      <View style={{flex: 1}}>
         {/* --------------------------------- Content -------------------------------- */}
         <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add License or Certification</Text>

            {/* ---- Job Title */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Job Title</Text>
               <View style={styles.modalInputBox}>
                  <TextInput 
                  onChangeText={(e) => setExperience(prev => ({
                     ...prev,
                     title: e
                  }))}
                  value={experience.title}
                  placeholder='(e.g., Plumbing Associate)'
                  placeholderTextColor={COLORS.labels}
                  style={[styles.modalInputText, {paddingHorizontal: 16}]}
                  />
               </View>
            </View>

            {/* ---- Company */}
            <View style={styles.modalInputCont}>
               <Text style={styles.modalInputTitle}>Company</Text>
               <View style={styles.modalInputBox}>
                  <TextInput 
                  onChangeText={(e) => setExperience(prev => ({
                     ...prev,
                     company: e
                  }))}
                  value={experience.company}
                  placeholder='(e.g., Plumber Association of the Philippines)'
                  placeholderTextColor={COLORS.labels}
                  style={[styles.modalInputText, {paddingHorizontal: 16}]}
                  />
               </View>
            </View>
            
            <View style={{flexDirection: 'row', gap: 24}}>
               {/* ---- From Date */}
               <View style={[styles.modalInputCont, {width: 0, flex: 1}]}>
                  <Text style={styles.modalInputTitle}>From</Text>
                  <Pressable 
                  onPress={() => {
                     setActiveField('fromDate'); 
                     setShowDate(true);
                  }}
                  style={styles.modalInputBox}>
                  {!experience.fromDate ?
                     <Text style={[styles.modalInputText, {paddingHorizontal: 16, color: COLORS.labels}]}>
                        Select From Date
                     </Text> :
                     <Text style={[styles.modalInputText, {paddingHorizontal: 16}]}>
                        {experience.fromDate.toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                        })}
                     </Text> 
                  }
                     <Icons2 name='calendar-month' size={24} color={COLORS.lettersicons} />
                  </Pressable>
               </View>

               {/* ---- To Date */}
               <View style={[styles.modalInputCont, {width: 0, flex: 1}]}>
                  <Text style={styles.modalInputTitle}>To</Text>
                  <Pressable 
                  onPress={() => {
                     setActiveField('toDate'); 
                     setShowDate(true);
                  }}
                  style={styles.modalInputBox}>
                  {!experience.toDate ?
                     <Text style={[styles.modalInputText, {paddingHorizontal: 16, color: COLORS.labels}]}>
                        Select To Date
                     </Text> :
                     <Text style={[styles.modalInputText, {paddingHorizontal: 16}]}>
                        {experience.toDate.toLocaleDateString('en-US', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric'
                        })}
                     </Text> 
                  }
                     <Icons2 name='calendar-month' size={24} color={COLORS.lettersicons} />
                  </Pressable>
               </View>
            </View>
            

            
         </ScrollView>

         {/* --------------------------------- Button --------------------------------- */}
         <View style={[global.buttonsContainer]}>
            <TouchableHighlight style={global.primaryBtn}
            underlayColor='#0072bc'
            onPress={handleSave}>
               <Text style={global.primaryBtnText}>Save</Text>
            </TouchableHighlight>
         </View>

         {(showDate) &&
            <DateTimePicker
            value={experience[activeField] || new Date()}
            mode='date'
            maximumDate={new Date()}
            onChange={handleDate}/>
         }
      </View>
   )
}

const styles = StyleSheet.create({
   category: {
      gap: 8,
      alignItems: 'flex-start',
      width: '100%'
   },
   categoryHeaderCont: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center'
   },
   categoryHeaderText: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      flexShrink: 1
   },
   imageContainer: {
      height: 72,
      width: 72,
      aspectRatio: '1/1',
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.labels,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
   },
   imageUpload: {
      objectFit: 'cover'
   },
   imageDelete: {
      position: 'absolute',
      top: 6,
      right: 6,
      opacity: 0.5,
      width: 16,
      height: 16,
      borderRadius: 4,
      backgroundColor: COLORS.lettersicons,
      justifyContent: 'center',
      alignItems: 'center'
   },
   fileContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      gap: 8
   },
   fileName: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.lettersicons,
      flexShrink: 1
   },
   fileSize: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.xs,
      color: COLORS.lettersicons
   },
   modalTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.xxl,
      color: COLORS.darkblue,
      width: '100%',
      textAlign: 'left',
      flexShrink: 1
   },
   modalInputCont: {
      width: '100%',
      alignItems: 'flex-start',
      gap: 4
   },
   modalInputTitle: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels,
      textAlign: 'left',
   },
   modalInputBox: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 48,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: COLORS.labels,
      position: 'relative',
      backgroundColor: 'white',
   },
   modalInputText: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: '#3D3D3D',
      lineHeight: FONT_SIZES.sm*1.2
   },
   modalInputIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      aspectRatio: '1/1',
    },
   modalContent: {
      flex: 1,
      padding: 24,
      gap: 24,
   },
   illustrationCont: {
      aspectRatio: '1/1',
      height: 148,
      marginHorizontal: 'auto'
   },
})