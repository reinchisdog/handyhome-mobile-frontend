// Component: Address Modal

// Imports
// ---- React Components
import { StyleSheet, Text, View, Modal, Pressable, useWindowDimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
// ---- Other Components
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import MainButton from './MainButton';
import InputBasic from './InputBasic';
import InputDropdown from './InputDropdown';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';
import { globalStyles as global } from '../styles/globalStyles';
// ---- Other Libs
import axios from 'axios';

const AddressModal = ({
   mode = "add", // "add", "update"
   visible,
   setVisible,
   loading = false,
   disabled = false,
   data,
   setData,
   onSubmit,
   onClose,
}) => {
   // Hooks and States
   const insets = useSafeAreaInsets();
   const {width, height} = useWindowDimensions();

   const [ provinceList, setProvinceList ] = useState([]);
   const [ selectedProvince, setSelectedProvince ] = useState(null);

   const [ municipalList, setMunicipalList ] = useState([]);
   const [ selectedMunicipal, setSelectedMunicipal ] = useState(null);

   const [ barangayList, setBarangayList ] = useState([]);
   const [ selectedBarangay, setSelectedBarangay ] = useState(null);

   // Functions
   const setAddressData = (name, value) => {
      if (name === 'province') {
         setData(prev => ({
            ...prev,
            province: value,
            municipal: "",
            barangay: ""
         }))
      } else if (name === 'municipal') {
         setData(prev => ({
            ...prev,
            municipal: value,
            barangay: ""
         }))
      } else if (name === 'barangay') {
         setData(prev => ({
            ...prev,
            barangay: value
         }))
      } else if (name === 'block') {
         setData(prev => ({
            ...prev,
            block: value
         }))
      }
   }

   const getProvinceList = async () => {
      try {
         const provinces = await axios.get('https://psgc.gitlab.io/api/provinces/');
         const districts = await axios.get('https://psgc.gitlab.io/api/districts/');

         const list = [...provinces.data, ...districts.data];
         const filteredList = list.map((item) => {
         return {
            value: item.code,
            title: item.name
         }
         })

         setProvinceList(filteredList);

      } catch (error) {
         console.log(error);
      }
   }

   const getMunicipalList = async (provinceTitle) => {
      const districtCodes = ['133900000', '137400000', '137500000', '137600000'];
      const isDistrict = provinceList.find(p => p.title === provinceTitle && districtCodes.includes(p.value));
      const provinceItem = provinceList.find(p => p.title === provinceTitle);
   
      if (!provinceItem) return;
   
      try {
         let list = [];
         if (isDistrict)
         list = await axios.get(`https://psgc.gitlab.io/api/districts/${provinceItem.value}/cities-municipalities/`);
         else
         list = await axios.get(`https://psgc.gitlab.io/api/provinces/${provinceItem.value}/cities-municipalities/`);
   
         const filteredList = list.data.map((item) => ({
         value: item.code,
         title: item.name
         })).sort((a, b) => a.title.localeCompare(b.title));
   
         setMunicipalList(filteredList);
      } catch (error) {
         console.log(error);
      }
   };
  
   const getBarangayList = async (municipalTitle) => {
      const municipalItem = municipalList.find(m => m.title === municipalTitle);
      if (!municipalItem) return;
   
      try {
         const list = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${municipalItem.value}/barangays/`);
         const filteredList = list.data.map((item) => ({
         value: item.code,
         title: item.name
         }));
   
         setBarangayList(filteredList);
      } catch (error) {
         setBarangayList([]);
      }
   };

   // Effects
   useEffect(() => {
      getProvinceList();
   }, [])

   useEffect(() => {
      if (!selectedProvince) return;

      getMunicipalList(selectedProvince?.value);
   }, [selectedProvince])
   
   useEffect(() => {
      if (!selectedMunicipal) return;

      getBarangayList(selectedMunicipal?.value);
   }, [selectedMunicipal])

   return (
      <Modal
      visible={visible}
      statusBarTranslucent={true}
      animationType='slide'
      backdropColor={COLORS.modalbg}
      onRequestClose={() => {onClose ? onClose() : setVisible(false)}}
      >
         <KeyboardAvoidingView
         behavior='position'
         keyboardVerticalOffset={-insets.bottom - 48}
         >
            <Pressable
            onPress={() => {onClose ? onClose() : setVisible(false)}}
            style={{
               height: height,
               width: width,
               position: 'relative'
            }}>
            
               <View
               style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: width,
                  padding: 24,
                  paddingBottom: insets.bottom,
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  gap: 24
               }}>
                  <Text
                  style={{
                     textAlign: 'center',
                     fontFamily: FONTS.roboto700,
                     fontSize: FONT_SIZES.lg,
                     color: COLORS.primary
                  }}>
                     {mode === "add" ? "Add New Address" : "Update Current Address"}
                  </Text>

                  <View style={global.divider}/>

                  <View style={{ gap: 12 }}>
                     <InputBasic
                     floatLabel={false}
                     placeholder='Block / No. / Street'
                     value={data.block}
                     onChangeText={(e) => setAddressData('block', e)}
                     />

                     <InputDropdown 
                     items={provinceList}
                     placeholder='Province'
                     onSelect={(e) => {
                        setSelectedProvince(e);
                        setSelectedMunicipal(null);
                        setSelectedBarangay(null);
                        setAddressData('province', e.title);
                        getMunicipalList(e.title);
                     }}
                     selectedItem={selectedProvince}
                     />

                     <InputDropdown 
                     items={municipalList}
                     placeholder='City/Municipality'
                     onSelect={(e) => {
                        setSelectedMunicipal(e);
                        setSelectedBarangay(null);
                        setAddressData('municipal', e.title);
                        getBarangayList(e.title);
                     }}
                     selectedItem={selectedMunicipal}
                     />

                     <InputDropdown 
                     items={barangayList}
                     placeholder='Barangay'
                     onSelect={(e) => {
                        setSelectedBarangay(e);
                        setAddressData('barangay', e.title);
                     }}
                     selectedItem={selectedBarangay}
                     />
                  </View>

                  <MainButton 
                  text={mode === "add" ? "Add Address" : "Update Address"}
                  type='primary'
                  onPress={onSubmit}
                  disabled={disabled}
                  loading={loading}
                  />
               </View>
            
            </Pressable>
         </KeyboardAvoidingView>
      </Modal>
   )
}

export default AddressModal

const styles = StyleSheet.create({})