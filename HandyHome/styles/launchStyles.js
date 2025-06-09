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
    },
    skipBtn: {
        height: '100%',
        paddingHorizontal: 24,
    },
    textBtn: {
        textAlign: 'center',
        fontFamily: FONTS.roboto400,
        fontSize: FONT_SIZES.md,
    },
    nextBtn: {
        height: 40,
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: COLORS.primary,
        textAlign: 'center',
        fontFamily: 'Cooper-SBd',
        fontSize: FONT_SIZES.xxl,
        marginBottom: 12
    },
    description: {
        color: COLORS.lettersicons,
        textAlign: 'center',
        fontFamily: FONTS.roboto400,
        fontSize: FONT_SIZES.xs,
        paddingHorizontal: 64,
    }, 
    image: {
        justifyContent: 'center',
        width: 248,
        height: 248,
        resizeMode: 'contain',
    }
})
