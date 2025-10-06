// Screen: Client Notifications

// Imports
// React and Expo Components
import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
// Other Components
import Header from '../../../../../components/Header';
import NotificationItem from '../../../../../components/NotificationItem';
import { useAppData } from '../../../../../context/AppDataContext';
// Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';

const WorkerNotifications = () => {
   // Hooks and States
   const { notifications, notificationsLoading, fetchNotifications } = useAppData();

   return (
      <View style={[global.screenContainer, {position: 'relative', backgroundColor: '#fff'}]}>
         <Header 
         hasBack 
         title={'Notifications'}
         backColor='#fff'
         textColor='#fff'
         backgroundColor={COLORS.primary}
         />
        
         <FlatList 
         data={notifications}
         renderItem={({item}) => <NotificationItem item={item} />}
         />
      </View>
   )
}

export default WorkerNotifications

const styles = StyleSheet.create({})