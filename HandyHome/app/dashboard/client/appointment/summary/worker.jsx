// Screen: Appointment Workerdon 

// Imports
// ---- React Components
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
// ---- Contexts
import { useAppointment } from '../../../../../context/AppointmentContext';
// ---- Other Components
import Header from '../../../../../components/Header';
import WorkerHeader from '../../../../../components/WorkerHeader';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import WorkerAboutTab from '../../../../../components/WorkerAboutTab';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';

const initialLayout = { width: Dimensions.get('window').width };

const AppointmentWorker = () => {
   // Hooks and States
   const { fetchWorker, worker, workerLoading } = useAppointment();

   const tabBar = (props) => (
      <MaterialTabBar 
      {...props}
      indicatorStyle={{backgroundColor: COLORS.primary}}
      labelStyle={{
         fontFamily: FONTS.roboto700,
         fontSize: FONT_SIZES.sm,
      }}
      activeColor={COLORS.primary}
      inactiveColor={COLORS.labels}
      style={{
         borderBottomWidth: 1,
         borderBottomColor: COLORS.strokes,
         elevation: 0,           // Android shadow
         shadowOpacity: 0,       // iOS shadow
         shadowOffset: { width: 0, height: 0 },
         shadowRadius: 0,
      }}
      />
   )

   return (
      <View style={[global.screenContainer, {backgroundColor: COLORS.screenbg}]}>
         <Header 
         hasBack
         title={"Service Provider"}
         backgroundColor='#fff'
         />

         <Tabs.Container
         renderHeader={() => (
            <WorkerHeader
            name={worker?.user?.name}
            number={worker?.user?.phone_number}
            photo={worker?.user?.profile_photo}
            customers={worker?.worker?.customer_count}
            rating={worker?.worker?.rating}
            review={worker?.worker?.total_reviews}
            />
         )}
         renderTabBar={tabBar}
         headerHeight={292}
         containerStyle={{flex: 1, backgroundColor: COLORS.screenbg}}
         headerContainerStyle={{
            elevation: 0,           // Android shadow
            shadowOpacity: 0,       // iOS shadow
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
         }}
         >
            <Tabs.Tab name='About' label="About">
               <WorkerAboutTab data={worker?.worker}/>
            </Tabs.Tab>
             <Tabs.Tab name='Reviews' label="Reviews">
               <WorkerAboutTab data={worker?.worker}/>
            </Tabs.Tab>
         </Tabs.Container>

            

      </View>
   )
}

export default AppointmentWorker

const styles = StyleSheet.create({})