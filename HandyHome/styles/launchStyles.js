import { 
    Platform, 
    StatusBar,
    StyleSheet,
} from "react-native";

import { COLORS, FONT_SIZES, FONTS } from './constants';

export const launchStyles = StyleSheet.create({
    navBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        position: 'relative'
    },
    skipBtn: {
        height: '100%',
        paddingHorizontal: 24,
    },
    textBtn: {
        textAlign: 'center',
        fontFamily: FONTS.roboto600,
        fontSize: FONT_SIZES.md,
        color: COLORS.darkblue
    },
    nextBtn: {
        height: 40,
        width: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: COLORS.primary,
        textAlign: 'center',
        fontFamily: FONTS.nunito700,
        fontSize: FONT_SIZES.xxl,
        marginBottom: 12,
        lineHeight: 28
    },
    description: {
        color: COLORS.lettersicons,
        textAlign: 'center',
        fontFamily: FONTS.roboto400,
        fontSize: FONT_SIZES.sm,
        paddingHorizontal: 64,
    }, 
    image: {
        justifyContent: 'center',
        width: 248,
        height: 248,
        resizeMode: 'contain',
    }
})
