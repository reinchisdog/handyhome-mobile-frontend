// Component: General Modal
import {Text, View, Pressable, Modal} from 'react-native';
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

import MainButton from './MainButton';

export default GeneralModal = ({
   visible, setVisible, title, message, isAlert = false,
   primaryText, primaryFunction, primaryLoading = false,
   secondaryText, secondaryFunction, secondaryLoading = false,
}) => {
   return (
      <Modal 
      visible={visible}
      statusBarTranslucent={true}
      animationType='fade'
      backdropColor={COLORS.modalbg}
      onRequestClose={() => setVisible(false)}
      >
         <Pressable
         onPress={() => setVisible(false)}
         style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
         }}>
            <View style={global.centerModal}>
               <Text 
               style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: isAlert ? COLORS.accent : COLORS.primary,
                  textAlign: 'center'
               }}>
                  {title}
               </Text>

               <View style={global.divider}/>

               <Text 
               style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons,
                  textAlign: 'center'
               }}>
                  {message}
               </Text>

               <View 
               style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'stretch'
               }}>
                  { secondaryText &&
                     <Pressable
                     onPress={secondaryLoading ? () => {} : secondaryFunction}
                     style={({pressed}) => [{
                        backgroundColor: pressed && !secondaryLoading ? COLORS.secondaryPress : '#fff',
                        flexShrink: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 22,
                        paddingHorizontal: 16,
                     }]}>   
                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels,
                           opacity: secondaryLoading ? 0.5 : 1
                        }}>
                           {secondaryText}
                        </Text>
                     </Pressable>
                  }

                  { primaryText && 
                     <MainButton 
                     type={isAlert ? 'alert' : 'primary'}
                     size='grow'
                     text={primaryText}
                     onPress={primaryFunction}
                     loading={primaryLoading}
                     />
                  }
               </View>


            </View>

         </Pressable>

      </Modal>
   )
}