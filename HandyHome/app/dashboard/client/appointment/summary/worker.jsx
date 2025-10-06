// Screen: Appointment Worker

// Imports
// ---- React Components
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
// ---- Contexts
import { useAuth } from '../../../../../context/AuthContext';
import { useAppointment } from '../../../../../context/AppointmentContext';
// ---- Other Components
import Header from '../../../../../components/Header';
import WorkerHeader from '../../../../../components/WorkerHeader';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import WorkerAboutTab from '../../../../../components/WorkerAboutTab';
import WorkerReviewTab from '../../../../../components/WorkerReviewTab';
import ErrorModal from '../../../../../components/ErrorModal';
// ---- Styles and Icons
import { globalStyles as global } from '../../../../../styles/globalStyles';
import { COLORS, FONTS, FONT_SIZES } from '../../../../../styles/constants';
// ---- Other Libs
import api from '../../../../../lib/api';

const initialLayout = { width: Dimensions.get('window').width };
const MAX_LIMIT = 10;

const AppointmentWorker = () => {
   // Hooks and States
   const { token } = useAuth();
   const { worker } = useAppointment();

   const [reviews, setReviews] = useState([]);
   const [reviewCount, setReviewCount] = useState({
      total: 0,
      attachment: 0,
   })
   const [page, setPage] = useState(1);
   const [reviewsLoading, setReviewsLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(true);

   // Functions
   const fetchReviews = async (pageNum = 1, attachments = false, filter = 'all') => {
      if (reviewsLoading || loadingMore) return;

      try {
         if (pageNum === 1) {
            setReviews([]);
            setReviewsLoading(true);
         } else {
            setLoadingMore(true);
         }

         console.log("---- [Appointment Worker Reviews] Fetching Attempt ----");
         console.log("[1] Fetching Reviews");
         const reviewsResult = await api.get(`/user/book/worker/${worker?.user?.id}/reviews`, {
            params: {
               page: pageNum,
               limit: MAX_LIMIT,
               attachments: attachments,
               filter: filter,
            },
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         console.log("[2] Fetching Succesful");
         const reviewsData = reviewsResult?.data?.data?.reviews;
         // console.log(reviewsData);
         setReviewCount(prev => ({
            ...prev,
            total: reviewsResult?.data?.data?.total_reviews,
            attachment: reviewsResult?.data?.data?.reviews_with_attachments,
         }))
         if (pageNum === 1) {
            setReviews(reviewsData);
         } else {
            setReviews(prev => [...prev, ...reviewsData]);
         }

         setHasMore(reviewsData.length === MAX_LIMIT);
      } catch (err) {

      } finally {
         setReviewsLoading(false);
         setLoadingMore(false);
      }
   }

   const fetchMore = useCallback(async (attachments, filter) => {
      if (!hasMore || loadingMore || reviewsLoading) return;

      await fetchReviews(page + 1, attachments, filter);
   }, [hasMore, loadingMore, reviewsLoading, page])

   // Effects
   useEffect(() => {
      if (reviews.length === 0 && !reviewsLoading) {
         setPage(1);
         fetchReviews(1);
      }
   }, [])

   // Renders
   const renderTabBar = (props) => (
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
         renderTabBar={renderTabBar}
         headerHeight={292}
         containerStyle={{flex: 1, backgroundColor: COLORS.screenbg}}
         headerContainerStyle={{
            elevation: 0,           // Android shadow
            shadowOpacity: 0,       // iOS shadow
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
         }}>
            <Tabs.Tab name='About' label="About">
               <WorkerAboutTab data={worker?.worker}/>
            </Tabs.Tab>
             <Tabs.Tab name='Reviews' label="Reviews">
               <WorkerReviewTab 
               reviews={reviews}
               reviewCount={reviewCount}
               reviewsLoading={reviewsLoading}
               loadingMore={loadingMore}
               fetchReviews={fetchReviews}
               fetchMore={fetchMore}
               hasMore={hasMore}
               />
            </Tabs.Tab>
         </Tabs.Container>

            

      </View>
   )
}

export default AppointmentWorker

const styles = StyleSheet.create({})