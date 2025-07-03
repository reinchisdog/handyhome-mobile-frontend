import {Text, View, Pressable, Modal} from 'react-native';
import { globalStyles as global } from '../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../styles/constants';

import MainButton from './MainButton';

export default ErrorModal = ({visible, setVisible, title, message, onExit, buttonText}) => {
   return (
      <Modal
      visible={visible}
      statusBarTranslucent={true}
      backdropColor={COLORS.modalbg}>
         <View
         style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
         }}>
            <View style={global.centerModal}>
               <Text style={{
                  fontFamily: FONTS.roboto700,
                  fontSize: FONT_SIZES.md,
                  color: COLORS.red,
                  textAlign: 'center',
               }}>{title}</Text>

               <View style={global.divider}/>

               <Text style={{
                  fontFamily: FONTS.roboto400,
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.lettersicons,
                  textAlign: 'center'
               }}>{message}</Text>

               <MainButton 
               text={buttonText || "Ok"}
               type="secondary"
               onPress={onExit ? onExit : () => setVisible(false)}
               />
            </View>
         </View>

      </Modal>
   );
}