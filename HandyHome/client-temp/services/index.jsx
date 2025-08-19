import { StyleSheet, Text, TouchableOpacity, View, FlatList, useWindowDimensions } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useAppData } from '../../../../context/AppDataContext';

import Header from '../../../../components/dashboard/Header'
import ServiceItem from '../../../../components/ServiceItem';

import Icons from '@expo/vector-icons/Entypo'
import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'

const ServicesPage = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();
  const {width} = useWindowDimensions();

  const numColumns = Math.floor((width - 48) / 72);
  const gap = numColumns > 1 ? (width - 48 - (numColumns * 72)) / (numColumns - 1) : 0;

  const { services } = useAppData();

  return (
    <View style={global.screenContainer}>
      {/* --------------------------------- Header --------------------------------- */}
      <Header 
        left={
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Icons name="chevron-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>}
        title={
          <Text style={[global.headingText, {color: COLORS.primary}]}>
            Services
          </Text>}
        titlePosition='absolute'
      />

      {/* ------------------------------ Service List ------------------------------ */}
      <View style={{flex: 1, alignItems: 'center', padding: 24, borderBottomWidth: 24, borderBottomColor: '#fff'}}>
        <FlatList 
          data={services}
          renderItem={({item}) => (
            <ServiceItem 
            item={item} 
            onPress={() => {router.push({
              pathname: `client-dashboard/services/[subServices]`,
              params: {id: item.id, name: item.name}
            })}}/>
          )}
          initialNumToRender={10}
          showsVerticalScrollIndicator = {false}
          numColumns={numColumns}
          columnWrapperStyle={{
            columnGap: gap,
          }}
        />
      </View>
      
    </View>
  )
}

export default ServicesPage
