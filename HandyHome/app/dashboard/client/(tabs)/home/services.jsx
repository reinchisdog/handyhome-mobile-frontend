// Screen: All Services Screen

// Imports
// ---- React and Expo Components
import { Text, TouchableOpacity, View, FlatList, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAppData } from '../../../../../context/AppDataContext';
// ---- Other Components
import Header from '../../../../../components/Header';
import ServiceItem from '../../../../../components/ServiceItem';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS } from '../../../../../styles/constants';

const ServicesScreen = () => {
   // Hooks and States
   const router = useRouter();
   const { width } = useWindowDimensions();
   const { services } = useAppData();

   // Constants
   const numColumns = Math.floor((width - 48) / 72);
   const gap = numColumns > 1 ? (width - 48 - (numColumns * 72)) / (numColumns - 1) : 0;

   return (
      <View style={ [global.screenContainer, {backgroundColor: COLORS.screenbg}]}>
         <Header 
         title={"Services"}
         />
         <View
         style={{
            flex: 1,
            alignItems: 'center',
            padding: 24,
         }}>
            <FlatList 
            data={services}
            renderItem={({item}) => (
               <ServiceItem 
               item={item}
               onPress={() => {router.push({
                  pathname: `/dashboard/client/home/service/[id]`,
                  params: {id: item.id, name: item.name}
               })}}
               />
            )}
            initialNumToRender={10}
            numColumns={numColumns}
            columnWrapperStyle={{
               columnGap: gap
            }}
            />
         </View>
      </View>
   )
}

export default ServicesScreen
