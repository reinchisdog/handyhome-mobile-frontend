import { SafeAreaView, StyleSheet, Text, View, Platform, useWindowDimensions, StatusBar, Animated } from 'react-native'
import React from 'react'

import { globalStyles as global } from '../../styles/globalStyles';
import { COLORS } from '../../styles/constants';

const Header = ({
    background = '#fff',
    left,
    right,
    title,
    titleAlign = 'center',
    titlePosition = 'relative',
    headerPosition = 'relative',
    zIndex = 100
}) => {
    /* ----------------------------- Initialization ----------------------------- */
    const { width } = useWindowDimensions();

    let direction = 'row';
    if (left && !right) direction = 'row';
    else if (right && !left) direction = 'row-reverse';

    return (
        <Animated.View style={[
            {
                width: width,
                backgroundColor: background,
                paddingTop: StatusBar.currentHeight,
                paddingHorizontal: 24,
                position: headerPosition,
                top: 0,
                left: 0,
                zIndex: zIndex
            }
        ]}>
            {/* ----------------------------- Main Container ----------------------------- */}
            <View style={[{
                width: '100%',
                height: 64,
                flexDirection: direction, 
                alignItems: 'center',
                position: 'relative'
            }]}>
                {/* ------------------------------ Left Icon ------------------------------ */}
                {left ? left : null}

                {/* ------------------------------- Title -------------------------------- */}
                {title ? (
                    <View style={[{
                        height: '100%',
                        width: '100%',
                        flex: 1,
                        alignItems: titleAlign,
                        justifyContent: 'center',
                        position: titlePosition,
                    }]}>
                        {title}
                    </View>
                ) : null}

                {/* ----------------------------- Right Icon ------------------------------ */}
                {right ? right : null}
            </View>
        </Animated.View>
    )
}

export default Header
