import { 
  Platform, 
  StatusBar,
  StyleSheet,
  useWindowDimensions
} from "react-native";

import { COLORS, FONT_SIZES, FONTS } from './constants';

export const authStyles = StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 22,
    },
    stylizedHeader: {
      width: '100%',
      height: 208,
      backgroundColor: COLORS.primary,
      overflow: 'hidden',
      borderBottomEndRadius: 42,
      borderBottomStartRadius: 42,
    },
    headerContainer: {
      paddingHorizontal: 24,
      paddingTop: 24,
      display: 'flex',
      gap: 14
    },
    headerTitle: {
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.xxxl, 
      width: '100%'
    },
    headerDescription: {
      fontFamily: FONTS.roboto400,
      fontSize: FONT_SIZES.sm, 
      width: '100%'
    },
    inputsContainer: {
      display: 'flex',
      gap: 24,
      padding: 24
    },
    inputSet: {
      display: 'flex',
      gap: 16
    },
    inputSetTitle: {
      textAlign: 'center',
      color: COLORS.primary,
      fontFamily: FONTS.roboto700,
      fontSize: FONT_SIZES.sm,
    }, 
    textGeneral: {
      padding: 2,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: COLORS.lettersicons
    },
    textLinks: {
      padding: 2,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: COLORS.accent
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: 48,
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: COLORS.lettersicons,
      position: 'relative',
      backgroundColor: 'white',
    },
    multilineContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minHeight: 48,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: COLORS.lettersicons,
      position: 'relative',
      backgroundColor: 'white',
      alignItems: 'flex-start'
    },
    inputIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      aspectRatio: '1/1',
    },
    inputText: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: FONTS.roboto500,
      fontSize: FONT_SIZES.sm,
      letterSpacing: 0.2,
      color: '#3D3D3D',
      lineHeight: FONT_SIZES.sm*1.2
    },
    dropdownList: {
      backgroundColor: 'white',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      position: "absolute",
      zIndex: 999,
      elevation: 999,
      minHeight: 48,
      width: '90%',
      maxHeight: '50%',
      marginTop: -48,
    },
    dropdownItem: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      height: 48,
      paddingHorizontal: 24,
      alignItems: 'center',
      borderBottomColor: '#c9c9c9',
      borderBottomWidth: StyleSheet.hairlineWidth,
    }
})
