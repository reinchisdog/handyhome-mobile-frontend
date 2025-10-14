// Subscreen: Location Details

// Import
// Hooks and React Components
import { Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSignup } from '../../../context/SignupContext';
// Components
import BasicInput from '../../../components/authentication/BasicInput';
import DropdownBox from '../../../components/authentication/DropdownBox';
import InputBasic from '../../../components/InputBasic';
import InputDropdown from '../../../components/InputDropdown';
// Styles and Icons
import { authStyles as auth } from '../../../styles/authStyles';
// Other Libraries
import axios from 'axios';

const LocationDetails = () => {
  // Hooks and States
  const { signupData, updateHomeData } = useSignup();
  const [ provinceList, setProvinceList ] = useState([]);
  const [ selectedProvince, setSelectedProvince ] = useState(null);

  const [ municipalList, setMunicipalList ] = useState([]);
  const [ selectedMunicipal, setSelectedMunicipal ] = useState(null);

  const [ barangayList, setBarangayList ] = useState([]);
  const [ selectedBarangay, setSelectedBarangay ] = useState(null);

  const [fetching, setFetching] = useState(false);

  /* -------------------------------- Functions ------------------------------- */
  useEffect(() => {
    getProvinceList();
  }, [])
  // ---- List Loads
  const getProvinceList = async () => {
    try {
      setFetching(true);
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
    } finally {
      setFetching(false);
    }
  }

  const getMunicipalList = async (provinceTitle) => {
    const districtCodes = ['133900000', '137400000', '137500000', '137600000'];
    const isDistrict = provinceList.find(p => p.title === provinceTitle && districtCodes.includes(p.value));
    const provinceItem = provinceList.find(p => p.title === provinceTitle);
  
    if (!provinceItem) return;
  
    try {
      setFetching(true);
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
    } finally {
      setFetching(false);
    }
  };
  
  const getBarangayList = async (municipalTitle) => {
    const municipalItem = municipalList.find(m => m.title === municipalTitle);
    if (!municipalItem) return;
  
    try {
      setFetching(true);
      const list = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${municipalItem.value}/barangays/`);
      const filteredList = list.data.map((item) => ({
        value: item.code,
        title: item.name
      }));
  
      setBarangayList(filteredList);
    } catch (error) {
      setBarangayList([]);
    } finally {
      setFetching(false);
    }
  };
  
  useEffect(() => {
    if (!selectedProvince) return;
    
    if (municipalList.length > 0) {
      setMunicipalList([]);
      setBarangayList([]);
      setSelectedMunicipal(null);
      setSelectedBarangay(null);
      updateHomeData('municipal', '');
      updateHomeData('barangay', '');
    }

    getMunicipalList(selectedProvince?.title);
  }, [selectedProvince])

  useEffect(() => {
    if (!selectedProvince) return;

    if (barangayList.length > 0) {
      setBarangayList([]);
      setSelectedBarangay(null);
      updateHomeData('barangay', '');
    }

    getBarangayList(selectedMunicipal?.title);
  }, [selectedMunicipal])

  // When province list loads, match saved title and fetch municipal list
  useEffect(() => {
    if (signupData.home_address.province && provinceList.length > 0) {
      const match = provinceList.find(p => p.title === signupData.home_address.province);
      if (match) {
        setSelectedProvince(match);
        getMunicipalList(match.title); 
      } else {
        console.warn("[Location Details] Invalid province:", signupData.home_address.province);
        updateHomeData('province', ''); 
      }
    }
  }, [provinceList, signupData.home_address.province]);

  // When municipal list loads, match saved title and fetch barangay list
  useEffect(() => {
    if (signupData.home_address.municipal && municipalList.length > 0) {
      const match = municipalList.find(p => p.title === signupData.home_address.municipal);
      if (match) {
        setSelectedMunicipal(match);
        getBarangayList(match.title); 
      } else {
        console.warn("[Location Details] Invalid municipal:", signupData.home_address.municipal);
        updateHomeData('municipal', ''); 
      }
    }
  }, [municipalList, signupData.home_address.municipal]);

  // When barangay list loads, match saved title
  useEffect(() => {
    if (signupData.home_address.barangay && barangayList.length > 0) {
      const match = barangayList.find(p => p.title === signupData.home_address.barangay);
      if (match) setSelectedBarangay(match);
      else {
        console.warn("[Location Details] Invalid barangay:", signupData.home_address.barangay);
        updateHomeData('barangay', ''); 
      }
    }
  }, [barangayList, signupData.home_address.barangay]);



  return (
    <View style={auth.inputsContainer}>
      {/* -------------------------- Personal Information -------------------------- */}
      <View style={auth.inputSet}>
        <Text style={auth.inputSetTitle}>ADDRESS</Text>
        {/* ---- Block Number */}
        <InputBasic
        placeholder={"Block / No. / Street"}
        onChangeText={(e) => updateHomeData('block', e)}
        value={signupData.home_address.block}
        />

        {/* ---- Province/District */}
        <InputDropdown
        placeholder='Select Province'
        items={provinceList}
        onSelect={(e) => {
          setSelectedProvince(e);
          updateHomeData('province', e.title);
        }}
        selectedItem={selectedProvince}
        loading={fetching}
        />

        {/* ---- Municipality */}
        <InputDropdown 
        items = {municipalList}
        placeholder="Select City/Municipality"
        onSelect={(e) => {
          setSelectedMunicipal(e);
          updateHomeData('municipal', e.title);
        }}
        selectedItem={selectedMunicipal}
        loading={fetching}
        />

        {/* ---- Barangay */}
        <InputDropdown
        items = {barangayList}
        placeholder="Select Barangay"
        onSelect={(e) => {
          setSelectedBarangay(e);
          updateHomeData('barangay', e.title);
        }}
        
        selectedItem={selectedBarangay}
        loading={fetching}
        />
        
      </View>

    </View>
  )
}

export default LocationDetails;
