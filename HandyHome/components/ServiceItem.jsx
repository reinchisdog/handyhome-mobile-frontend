import { StyleSheet, Text, View, Pressable, FlatList, useWindowDimensions, Touchable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { ServiceIconMap } from './ServiceIconMap';

import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

export default ServiceItem = ({item, selectedItem, onPress}) => {
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
            <View 
            style={{
               backgroundColor: '#fff',
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