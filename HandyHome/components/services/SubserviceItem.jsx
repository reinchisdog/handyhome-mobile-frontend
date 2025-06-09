import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import {useRouter} from 'expo-router'

import { globalStyles as globla } from '../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../styles/constants'
import Icons from '@expo/vector-icons/AntDesign';

const SubserviceItem = ({item}) => {
    const router = useRouter();

  return (
    <TouchableHighlight
    underlayColor={COLORS.primary}
    onPress={() => {
        router.push({
            pathname: '/client-dashboard/appointment/[index]',
            params: { id: item.id },
        });
    }}
    style={{
        borderRadius: 8
    }}
    >
        <View 
        style={{
            width: '100%',
            height: 150,
            backgroundColor: '#fff',
            padding: 12,
            gap: 10,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,

            elevation: 2,
            display: 'flex',
            flexDirection: 'row',
        }}>
            {/* -------------------------------- Left Side ------------------------------- */}
            <Image 
                source={item.image}
                style={{
                    height: '100%',
                    flex: 1,
                    objectFit: 'cover',
                    borderRadius: 2
                }}
            />

            {/* ------------------------------- Right Side ------------------------------- */}
            <View
            style={{
                flex: 2,
                justifyContent: 'space-between'
            }}
            >
                {/* -------------------------- Title and Description ------------------------- */}
                <View
                style={{
                    gap: 4,
                }}
                >
                    <Text
                    numberOfLines={1}
                    style={{
                        fontFamily: FONTS.roboto700,
                        fontSize: FONT_SIZES.lg,
                        color: COLORS.lettersicons
                    }}
                    >{item.name}</Text>
                    <Text
                    numberOfLines={4}
                    style={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons,
                        textAlign: 'justify'
                    }}>{item.description}</Text>
                </View>
                {/* ----------------------------- Price and Link ----------------------------- */}
                <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                }}
                >
                    <View>
                        <Text
                        style={{
                            fontFamily: FONTS.roboto400,
                            fontSize: FONT_SIZES.sm,
                            color: COLORS.lettersicons
                        }}
                        >Starts at</Text>
                        <Text
                        style={{
                            fontFamily: FONTS.roboto700,
                            fontSize: FONT_SIZES.xl,
                            color: COLORS.accent
                        }}
                        >{`\u20B1${item.price}`}</Text>
                    </View>
                    <Icons name="right" size={24} color={COLORS.primary} />
                </View>
            </View>
        </View>
    </TouchableHighlight>
    
  )
}

export default SubserviceItem