/* --------------------------------- Imports -------------------------------- */
import { StyleSheet, Text, View , KeyboardAvoidingView, SafeAreaView, Platform, TouchableOpacity, TouchableHighlight} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useNavigation } from 'expo-router';

import axios from 'axios';
/* ------------------------------- Components ------------------------------- */
import BasicInput from '../../../components/authentication/BasicInput';
import DropdownBox from '../../../components/authentication/DropdownBox';
/* ---------------------------- Styles and Icons ---------------------------- */
import Icons from '@expo/vector-icons/AntDesign';
import { globalStyles as global } from '../../../styles/globalStyles';
import { authStyles as auth } from '../../../styles/authStyles';

const LocationDetails = ({signupData, setSignupData}) => {
  /* ----------------------------- Initialization ----------------------------- */
  const [ provinceList, setProvinceList ] = useState([]);
  const [ selectedProvince, setSelectedProvince ] = useState({});

  const [ municipalList, setMunicipalList ] = useState([]);
  const [ selectedMunicipal, setSelectedMunicipal ] = useState({});

  const [ barangayList, setBarangayList ] = useState([]);
  const [ selectedBarangay, setSelectedBarangay ] = useState({});

  /* -------------------------------- Functions ------------------------------- */
  useEffect(() => {
    getProvinceList();
  }, [])
  // ---- List Loads
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
  const getMunicipalList = async (code) => {
    const districtCodes = ['133900000', '137400000', '137500000', '137600000'];
    const isDistrict = districtCodes.includes(code);

    try {
      let list = [];
      if (isDistrict) list = await axios.get(`https://psgc.gitlab.io/api/districts/${code}/cities-municipalities/`);
      else list = await axios.get(`https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/`);

      const filteredList = list.data.map((item) => {
        return {
          value: item.code,
          title: item.name
        }
      }).sort((a, b) => a.title.localeCompare(b.title));

      setMunicipalList(filteredList);

    } catch(error) {
      console.log(error);
    }
  }
  const getBarangayList = async (code) => {
    try {
      const list = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${code}/barangays/`);
      const filteredList = list.data.map((item) => {
        return {
          value: item.code,
          title: item.name
        }
      })

      setBarangayList(filteredList);

    } catch (error) {
      setBarangayList([]);
    }
  }

  useEffect(() => {
    getMunicipalList(selectedProvince.value);
  }, [selectedProvince])

  useEffect(() => {
    getBarangayList(selectedMunicipal.value);
  }, [selectedMunicipal])

  // on List
  useEffect(() => {
    if (signupData.province && provinceList.length > 0) {
      const match = provinceList.find(p => p.title === signupData.province);
      console.log('Province: ', match)
      if (match) setSelectedProvince(match)
    }
  }, [provinceList, signupData.province])

  useEffect(() => {
    if (signupData.municipal && municipalList.length > 0) {
      const match = municipalList.find(p => p.title === signupData.municipal);
      console.log('Municipality: ', match)
      if (match) setSelectedMunicipal(match)
    }
  }, [municipalList, signupData.municipal])

  useEffect(() => {
    if (signupData.barangay && barangayList.length > 0) {
      const match = barangayList.find(p => p.title === signupData.barangay);
      console.log('Barangay: ', match)
      if (match) setSelectedBarangay(match)
    }
  }, [barangayList, signupData.barangay])



  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Personal Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>ADDRESS</Text>
        {/* ---- Block Number */}
        <BasicInput 
          placeholder={"Block / No. / Street"}
          onChangeText={(e) => setSignupData((prev) => ({
            ...prev,
            home_address: {
              ...prev.home_address,
              block: e
            }
          }))}
          value={signupData.home_address.block}
        />

        {/* ---- Province/District */}
        <DropdownBox 
          defaultItem='Select Province'
          items = {provinceList}
          onSelect={(e) => {
            setSelectedProvince(e);
            setSelectedMunicipal({});
            setSelectedBarangay({});
            setSignupData(prev => ({
              ...prev,
              home_address: {
                ...prev.home_address,
                province: e.title,
                municipal: "",
                barangay: ""
              }
              
            }));
          }}
          
          selectedItem={selectedProvince}
        />
        {/* ---- Municipality */}
        <DropdownBox 
          items = {municipalList}
          defaultItem="Select City/Municipality"
          onSelect={(e) => {
            setSelectedMunicipal(e);
            setSelectedBarangay({});
            setSignupData(prev => ({
              ...prev,
              home_address: {
                ...prev.home_address,
                municipal: e.title,
                barangay: ""
              }
            }));
          }}
          
          selectedItem={selectedMunicipal}
        />
        {/* ---- Barangay */}
        <DropdownBox 
          items = {barangayList}
          defaultItem="Select Barangay"
          onSelect={(e) => {
            setSelectedBarangay(e);
            setSignupData(prev => ({
              ...prev,
              home_address: {
                ...prev.home_address,
                barangay: e.title
              }
            }));
          }}
          
          selectedItem={selectedBarangay}
        />
        
      </View>

    </View>
  )
}

export default LocationDetails;
