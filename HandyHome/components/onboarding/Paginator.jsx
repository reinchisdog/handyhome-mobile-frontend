/* --------------------------------- IMPORTS -------------------------------- */
import { StyleSheet, View , Animated, useWindowDimensions} from 'react-native'
import React from 'react'
// Styles and Icons
import Icons from '@expo/vector-icons/AntDesign';
import { globalStyles as global } from '../../styles/globalStyles';
import { launchStyles as launch } from '../../styles/launchStyles';
import { COLORS, FONT_SIZES } from '../../styles/constants';

export default Paginator = ({slides, scrollX}) => {
  /* ----------------------------- Initialization ----------------------------- */
   const { width } = useWindowDimensions();

   return (
      <View style={styles.onboardNav}>
         {slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [11, 28, 11],
                extrapolate: 'clamp',
            })
            
            const dotColorFill = scrollX.interpolate({
                inputRange,
                outputRange: ['#fff', COLORS.accent, '#fff'],
                extrapolate: 'clamp',
            })

            const dotColorLine = scrollX.interpolate({
                inputRange,
                outputRange: [COLORS.lettersicons, COLORS.accent, COLORS.lettersicons],
                extrapolate: 'clamp',
            })

            return (
                <Animated.View 
                    key={index.toString()} 
                    style={[styles.navButton, { 
                        width: dotWidth,
                        backgroundColor: dotColorFill,
                        borderColor: dotColorLine,
                    }]} 
                />
            )
        })}
    </View>
  )
}

const styles = StyleSheet.create({
    onboardNav: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
      },
      navButton: {
        height: 11,
        borderWidth: 2,
        borderRadius: 24,
      },
})