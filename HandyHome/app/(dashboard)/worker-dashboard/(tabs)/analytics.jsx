import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'

import Header from '../../../../components/dashboard/Header';

import { globalStyles as global } from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';

export default AnalyticsScreen = () => {
   return (
      <ScrollView
      style={[global.screenContainer]}>
         <Header 
         background='transparent'
         title={
            <Text style={[global.headingText, {color: COLORS.darkblue}]}>Analytics</Text>
         }
         titleAlign='center'
         />
      </ScrollView>
   )
}

AnalyticsScreen

const styles = StyleSheet.create({})