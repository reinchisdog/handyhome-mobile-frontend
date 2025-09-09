// Screen: Profile Address

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ---- Contexts
import { useAuth } from '../../../../context/AuthContext';
import { useAppData } from '../../../../context/AppDataContext';
// ---- Other Components
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Header from '../../../../components/Header';
import MainButton from '../../../../components/MainButton';
import AddressContainer from '../../../../components/AddressContainer';
import ErrorModal from '../../../../components/ErrorModal';
import AddressModal from '../../../../components/AddressModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';
// ---- Other Libs
import api from '../../../../lib/api';


const ProfileAddress = () => {
   // Hooks and States
   const {token, user, tryFetchUser} = useAuth();
   const {addresses, addressLoading, fetchAddresses} = useAppData();
   const router = useRouter();
   const insets = useSafeAreaInsets();

   const [selectedAddress, setSelectedAddress] = useState(null);
   const [saveLoading, setSaveLoading] = useState(false);
   const [saveDisabled, setSaveDisabled] = useState(true);

   const [newAddress, setNewAddress] = useState({
      block: null,
      barangay: null,
      municipal: null,
      province: null,
   })
   const [newAddressLoading, setNewAddressLoading] = useState(false);
   const [showNewAddress, setShowNewAddress] = useState(false);

   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const handleAddressUpdate = async () => {
      try {
         setSaveLoading(true);
         console.log("---- [Prodile Address] Change Address Attempt ----");
         console.log(`[1] CHange Address to ID: ${selectedAddress} of User ${user?.ful_name}`);
         await api.put(`/user/addresses/${selectedAddress}`, {}, {
            headers: {'Authorization': `Bearer ${token}`}
         })

         console.log("[2] Address Change Succesful, Fetching Updated User");
         tryFetchUser(token);
      } catch (err) {
         console.log("[0] Address Change Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when changing your booking address. Please try again.";
         setErrorMessage(message);
         setShowError(true);
      } finally {
         setSaveLoading(false);
      }
   }

   const verifyAddressAdd = () => {
      const isFilled = 
         !!newAddress.block && newAddress.block.trim() !== "" &&
         !!newAddress.barangay && newAddress.barangay.trim() !== "" &&
         !!newAddress.municipal && newAddress.municipal.trim() !== "" &&
         !!newAddress.province && newAddress.province.trim() !== "";

      return isFilled
   }

   const handleAddressAdd = async () => {
      try {
         setNewAddressLoading(true);
         console.log("---- [Profile Addresses] Add Address Attempt ----")
         console.log("[3] Verifying Data:", newAddress);

         if (!verifyAddressAdd()) {
            throw new Error ('Address fields are not all filled. Please enter the appropriate address to continue.');
         }

         console.log("[2] Adding New Address:", newAddress);
         await api.post(`/user/addresses`, newAddress, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         console.log("[3] Address Add Succesful, Fetching Updated Addresses ");
         await fetchAddresses();

         console.log("[4] Addresses Fetch Succesful");
         setShowNewAddress(false);
      } catch(err) {
         console.log("[0] Address Add Error");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when adding a new booking address. Please try again.";
         setErrorMessage(message);
         setShowError(true);
      } finally {
         setNewAddressLoading(false);
      }
   }

   const clearNewAddress = () => {
      setNewAddress({
         block: null,
         barangay: null,
         municipal: null,
         province: null,
      })
      setShowNewAddress(false);
   }

   // Effects
   useFocusEffect(
      useCallback(() => {
         fetchAddresses();
         setSelectedAddress(user?.address_id)
      }, [])
   )

   useEffect(() => {
      if (selectedAddress === null || selectedAddress === user?.address_id) 
         setSaveDisabled(true)
      else 
         setSaveDisabled(false)
   }, [selectedAddress, user?.address_id])

   return (
      <KeyboardProvider>
         <ErrorModal 
         visible={showError}
         setVisible={setShowError}
         title={"Address Error"}
         message={errorMessage}
         />

         <AddressModal 
         mode='add'
         visible={showNewAddress}
         setVisible={setShowNewAddress}
         loading={newAddressLoading}
         data={newAddress}
         setData={setNewAddress}
         onSubmit={handleAddressAdd}
         onClose={clearNewAddress}
         />

         <View
         style={[
            global.screenContainer, {
            backgroundColor: COLORS.screenbg,
            position: 'relative'
         }]}>
            <Header 
            hasBack
            title={"My Addresses"}
            backgroundColor='#fff'
            rightIcon={(
               <TouchableOpacity
               onPress={() => setShowNewAddress(true)}>
                  <Icons name='map-marker-plus' size={24} color={COLORS.accent}/>
               </TouchableOpacity>
            )}
            />

            <FlatList 
            data={addresses}
            renderItem={({item}) => (
               <AddressContainer 
               item={item}
               selected={selectedAddress}
               onSelect={() => setSelectedAddress(item.id)}
               />
            )}
            contentContainerStyle={{
               padding: 24,
               gap: 12,
            }}
            />

            <View
            style={[
               global.shadowBottom, {
               position: 'absolute',
               bottom: 0,
               left: 0,
               right: 0,
               paddingBottom: insets.bottom,
               paddingHorizontal: 24,
               paddingTop: 24,
               borderRadius: 20,
               backgroundColor: '#fff'
            }]}>
               <MainButton 
               type='primary'
               text={"Save"}
               loading={saveLoading}
               disabled={saveDisabled}
               onPress={handleAddressUpdate}
               />
            </View>
         </View>
      </KeyboardProvider>
   )
}

export default ProfileAddress

const styles = StyleSheet.create({})