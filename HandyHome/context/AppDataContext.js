//Context: AppDataContext - Handles application-wide data such as services and user profile.

//Imports
import React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState,
   useCallback,
   useRef
} from 'react';
import { useAuth } from './AuthContext';
import { useCustomFonts } from '../assets/fonts';
import ErrorModal from '../components/ErrorModal';
import api from '../lib/api';
import supabase from '../lib/supabase';

const AppDataContext = createContext();

export const AppDataProvider = ({children}) => {
   // States and Hook Calls
   const {user, token, isTokenValid, isAuthReady} = useAuth();
   const [fontsLoaded] = useCustomFonts();
   const subscriptionRef = useRef(null);

   // App state
   const [isAppDataReady, setIsAppDataReady] = useState(false);
   // const [isInitializing, setIsInitializing] = useState(false);
   
   // Data states
   const [services, setServices] = useState([]);
   const [notifications, setNotifications] = useState([]);
   const [addresses, setAddresses] = useState([]);
   const [worker, setWorker] = useState(null);
   const [earnings, setEarnings] = useState(null);
   const [customers, setCustomers] = useState(null);
   const [sentiment, setSentiment] = useState(null);

   // Loading states
   const [addressLoading, setAddressLoading] = useState(false);
   const [notificationsLoading, setNotificationsLoading] = useState(false);
   const [workerLoading, setWorkerLoading] = useState(false);
   const [analyticsLoading, setAnalyticsLoading] = useState(false);
   const [earningsLoading, setEarningsLoading] = useState(false);
   const [bookingsLoading, setBookingsLoading] = useState(false);
   const [reviewsLoading, setReviewsLoading] = useState(false)
   
   // Error states
   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [errorTitle, setErrorTitle] = useState("");
   const [errorMode, setErrorMode] = useState(null);

   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

   // Memoized fetch functions
   // Services
   const fetchServices = async () => { 
      try {
         console.log('[AppDataContext] Fetching services...');
         const res = await api.get(`/general/services`);
         setServices(res.data.data);
         console.log('[AppDataContext] Services fetched successfully');
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch services:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load services. Please try again.";
         setErrorTitle("Services Load Error");
         setErrorMessage(message);
         setErrorMode("services");
         setShowError(true);
         throw err;
      }
   };

   // Addresses
   const fetchAddresses = async () => {
      try {
         // console.log('[AppDataContext] Fetching addresses...');
         setAddressLoading(true);
         
         const addressResult = await api.get(`/user/addresses`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         // console.log('[AppDataContext] Addresses fetched successfully');
         setAddresses(addressResult?.data?.data || []);
      } catch (err) {
         // console.error('[AppDataContext] Failed to fetch addresses:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your addresses. Please try again.";
         setErrorTitle("Addresses Fetch Error");
         setErrorMessage(message);
         setErrorMode("addresses");
         setShowError(true);
         throw err;
      } finally {
         setAddressLoading(false);
      }
   }

   // Notifications
   const fetchNotifications = async () => {
      try {
         setNotificationsLoading(true);

         console.log('[AppDataContext] Fetching notifications...');
         const route = user?.role === "User" ? '/user/notifications' : user?.role === "Worker" ? '/worker/notifications' : null;
         console.log(route);
         const res = await api.get(route, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         if (user?.role === "User") { 
            const notifs = res.data.data.notifications;
            const promos = res.data.data.promos.map(promo => ({
               ...promo,
               announcement_type: 'promo',
            }));
            setNotifications([...notifs, ...promos]);
         } else {
            setNotifications(res.data.data);
         }

         console.log('[AppDataContext] Services fetched successfully');
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch notifications:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load notifications. Please try again.";
         console.log(message);
         // setErrorTitle("Services Load Error");
         // setErrorMessage(message);
         // setErrorMode("services");
         // setShowError(true);
         throw err;
      } finally {
         setNotificationsLoading(false);
      }
   }

   // Worker Info
   const fetchWorker = async () => {
      try {
         console.log('[AppDataContext] Fetching worker profile...');
         setWorkerLoading(true);
         
         const workerResult = await api.get(`/worker`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('[AppDataContext] Worker profile fetched successfully');
         setWorker(workerResult?.data?.data);
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch worker profile:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your worker profile. Please try again.";
         setErrorTitle("Worker Profile Fetch Error");
         setErrorMessage(message);
         setErrorMode("worker");
         setShowError(true);
         throw err;
      } finally {
         setWorkerLoading(false);
      }
   }

   const fetchEarnings = async (filter) => {
      try {
         console.log('[AppDataContext] Fetching worker earnings...');
         if (!analyticsLoading) setEarningsLoading(true);
         
         const earningsResult = await api.get(`/worker/earnings?filter=${filter}`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('[AppDataContext] Worker earnings fetched successfully');
         setEarnings(earningsResult?.data?.data);
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch worker earnings:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your worker earnings. Please try again.";
         setErrorTitle("Earnings Fetch Error");
         setErrorMessage(message);
         setErrorMode("earnings");
         setShowError(true);
         throw err;
      } finally {
         if (!analyticsLoading) setEarningsLoading(false);
      }
   }

   const fetchBookings = async (filter) => {
      try {
         console.log('[AppDataContext] Fetching worker bookings...');
         if (!analyticsLoading) setBookingsLoading(true);
         
         const bookingsResult = await api.get(`/worker/bookings?filter=${filter}`, {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('[AppDataContext] Worker bookings fetched successfully');
         const data = bookingsResult?.data?.data;

         let chartData;
         if (filter === 'week') {
            chartData = data?.by_day?.map((item, index) => (
               {value: item, label: days[index]}
            ))
         } else if (filter === 'month') {
            chartData = data?.by_week?.map((item, index) => (
               {value: item, label: `${index + 1}`}
            ))
         }

         setCustomers(chartData);
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch worker bookings:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your worker bookings. Please try again.";
         setErrorTitle("Bookings Fetch Error");
         setErrorMessage(message);
         setErrorMode("bookings");
         setShowError(true);
         throw err;
      } finally {
         if (!analyticsLoading) setBookingsLoading(false);
      }
   }

   const fetchReviews = async () => {
      try {
         console.log('[AppDataContext] Fetching worker reviews...');
         if (!analyticsLoading) setReviewsLoading(true);
         
         const reviewsResult = await api.get('/worker/sentiment', {
            headers: {'Authorization': `Bearer ${token}`}
         });

         console.log('[AppDataContext] Worker reviews fetched successfully');
         console.log(reviewsResult?.data?.data);
         setSentiment(reviewsResult?.data?.data);
      } catch (err) {
         console.error('[AppDataContext] Failed to fetch worker reviews:', err);
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your worker reviews. Please try again.";
         setErrorTitle("Reviews Fetch Error");
         setErrorMessage(message);
         setErrorMode("reviews");
         setShowError(true);
         throw err;
      } finally {
         if (!analyticsLoading) setReviewsLoading(false);
      }
   }

   const initAnalytics = async () => {
      try {
         setAnalyticsLoading(true);

         await fetchEarnings('week');
         await fetchBookings('week');
         await fetchReviews();
      } catch (err) {
         // Individual fetch functions already handle their errors
         // No need to double-handle here
      } finally {
         setAnalyticsLoading(false);
      }
   }

   // Initialize app data
   useEffect(() => {
      if (!fontsLoaded || isAppDataReady) return;
      // if (!fontsLoaded || isAppDataReady || isInitializing) return;
      // setIsInitializing(true);

      const init = async () => {
         try {
            console.log('[AppDataContext] Initializing app data...');
            // Always fetch services first
            await fetchServices();
            setIsAppDataReady(true);
            console.log('[AppDataContext] App data initialization completed successfully');
         } catch (err) {
            console.error('[AppDataContext] App data initialization failed:', err);
         } finally {
            // setIsInitializing(false);
         }
      };

      init();
   // }, [fontsLoaded, isAppDataReady, isInitializing]);
   }, [fontsLoaded, isAppDataReady]);

   // Reset app data when user changes
   useEffect(() => {
      if (!token || !isAuthReady || !isTokenValid || !user) return;

      const init = async () => {
         try {
            console.log('[AppDataContext] Initializing user data...');
            fetchAddresses();
            fetchNotifications();

            if (user?.role === "Worker") {
               console.log('[AppDataContext] User is worker - fetching worker data...');
               fetchWorker();

               initAnalytics();
            }
            console.log('[AppDataContext] User data initialization completed successfully');
         } catch (err) {
            console.error('[AppDataContext] User data initialization failed:', err);
         }
      }

      init();
   }, [token, isAuthReady, isTokenValid, user]);

   const handleErrorRetry = useCallback(() => {
      switch(errorMode) {
         case "services":
            fetchServices();
            break;
         case "addresses":
            fetchAddresses();
            break;
         case "inbox":
            fetchAddresses();
            break;
         case "worker":
            fetchWorker();
            break;
         case "earnings":
            fetchEarnings('week'); // Default filter when retrying
            break;
         case "bookings":
            fetchBookings('week'); // Default filter when retrying  
            break;
         case "reviews":
            fetchReviews();
            break;
         case "analytics":
            initAnalytics();
            break;
         default:
            break;
      }
      setShowError(false);
   }, [errorMode, fetchServices, fetchAddresses, fetchWorker]);

   if (!fontsLoaded) return null;

   return (
      <AppDataContext.Provider
      value={{
         // Data
         services,
         notifications,
         addresses,
         worker,
         earnings,
         customers,
         sentiment,
         
         // States
         isAppDataReady,
         // isInitializing,
         notificationsLoading,
         addressLoading,
         workerLoading,
         analyticsLoading,
         earningsLoading: earningsLoading || analyticsLoading,
         bookingsLoading: bookingsLoading || analyticsLoading,
         reviewsLoading: reviewsLoading || analyticsLoading,
         
         // Actions
         fetchAddresses,
         fetchNotifications,
         fetchWorker,
         fetchServices,
         fetchEarnings,
         fetchBookings,
         fetchReviews,
         initAnalytics,
      }}>
         <ErrorModal
         visible={showError}
         setVisible={setShowError}
         title={errorTitle}
         message={errorMessage}
         onExit={handleErrorRetry}
         buttonText={errorMode ? "Try Again" : undefined}
         buttonLoad={
            errorMode === "addresses" ? addressLoading :
            errorMode === "inbox" ? inboxLoading :
            errorMode === "worker" ? workerLoading :
            errorMode === "analytics" ? analyticsLoading :
            errorMode === "earnings" ? (earningsLoading || analyticsLoading) :
            errorMode === "bookings" ? (bookingsLoading || analyticsLoading) :
            errorMode === "reviews" ? (reviewsLoading || analyticsLoading) :
            false
         }
         />
         {children}
      </AppDataContext.Provider>
   );
};

export const useAppData = () => useContext(AppDataContext);