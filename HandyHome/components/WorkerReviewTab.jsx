// Component: Worker Review Tab

// Imports
// ---- React Components
import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
// ---- Other Components
import { Tabs } from 'react-native-collapsible-tab-view'

const WorkerReviewTab = () => {
   // Hooks and States
   const [reviews, setReviews] = useState([]);
   const [reviewsLoading, setReviewsLoading] = useState(false);
   const [page, setPage] = useState(1);
   const [isFilterAll, setIsFilterAll] = useState(true);
   const [isFilterMedia, setIsFilterMedia] = useState(false);
   const [filterRating, setFilterRating] = useState(0);

   return (
      <Tabs.FlatList
      
      />
   )
}

export default WorkerReviewTab

const styles = StyleSheet.create({})