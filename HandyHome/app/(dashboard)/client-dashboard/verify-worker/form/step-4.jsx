import { StyleSheet, Text, View, Pressable, FlatList, useWindowDimensions, Touchable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';
import { ServiceIconMap } from '../../../../../components/ServiceIconMap';
import {useAppData} from '../../../../../context/AppDataContext'

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import axios from 'axios';
import { API_URL } from '../../../../../config';

export default OfferedServicesScreen = () => {
   const {height} = useWindowDimensions();

   const {services} = useAppData();

   const {
      workerVerify,
      setWorkerVerify,
   } = useWorkerVerify();

   const [showList, setShowList] = useState(false);
   const [subServiceList, setSubServiceList] = useState([]);

   const fetchSubServices = async (id) => {
      try {
         const result = await axios.get(`${API_URL}/general/sub-services/${id}`);
         console.log(result.data.data);
         return result.data.data;
      } catch (err) {
         console.log(err)
      }
   }

   const handleServiceSelect = async (id, name) => {
      setWorkerVerify(prev => ({
         ...prev,
         offeredService: {
            id: id,
            name: name
         }
      }));

      const list = await fetchSubServices(id);

      setSubServiceList([ ...list ]);

      setShowList(true);
   }
   
   const handleSubserviceSelect = (id, name) => {
      setWorkerVerify(prev => ({
         ...prev,
         offeredSubService:  {
            id: id,
            name: name
         }
      }));

      setShowList(false);
   }

   const selectedService = services.find(service => service.id === workerVerify?.offeredService?.id ?? null)

   return (
      <View
      style={{
         alignItems: 'center',
         gap: 24,
         minHeight: height - 144 - 48 - 64,
      }}>
         <Text style={styles.instruction}>
            {`Select the ${
               !showList ? "Main" : selectedService.name
            } Service you offer`}
         </Text>
         {!showList ? (
            <ServicesList 
            handleSelect={handleServiceSelect} 
            selected={workerVerify?.offeredService?.id ?? null}/>
            ) : (
            <SubServicesList 
            list={subServiceList} 
            handleSelect={handleSubserviceSelect} 
            selected={workerVerify?.offeredSubService?.id ?? null}/>
         )}
      </View>
   )
}

const ServicesList = ({ handleSelect, selected }) => {
   const {services} = useAppData();

   return (
      <View
      style={{
         flexDirection: 'row',
         flexWrap: 'wrap',
         justifyContent: 'flex-start', 
         gap: 8,
      }}
      >
         {services.map(item => (
            <React.Fragment key={item.id}>
               <ServiceItem item={item} onPress={() => handleSelect(item.id, item.name)} selectedItem={selected} />
            </React.Fragment>
         ))}
      </View>
   );
};

const ServiceItem = ({item, selectedItem, onPress}) => {
   return (
      <View style={{alignItems: 'center'}}>
         <Pressable
         onPress={onPress}
         style={({pressed}) => [{
            backgroundColor: pressed ? COLORS.lightblue : 'transparent',
            paddingVertical: 8,
            borderRadius: 8,
            width: 72, 
            height: 120, 
            alignItems: 'center',
            gap: 10,
         }]}>
            <View style={{
               backgroundColor: COLORS.secondary,
               justifyContent: 'center',
               alignItems: 'center',
               height: 60,
               aspectRatio: '1/1',
               borderRadius: 30,
               borderWidth: (selectedItem != null && item.id === selectedItem) ? 2 : 0,
               borderColor: COLORS.lightblue,
            }}>
               <ServiceIconMap serviceId={item.id} />
            </View>
            <Text style={{
               color: COLORS.lettersicons,
               textAlign: 'center',
               fontFamily: FONTS.roboto500 ,
               fontSize: FONT_SIZES.sm,
            }}>
               {item.name}
            </Text>
         </Pressable>
      </View>
   )
}

const SubServicesList = ({list, handleSelect, selected}) => {
   return (
      <View style={{gap: 16, alignItems: 'flex-start'}}>
         {list.map(item => (
            <View key={item.id} style={{flexDirection: 'row', gap: 8 ,alignItems: 'center', width: '100%'}}>
               <TouchableOpacity
               style={{
                  height: 22,
                  width: 22,
                  aspectRatio: '1/1',
                  borderRadius: 11,
                  borderWidth: 1,
                  borderColor: COLORS.lettersicons,
                  justifyContent: 'center',
                  alignItems: 'center'
               }}
               onPress={() => handleSelect(item.id, item.name)}>
               {(selected === item.id) && 
                  <View 
                  style={{
                     backgroundColor: COLORS.accent,
                     width: 16,
                     height: 16,
                     aspectRatio: '1/1',
                     borderRadius: 8
                  }}
                  />
               }
               </TouchableOpacity>
               <TouchableWithoutFeedback
               onPress={() => handleSelect(item.id, item.name)}>
                  <Text style={styles.instruction}>{item.name}</Text>
               </TouchableWithoutFeedback>
            </View>
         ))}
      </View>
   )
}


const styles = StyleSheet.create({
   instruction: {
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons,
      textAlign: 'left',
      width: '100%'
   }
})