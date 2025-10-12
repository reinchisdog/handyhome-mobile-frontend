// Screen: Client Notifications

// Imports
// React and Expo Components
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native'
import React from 'react'
// Other Components
import Header from '../../../../../components/Header';
import LoadingDots from '../../../../../components/LoadingDots';
import NotificationItem from '../../../../../components/NotificationItem';
import { useAppData } from '../../../../../context/AppDataContext';
// Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';

const WorkerNotifications = () => {
   // Hooks and States
   const { 
      notifications, 
      notificationsLoading,
      notificationsMore,
      notificationsRefreshing,
      notificationsPage,
      hasMoreNotifs, 
      fetchNotifications,
      fetchMoreNotifications,
      fetchRefreshNotifications,
   } = useAppData();

    const renderFooter = () => (
         <View style={{
            width: '100%',
            paddingVertical: 32,
            alignItems: 'center',
            justifyContent: 'center'
         }}>
            {(notificationsMore || (notificationsLoading && notifications.length === 0)) && (
               <LoadingDots size={12} slide={false}/>
            )}
   
            {/* Show divider when done and no more data */}
            {(!hasMoreNotifs && !notificationsMore && !notificationsLoading && notifications.length > 0) && (
               <View style={global.divider}/>
            )}
         </View>
      )
   

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
         onEndReachedThreshold={0.5}
         onEndReached={fetchMoreNotifications}
         refreshing={notificationsRefreshing}
         onRefresh={fetchRefreshNotifications}
         refreshControl={
            <RefreshControl 
            refreshing={notificationsRefreshing}
            colors={[COLORS.lightblue, COLORS.primary]}
            onRefresh={fetchRefreshNotifications}
            />
         }
         ListFooterComponent={renderFooter}
         />
      </View>
   )
}

export default WorkerNotifications

const styles = StyleSheet.create({})