import { Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import React from 'react'

import Header from '../../../../../components/dashboard/Header';

import Arrow from '@expo/vector-icons/Entypo';
import { COLORS } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';

const titleMap = {
  index: 'Review Summary',
  'details/addresses': 'My Addresses',
  'details/payment': 'Payment Methods',
};

const ReviewSummaryLayout = () => {
  const router = useRouter();

  return (
    <Stack
    screenOptions={({ route, navigation }) => ({
      header: () => (
        <Header 
        left={
          <TouchableOpacity onPress={() => router.back()}>
            <Arrow name="chevron-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
        titlePosition='absolute'
        title={
          <Text style={[global.headingText, {color: COLORS.primary}]}> 
            {titleMap[route.name]}
          </Text>
        }
        />
      ),
    })}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="details/addresses" />
      <Stack.Screen name="details/payment" />
    </Stack>
  )
}

export default ReviewSummaryLayout
