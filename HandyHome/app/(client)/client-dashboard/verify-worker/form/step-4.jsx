import { StyleSheet, Text, View, Pressable, FlatList, useWindowDimensions, Touchable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWorkerVerify } from '../../../../../context/WorkerVerificationContext';
import { ServiceIconMap } from '../../../../../components/ServiceIconMap';

import Icons from '@expo/vector-icons/MaterialCommunityIcons';

import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const SERVICES = [
   {id: 1,
      name: "Plumbing",
      subservice: [
         {id: 1, name: "Leak Repair"},
         {id: 2, name: "Pipe installation"},
         {id: 3, name: "Faucet/shower replacement"},
         {id: 4, name: "Toilet unclogging"},
         {id: 5, name: "Drain cleaning"},
         {id: 6, name: "Water heater repair"},
      ],
   },
   {id: 2,
      name: "Electrical",
      subservice: [
         {id: 7, name: "Outlet/switch repair"},
         {id: 8, name: "Circuit breaker issues"},
         {id: 9, name: "Lighting installation"},
         {id: 10, name: "Electrical wiring"},
         {id: 11, name: "Ceiling fan installation"},
         {id: 12, name: "Power restoration"},
      ],
   },
   {id: 3,
      name: "Cleaning",
      subservice: [
         {id: 13, name: "Outlet/switch repair"},
         {id: 14, name: "Circuit breaker issues"},
         {id: 15, name: "Lighting installation"},
      ],
   },
   {id: 4,
      name: "Appliance Repair",
      subservice: [
         {id: 16, name: "Washing Machine"},
         {id: 17, name: "Refrigerator"},
         {id: 18, name: "Electric Fan"},
         {id: 19, name: "Microwave"},
         {id: 20, name: "Oven"},
         {id: 21, name: "Stove"},
         {id: 22, name: "Rice Cooker"},
      ],
   },
   {id: 5,
      name: "Aircon Technician",
      subservice: [
         {id: 23, name: "Cleaning (Window Type / Split Type)"},
         {id: 24, name: "Installation"},
         {id: 25, name: "Freon Charging"},
         {id: 26, name: "Repair & troubleshooting"},
         {id: 27, name: "Dismantling"},
      ],
   },
   {id: 6,
      name: "Pest Control",
      subservice: [
         {id: 28, name: "Cockroach control"},
         {id: 29, name: "Ant control"},
         {id: 30, name: "Mosquito fogging"},
         {id: 31, name: "Termite treatment"},
         {id: 32, name: "Rat control"},
         {id: 33, name: "General pest inspection"},
      ],
   },
   {id: 7,
      name: "Upholstery",
      subservice: [
         {id: 34, name: "Cleaning"},
         {id: 35, name: "Repair"},
      ],
   },
]

export default OfferedServicesScreen = () => {
   const {height} = useWindowDimensions();

   const {
      workerVerify,
      setWorkerVerify,
   } = useWorkerVerify();

   const [subList, setSubList] = useState(false);

   const handleServiceSelect = (id, name) => {
      setWorkerVerify(prev => ({
         ...prev,
         offeredService: {
            id: id,
            name: name
         }
      }));

      setSubList(true);
   }
   
   const handleSubserviceSelect = (id, name) => {
      setWorkerVerify(prev => ({
         ...prev,
         offeredSubService:  {
            id: id,
            name: name
         }
      }));

      setSubList(false);
   }

   const selectedService = SERVICES.find(service => service.id === workerVerify?.offeredService?.id ?? null)

   return (
      <View
      style={{
         alignItems: 'center',
         gap: 24,
         minHeight: height - 144 - 48 - 64,
      }}>
         <Text style={styles.instruction}>
            {`Select the ${
               !subList ? "Main" : selectedService.name
            } Service you offer`}
         </Text>
         {!subList ? (
            <ServicesList 
            handleSelect={handleServiceSelect} 
            selected={workerVerify?.offeredService?.id ?? null}/>
            ) : (
            <SubServicesList 
            list={selectedService.subservice} 
            handleSelect={handleSubserviceSelect} 
            selected={workerVerify?.offeredSubService?.id ?? null}/>
         )}
      </View>
   )
}

const ServicesList = ({ handleSelect, selected }) => {
   return (
      <View
      style={{
         flexDirection: 'row',
         flexWrap: 'wrap',
         justifyContent: 'flex-start', 
         gap: 8,
      }}
      >
         {SERVICES.map(item => (
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
               backgroundColor: '#fff',
               justifyContent: 'center',
               alignItems: 'center',
               height: 60,
               aspectRatio: '1/1',
               borderRadius: 30,
               borderWidth: (item.id === selectedItem) ? 2 : 0,
               borderColor: COLORS.lightblue,
            }}>
               <ServiceIconMap serviceName={item.name} />
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