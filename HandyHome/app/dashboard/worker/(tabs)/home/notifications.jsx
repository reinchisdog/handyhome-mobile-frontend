// Screen: Client Notifications

// Imports
// React and Expo Components
import { StyleSheet, Text, View, FlatList, RefreshControl, Image } from 'react-native'
import React from 'react'
// Other Components
import Header from '../../../../../components/Header';
import LoadingDots from '../../../../../components/LoadingDots';
import NotificationItem from '../../../../../components/NotificationItem';
import { useAppData } from '../../../../../context/AppDataContext';
// Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { launchStyles as launch } from '../../../../../styles/launchStyles';

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
         ListEmptyComponent={
            <View
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               gap: 12,
               paddingHorizontal: 24,
               flex: 1,
               // backgroundColor: 'green'
            }}>
               <Image
               source={require('../../../../../assets/images/illustrations/EmptyNotifs.png')}
               style={{
                  height: 160,
                  width: 160,
                  aspectRatio: 1/1
               }}
               />
      
               <Text 
               style={[
                  launch.title, {
                  marginBottom: 0, 
                  marginTop: 4,
               }]}>
                  You have no notifications
               </Text>
               <Text style={[launch.description, {paddingHorizontal: 0}]}>
                  Nothing new for now. Check back later for more announcements.
               </Text>
            </View>
         }
         contentContainerStyle={{
            flexGrow: 1,
         }}
         />
      </View>
   )
}

export default WorkerNotifications

const styles = StyleSheet.create({})