import { StyleSheet, Text, TouchableOpacity, View, FlatList, useWindowDimensions } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

import Header from '../../../../components/dashboard/Header'
import ServiceList from '../../../../components/dashboard/home/ServiceList';
import ServiceItem from '../../../../components/dashboard/home/ServiceItem';

import Icons from '@expo/vector-icons/AntDesign'
import { globalStyles as global } from '../../../../styles/globalStyles'
import { COLORS, FONT_SIZES, FONTS } from '../../../../styles/constants'

const ServicesPage = () => {
  /* ----------------------------- Initialization ----------------------------- */
  const router = useRouter();
  const {width} = useWindowDimensions();

  return (
    <View style={global.screenContainer}>
      {/* --------------------------------- Header --------------------------------- */}
      <Header 
        left={
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Icons name="left" size={24} color={COLORS.primary} />
          </TouchableOpacity>}
        title={
          <Text style={[global.headingText, {color: COLORS.primary}]}>
            Services
          </Text>}
        titlePosition='absolute'
      />

      {/* ------------------------------ Service List ------------------------------ */}
      <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 24, borderBottomWidth: 24, borderBottomColor: '#fff', backgroundColor: COLORS.secondary}}>
        <FlatList 
          data={ServiceList}
          renderItem={({item}) => <ServiceItem item={item}/>}
          initialNumToRender={10}
          showsVerticalScrollIndicator = {false}
          numColumns={4}
          contentContainerStyle={{
            justifyContent: 'flex-start',
          }}
          columnWrapperStyle={{
            gap: 8,
            paddingTop: 24,
            
          }}
          ListFooterComponent={<View style={{height: 58}}></View>}
        />
      </View>
      
    </View>
  )
}

export default ServicesPage
