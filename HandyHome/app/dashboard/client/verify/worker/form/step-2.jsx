// Component: Step 2 - Work Samples

// Imports
// ---- React Components
import { StyleSheet, Text, View } from 'react-native'
// ---- Other Components
import MediaUpload from '../../../../../../components/MediaUpload'
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../../styles/constants';

const FormWorkSamples = ({data, setData}) => {
   return (
      <View style={{gap: 24}}>
         <Text
         style={{
            fontFamily: FONTS.roboto500,
            fontSize: FONT_SIZES.md,
            color: COLORS.lettersicons
         }}>
            Show us your best completed projects. (Up to 5 images)
         </Text>

         <MediaUpload 
         maxMedia={5}
         data={data.work_samples}
         dataName={"work_samples"}
         setData={setData}
         mode='both'
         hasSwitch={true}
         initialCameraType='back'
         />
      </View>
   )
}

export default FormWorkSamples

const styles = StyleSheet.create({})