// Component: Step 3 - Work Services

// Imports
// ---- React Components
import { StyleSheet, Text, View, FlatList, useWindowDimensions, Pressable } from 'react-native';
import { useState } from 'react';
// ---- Contexts
import {useAppData} from '../../../../../../context/AppDataContext'
import api from '../../../../../../lib/api';
// ---- Other Components
import ServiceItem from '../../../../../../components/ServiceItem';
import LoadingDots from '../../../../../../components/LoadingDots';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';

const FormServices = ({data, setData}) => {
   // Hooks and States
   const { width } = useWindowDimensions();
   const { services } = useAppData();

   const [subservices, setSubservices] = useState([]);
   const [subLoading, setSubLoading] = useState(false);
   const [switchView, setSwitchView] = useState(false);

   // Constants
   const numColumns = Math.max(1, Math.floor((width - 48) / 72));
   const gap = numColumns > 1 ? (width - 48 - (numColumns * 72)) / (numColumns - 1) : 0;
   
   // Functions
   const handleSelect = (variable, name, id) => {
      setData(prev => ({
         ...prev,
         [variable]: {
            name: name,
            id: id,
         }
      }))
   }

   const fetchSubservices = async (id) => {
      try {
         setSubLoading(true);
         const res = await api.get(`/general/sub-services/${id}`);

         setSubservices(res?.data?.data);
      } catch (err) {
         console.log(err);
      } finally {
         setSubLoading(false);
      }
   }

   return (
      <View style={{gap: 24}}>
         <View style={{gap: 8}}>
            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }}>
               Service: <Text style={{fontFamily: FONTS.roboto400, color: COLORS.labels}}>
                  {data?.service?.name || "Not Selected"}
               </Text>
            </Text>

            <Text style={{
               fontFamily: FONTS.roboto600,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons
            }}>
               Sub-service: <Text style={{fontFamily: FONTS.roboto400, color: COLORS.labels}}>
                  {data?.sub_service?.name || "Not Selected"}
               </Text>
            </Text>
         </View>
         
         {!switchView ?
            <FlatList 
            key={`services-${numColumns}`}
            scrollEnabled={false}
            data={services}
            renderItem={({item}) => (
               <ServiceItem 
               item={item}
               onPress={() => {
                  if (data?.service?.id !== item.id) {
                     setData(prev => ({
                        ...prev,
                        sub_service: null
                     }))
                  }

                  handleSelect("service", item?.name, item?.id)
                  fetchSubservices(item?.id);
                  setSwitchView(true);
               }}
               selectedItem={data?.service?.id}
               color={COLORS.screenbg}
               />
            )}
            initialNumToRender={10}
            numColumns={numColumns}
            columnWrapperStyle={{
               columnGap: gap
            }}/> :

            <FlatList 
            key="subservices" 
            data={subservices}
            scrollEnabled={false}
            renderItem={({item}) => (
               <ServiceOption 
               label={item?.name}
               selected={data?.sub_service?.id === item?.id}
               onPress={() => {
                  handleSelect("sub_service", item?.name, item?.id)
                  setSubservices([]);
                  setSwitchView(false);
               }}/>
            )}
            contentContainerStyle={{gap: 4}}
            ListHeaderComponent={
               <Text
               style={{
                  fontFamily: FONTS.roboto600,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.labels,
                  marginBottom: 12
               }}>
                  {`Select ${data?.service?.name} Services you offer:`}
               </Text>
            }
            ListFooterComponent={
               (subLoading || subservices.length === 0) && (
                  <View
                  style={{
                     marginTop: 24,
                     alignItems: 'center',
                     justifyContent: 'center'
                  }}>
                     <LoadingDots size={12}/>
                  </View>

               )
            }/>
         }
         
      </View>
   )
}

const ServiceOption = ({ label, selected, onPress }) => (
   <Pressable 
   onPress={onPress}
   style={({pressed}) => [{
      flexDirection: 'row', 
      gap: 8, alignItems: 'center',
      borderRadius: 8,
      backgroundColor: pressed ? COLORS.summaryPress : 'transparent',
      paddingVertical: 4,
      paddingHorizontal: 8,
   }]}>
      <View
      style={{
         height: 24,
         width: 24,
         aspectRatio: '1/1',
         borderRadius: 12,
         borderWidth: 1,
         borderColor: COLORS.labels,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: COLORS.secondary
      }}>
         <View 
         style={{
            width: 16,
            height: 16,
            aspectRatio: 1/1,
            borderRadius: 8,
            backgroundColor: selected ? COLORS.accent : COLORS.secondary
         }}/>
      </View>
      <View
      style={{height: 24}}
      >
         <Text style={{fontFamily: FONTS.roboto500, fontSize: FONT_SIZES.md, color: COLORS.lettersicons}}>
            {label}
         </Text>
      </View>
   </Pressable>
);

export default FormServices

const styles = StyleSheet.create({})