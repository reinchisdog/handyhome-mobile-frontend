// Screen: Analytics

// Imports
// ---- React Components
import { ScrollView, StyleSheet, Text, View, Pressable, useWindowDimensions, RefreshControl, FlatList } from 'react-native'
import React, { useState } from 'react'
// ---- Other Components
import Header from '../../../../components/Header';
import LoadingDots from '../../../../components/LoadingDots';
import { BarChart } from 'react-native-gifted-charts'
// ---- Styles and Icons
import {globalStyles as global} from '../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../styles/constants';
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import Arrows from'@expo/vector-icons/Entypo';
// ---- Contexts
import {useAppData} from '../../../../context/AppDataContext';

const AnalyticsScreen = () => {
   // Hooks and States
   const {width} = useWindowDimensions();
   const {
      earnings, customers, sentiment, tags,
      earningsLoading, bookingsLoading, reviewsLoading, tagsLoading, analyticsLoading,
      fetchEarnings, fetchBookings, fetchReviews, fetchTags, initAnalytics
   } = useAppData();

   const [refreshing, setRefreshing] = useState(false);
   const [earningsFilter, setEarningsFilter] = useState('week');
   const [bookingsFilter, setBookingsFilter] = useState('week');

   // Functions
   const formatEarnings = (value) => {
       if (value == null || value === '') return '0';
   
      // Convert to number if it's a string
      const num = typeof value === 'string' ? parseFloat(value) : value;
      
      // Handle NaN or non-numeric values
      if (isNaN(num)) return '0';
      
      // Use toLocaleString for comma formatting
      return num.toLocaleString();
   }

   const handleEarningsFilter = () => {
      if (analyticsLoading || earningsLoading) return;

      if (earningsFilter === 'week') {
         setEarningsFilter('month');
         fetchEarnings('month');
      } else if (earningsFilter === 'month') {
         setEarningsFilter('week');
         fetchEarnings('week')
      }
   }

   const handleBookingsFilter = () => {
       if (analyticsLoading || bookingsLoading) return;

      if (bookingsFilter === 'week') {
         setBookingsFilter('month');
         fetchBookings('month');
      } else if (bookingsFilter === 'month') {
         setBookingsFilter('week');
         fetchBookings('week')
      }
   }

   // Renders
   const renderRate = (value) => {
      if (value > 0) {
         return (
            <>
            <Icons1 name='trending-up' size={24} color={COLORS.green}/>
            <Text style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.green
            }}>
               {formatEarnings(value)}
            </Text>
            </>
         )
      } else if (value < 0) {
         return (
            <>
            <Icons1 name='trending-down' size={24} color={COLORS.red}/>
            <Text style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.red
            }}>
               {formatEarnings(value)}
            </Text>
            </>
         )
      } else if (value === 0) {
         return (
            <>
            <Icons1 name='trending-neutral' size={24} color={COLORS.accent}/>
            <Text style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.accent
            }}>
               {formatEarnings(value)}
            </Text>
            </>
         )
      }
   }

   const renderBar = (value) => {
      if (!sentiment && !value) return 1;

      const total = sentiment.positive_sentiments + sentiment.negative_sentiments + sentiment.neutral_sentiments + 1;

      return ((value + 1) / total) * 100 ;
   }

   const renderSentiment = (value) => {
      // Handle null, undefined, empty string
      if (value == null || value === '') return '0';
      
      // Convert to number if it's a string
      const num = typeof value === 'string' ? parseFloat(value) : value;
      
      // Handle NaN or non-numeric values
      if (isNaN(num) || num < 0) return '0';
      
      let result;
      
      if (num >= 1000000000) {
         // Billions: 1.00b -> 10.0b -> 100b
         if (num >= 100000000000) {
            result = Math.round(num / 1000000000) + 'b';
         } else if (num >= 10000000000) {
            result = (num / 1000000000).toFixed(1) + 'b';
         } else {
            result = (num / 1000000000).toFixed(2) + 'b';
         }
      } else if (num >= 1000000) {
         // Millions: 1.00m -> 10.0m -> 100m
         if (num >= 100000000) {
            result = Math.round(num / 1000000) + 'm';
         } else if (num >= 10000000) {
            result = (num / 1000000).toFixed(1) + 'm';
         } else {
            result = (num / 1000000).toFixed(2) + 'm';
         }
      } else if (num >= 1000) {
         // Thousands: 1.00k -> 10.0k -> 100k
         if (num >= 100000) {
            result = Math.round(num / 1000) + 'k';
         } else if (num >= 10000) {
            result = (num / 1000).toFixed(1) + 'k';
         } else {
            result = (num / 1000).toFixed(2) + 'k';
         }
      } else {
         // 0-999: No decimals for 0-100, 2 decimals for 100+
         if (num <= 100) {
            result = Math.round(num).toString();
         } else {
            result = num.toFixed(2);
         }
      }
      
      return result;
   }

   return (
      <ScrollView
      style={[global.screenContainer]}
      refreshControl={
         <RefreshControl 
         refreshing={analyticsLoading}
         colors={[COLORS.lightblue, COLORS.primary]}
         onRefresh={initAnalytics}
         />
      }>
         <Header 
         hasBack={false}
         title={"Analytics"}
         backgroundColor={COLORS.screenbg}
         />

         <View style={{ padding: 24, gap: 24, }}>
            <DataContainer 
            icon={<Icons1 name='cash-multiple' size={24} color={COLORS.primary}/>}
            title={'Earnings'}
            content={
               <View 
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 36,
               }}>
                  {earningsLoading || analyticsLoading ?
                     <LoadingDots  size={8} slide={false}/>
                     :
                     <View
                     style={{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        flexWrap: true, 
                        gap: 12,
                        width: '100%'
                     }}>
                        <Text
                        style={{
                           fontFamily: FONTS.roboto700,
                           fontSize: FONT_SIZES.xxl,
                           color: COLORS.darkblue,
                           textAlign: 'center'
                        }}>
                           {`\u20b1${formatEarnings(earnings?.total)}`}
                        </Text>
                        <View style={{gap: 4, alignItems: 'center', flexDirection: 'row'}}>
                           {renderRate(earnings?.rate)}
                        </View>
                     </View>
                  }
                  
               </View>
            }
            filter={
               <Pressable
               onPress={handleEarningsFilter}
               style={({pressed}) => [{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  opacity: pressed ? 0.5 : 1
               }]}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels
                  }}>
                     By {
                        earningsFilter === 'week' ? 'Day' :
                        earningsFilter === 'month' ? 'Week' : null
                     }
                  </Text>
                  <Arrows 
                  name='chevron-down'
                  size={16}
                  color={COLORS.labels}
                  />
               </Pressable>
            }/>

            <DataContainer 
            icon={<Icons1 name='account-clock' size={24} color={COLORS.primary}/>}
            title={'Bookings'}
            content={
               <View style={{overflow: 'hidden', justifyContent: 'center', alignItems: 'center', height: 200}}>
                  {analyticsLoading || bookingsLoading ?
                     <LoadingDots size={8} slide={false}/>
                     :
                     <BarChart 
                     isAnimated
                     data={customers}
                     spacing={24}
                     height={150}
                     barWidth={20}
                     roundedTop
                     roundedBottom
                     frontColor={COLORS.lightblue}
                     yAxisThickness={0}
                     xAxisColor={COLORS.strokes}
                     xAxisLabelTextStyle={{
                        fontFamily: FONTS.roboto400,
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.lettersicons
                     }}
                     noOfSections={5}
                     />
                  }
                  
               </View>
            }
            filter={
               <Pressable
               onPress={handleBookingsFilter}
               style={({pressed}) => [{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  opacity: pressed ? 0.5 : 1
               }]}>
                  <Text
                  style={{
                     fontFamily: FONTS.roboto500,
                     fontSize: FONT_SIZES.sm,
                     color: COLORS.labels
                  }}>
                     By {
                        bookingsFilter === 'week' ? 'Day' :
                        bookingsFilter === 'month' ? 'Week' : null
                     }
                  </Text>
                  <Arrows 
                  name='chevron-down'
                  size={16}
                  color={COLORS.labels}
                  />
               </Pressable>
            }/>

            <DataContainer 
            icon={<Icons2 name='rate-review' size={24} color={COLORS.primary}/>}
            title={'Reviews'}
            content={
               <View
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 100
               }}>
                  {analyticsLoading || reviewsLoading ?
                     <LoadingDots size={8} slide={false}/>
                     :
                     <View style={{justifyContent: 'space-between', height: '100%'}}>
                        <View style={{flexDirection: 'row', height: 24, gap: 4, width: '100%'}}>
                           <View style={[
                              styles.sentimentBar, {
                              backgroundColor: COLORS.red,
                              // flex: renderBar(16),
                              flex: renderBar(sentiment?.negative_sentiments),
                           }]}/>
                           <View style={[
                              styles.sentimentBar, {
                              backgroundColor: COLORS.accent,
                              // flex: renderBar(45),
                              flex: renderBar(sentiment?.neutral_sentiments),
                           }]}/>
                           <View style={[
                              styles.sentimentBar, {
                              backgroundColor: COLORS.green,
                              // flex: renderBar(2113),
                              flex: renderBar(sentiment?.positive_sentiments),
                           }]}/>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 4, width: '100%' }}>
                           <View style={styles.sentimentCol}>
                              <Text style={styles.sentimentTitle}>Negative</Text>
                              <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                                 <Icons1 name='emoticon-sad-outline' size={24} color={COLORS.red}/>
                                 <Text style={styles.sentimentScore}>
                                    {renderSentiment(sentiment?.negative_sentiments)}
                                 </Text>
                              </View>
                           </View>

                           <View style={styles.sentimentCol}>
                              <Text style={styles.sentimentTitle}>Neutral</Text>
                              <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                                 <Icons1 name='emoticon-neutral-outline' size={24} color={COLORS.accent}/>
                                 <Text style={styles.sentimentScore}>
                                    {renderSentiment(sentiment?.neutral_sentiments)}
                                 </Text>
                              </View>
                           </View>

                           <View style={styles.sentimentCol}>
                              <Text style={styles.sentimentTitle}>Positive</Text>
                              <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                                 <Icons1 name='emoticon-outline' size={24} color={COLORS.green}/>
                                 <Text style={styles.sentimentScore}>
                                    {renderSentiment(sentiment?.positive_sentiments)}
                                 </Text>
                              </View>
                           </View>
                        </View>
                     </View>
                  }
               </View>
            }
            />

            <DataContainer 
            icon={<Icons2 name='rate-review' size={24} color={COLORS.primary}/>}
            title={'Review Tags'}
            content={
               <View
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 100,
                  // backgroundColor: 'green'
               }}>
                  {analyticsLoading || tagsLoading ?
                     <LoadingDots size={8} slide={false}/>
                     :
                     <FlatList
                     scrollEnabled={false}
                     data={tags?.data || []}
                     keyExtractor={(item, index) => index.toString()}
                     style={{flex: 1}}
                     contentContainerStyle={{gap: 16, marginBottom: 16, flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
                     renderItem={({item}) => (
                        <View style={{gap: 8}}>
                           <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%'
                           }}>
                              <Text style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons
                              }}>
                              {item.text}
                              </Text>

                              <Text style={{
                              fontFamily: FONTS.roboto600,
                              fontSize: FONT_SIZES.md,
                              color: COLORS.lettersicons
                              }}>
                              {item.count}
                              </Text>
                           </View>

                           <View style={{
                              height: 6,
                              width: '100%',
                              backgroundColor: COLORS.strokes,
                              borderRadius: 12,
                              overflow: 'hidden'
                           }}>
                              <View style={{
                              height: '100%',
                              width: `${(item.count / (tags?.highest_count || 1)) * 100}%`,
                              backgroundColor: item.type === 1 ? COLORS.green : COLORS.red,
                              borderRadius: 12
                              }}/>
                           </View>
                        </View>
                     )}

                     ListEmptyComponent={
                        <Text
                        style={{
                           fontFamily: FONTS.roboto400,
                           fontSize: FONT_SIZES.md,
                           color: COLORS.labels,
                        }}>
                           No review tags available.
                        </Text>
                     }
                     />
                  }
               </View>

            }/>

         </View>
      </ScrollView>
   )
}

export default AnalyticsScreen

const DataContainer = ({icon, title, filter, content}) => {
   return (
      <View
      style={{
         backgroundColor: '#fff',
         padding: 18,
         gap: 16,
         borderRadius: 20,
      }}>
         <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            {icon}
            <Text
            numberOfLines={1}
            style={{
               fontFamily: FONTS.roboto500,
               fontSize: FONT_SIZES.md,
               color: COLORS.lettersicons,
               flex: 1,
            }}>
               {title}
            </Text>
            {filter}
         </View>

         <View style={global.divider}/>

         {content}
      </View>
   )
}

const styles = StyleSheet.create({
   sentimentBar: {
      borderRadius: 24,
      height: 24,
      minWidth: 24,
   },
   sentimentCol: {
      flex: 1,
      gap: 4
   }, 
   sentimentTitle: {
      fontFamily: FONTS.nunito400,
      fontSize: FONT_SIZES.sm,
      color: COLORS.labels
   },
   sentimentScore: {
      fontFamily: FONTS.roboto600,
      fontSize: FONT_SIZES.md,
      color: COLORS.lettersicons
   }
})