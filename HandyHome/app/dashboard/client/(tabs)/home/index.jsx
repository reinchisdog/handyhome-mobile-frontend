// Screen: Home Screen

// Imports
// ---- React and Expo Components
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'expo-router';
// ---- Contexts
import { useAuth } from "../../../../../context/AuthContext";
import { useAppData } from "../../../../../context/AppDataContext";
// ---- Custom Components
import Header from '../../../../../components/Header';
import LogoText from '../../../../../components/LogoText';
import HomeGraphic from '../../../../../components/HomeGraphic';
import HomeGreetings from '../../../../../components/HomeGreetings';
import PromoSlide from '../../../../../components/PromoSlide';
import UnverifiedPrompt from '../../../../../components/UnverifiedPrompt';
import ServiceItem from '../../../../../components/ServiceItem';
// ---- Styles and Icons
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
import { globalStyles as global } from '../../../../../styles/globalStyles';
import Icons from '@expo/vector-icons/MaterialCommunityIcons';


const HomeScreen = () => {
   // Hooks and States
   const router = useRouter();
   const { user } = useAuth();
   const { services } = useAppData();
   const [showVerify, setShowVerify] = useState(true);

   return (
      <ScrollView
      style={{
         flex: 1,
         backgroundColor: COLORS.screenbg
      }}
      stickyHeaderIndices={[0]}
      >
         <Header 
         customTitle={<LogoText size={24}/>}
         hasBack={false}
         rightIcon={
            <TouchableOpacity 
            // onPress={() => {console.log("[Routing] to Notification")}}
            onPress={() => router.push('/dashboard/client/appointment/summary/81')}
            style={{position: 'relative', height: 24, width: 24}}
            >
               {false && (
                  <View 
                  style={{
                     backgroundColor: COLORS.red,
                     aspectRatio: 1/1,
                     borderRadius: 5,
                     width: 10,
                     position: 'absolute',
                     top: 2,
                     right: 0,
                     zIndex: 100
                  }}/>
               )}
               <Icons name='bell' size={24} color={COLORS.primary} />
            </TouchableOpacity>
         }/>

         <View style={{position: 'relative'}}>
            {/* ---- Content */}
            <View 
            style={{
               paddingVertical: 24,
               flex: 1,
               gap: 24,
               zIndex: 1,
            }}>
               <HomeGreetings name={user?.full_name} />

               <PromoSlide />

               {!user.can_book && showVerify && (
                  <UnverifiedPrompt hidePrompt={() => setShowVerify(false)}/>
               )}

               <View
               style={[{
                  width: '100%',
                  gap: 8
               }]}>
                  <View
                  style={[{
                     paddingHorizontal: 24,
                     paddingVertical: 16,
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     alignItems: 'center'
                  }]}>
                     <Text
                     style={[
                        global.headingText, {
                        color: COLORS.primary
                     }]}>
                        Services
                     </Text>

                     <TouchableOpacity
                     onPress={() => router.push('/dashboard/client/home/services')}
                     >
                        <Text
                        style={[global.subheadingText]}
                        >
                           See All
                        </Text>
                     </TouchableOpacity>
                  </View>

                  <FlatList 
                  data={services}
                  renderItem={({item}) => (
                     <ServiceItem 
                     item={item}
                     onPress={() => {router.push({
                        pathname: '/dashboard/client/home/service/[id]',
                        params:  {id: item.id, name: item.name}
                     })}}
                     />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                     paddingHorizontal: 20,
                     gap: 16
                  }}
                  />
               </View>
            </View>

            <HomeGraphic />
         </View>
      </ScrollView>
   )
}

export default HomeScreen;

const styles = StyleSheet.create({})