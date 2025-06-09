import { 
    Platform, 
    StatusBar,
    StyleSheet,
    Dimensions
} from "react-native";

import { COLORS, FONT_SIZES, FONTS } from './constants';

const { width } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        width: width
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        gap: 16,
        padding: 24
    },
    btnsContText: {
        width: '100%', 
        textAlign: 'center',
        color: COLORS.lettersicons, 
        fontFamily: FONTS.roboto400,
        fontSize: FONT_SIZES.sm
    }, 
    primaryBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 44,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22
    },
    secondaryBtn: {
        backgroundColor: '#fff',
        width: '100%',
        height: 44,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.strokes,
        borderRadius: 22
    },
    primaryBtnText: {
        fontFamily: FONTS.roboto700,
        fontSize: FONT_SIZES.md,
        color: '#fff',
        letterSpacing: 0.2
    },
    secondaryBtnText: {
        fontFamily: FONTS.roboto700,
        fontSize: FONT_SIZES.md,
        color: COLORS.accent,
        letterSpacing: 0.2
    },
    headingText: {
        fontFamily: FONTS.roboto700,
        fontSize: FONT_SIZES.xl,
    },
    subheadingText: {
        fontFamily: FONTS.roboto400,
        fontSize: FONT_SIZES.sm,
        color: COLORS.lettersicons
    },
    tagContainer: {
        paddingHorizontal: 10,
        borderRadius: 8,
        height: 22,
    },
    tagText: {
        fontFamily: FONTS.roboto700,
        fontSize: FONT_SIZES.sm,
    }
})
