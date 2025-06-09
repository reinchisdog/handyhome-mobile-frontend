import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import React from 'react'
import {useRouter} from 'expo-router'

import { COLORS, FONT_SIZES, FONTS } from '../../../styles/constants'

const ServiceItem = ({item}) => {
    const router = useRouter();

    const handleNavigate = (subServices) => {
        router.push({
            pathname: '/client-dashboard/services/[subServices]',
            params: { id: subServices },
        });
    }

  return (
    <TouchableHighlight
    underlayColor={'#F2F2F7'}
    onPress={() => handleNavigate(item.name)}
    style={{borderRadius: 8}}
    >
        <View style={{width: 72, alignItems: 'center', gap: 10}}>
            <View style={{
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                height: 60,
                flex: 1,
                aspectRatio: '1/1',
                borderRadius: 30,
                
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,

                elevation: 2,
            }}>
                {item.icon}
            </View>
            <Text style={{
                color: COLORS.lettersicons,
                textAlign: 'center',
                fontFamily: FONTS.roboto500 ,
                fontSize: FONT_SIZES.sm,
            }}>{item.name}</Text>
        </View>
    </TouchableHighlight>
  )
}

export default ServiceItem

const styles = StyleSheet.create({})