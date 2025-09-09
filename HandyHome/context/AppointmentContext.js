// Context: Appointment Context - FIXED VERSION

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
// ---- Misc
import api from '../lib/api';
import supabase from '../lib/supabase'
import { useAuth } from './AuthContext';
import { useConvert } from '../hooks/useConvert'

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
   // Hooks and States
   const router = useRouter();
   const { token } = useAuth();
   const { convertDateToTime24, convertDateToFormattedDate, convertUriToFile } = useConvert();
   const [showErrorModal, setShowErrorModal] = useState(false);
   const [errorTitle, setErrorTitle] = useState("");
   const [errorMessage, setErrorMessage] = useState("");

   const [appointment, setAppointment] = useState({
      date: null,
      time: null,
      service_id: null,
      sub_service_id: null,
      description: "",
      attachment: null,
   });
   const [currentAppointment, setCurrentAppointment] = useState(null);
   const [appointmentLoading, setAppointmentLoading] = useState(false);
   const [queueError, setQueueError] = useState(false);

   const [summary, setSummary] = useState(null);
   const [summaryError, setSummaryError] = useState(false);
   const [summaryLoading, setSummaryLoading] = useState(true);

   const [worker, setWorker] = useState(null);
   const [workerError, setWorkerError] = useState(false);
   const [workerLoading, setWorkerLoading] = useState(true);


   // New worker fetch error state
   const [newWorkerError, setNewWorkerError] = useState(false);
   const [retryCount, setRetryCount] = useState(0);
   const MAX_RETRIES = 2;
   
   const [confirmLoading, setConfirmLoading] = useState(false);

   // Add ref to track current subscription
   const subscriptionRef = useRef(null);

   // Functions
   const appendFormData = (formData, data, parentKey = '') => {
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;
            const value = data[key];

            if (value && typeof value === 'object' && value.uri && value.type) {
               console.log(`📎 Appending file: ${key} -> ${value.name} (${value.type})`);
               formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               appendFormData(formData, value, formKey);
            } else {
               console.log(`📝 Appending field: ${formKey} -> ${value}`);
               formData.append(formKey, value);
            }
         }
      }
   }

   // Helper function to cleanup subscription
   const cleanupSubscription = () => {
      if (subscriptionRef.current) {
         subscriptionRef.current.unsubscribe();
         subscriptionRef.current = null;
      }
   }

   const createAppointment = async () => {
      try {
         setSummary(null);
         setWorker(null);

         console.log("---- [Appointment Context] Initial Appointment Attempt ----");
         setAppointmentLoading(true);
         console.log("[1] Preparing Appointment Data");
         const converted = {
            ...appointment,
            date: convertDateToFormattedDate(appointment.date),
            time: convertDateToTime24(appointment.time),
            attachment: convertUriToFile(appointment.attachment),
         }
         console.log(converted);

         const formData = new FormData();
         appendFormData(formData, converted);

         console.log("[2] Submitting Initial Appointment");
         const appointmentResult = await api.post(`/user/book`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`,
               'Content-Type' : "multipart/form-data"
            }
         });
         setCurrentAppointment(appointmentResult?.data?.data);

         console.log("[3] Successful Creation of Appointment. Routing to Worker Waiting");
         router.push("/dashboard/client/appointment/queue");

      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when creating your appointment. Please try again.";
         setErrorTitle("Appointment Error");
         setErrorMessage(message);
         setShowErrorModal(true);
      } finally {
         setAppointmentLoading(false);
      }
   }

   const clearAppointment = () => {
      setAppointment({
         date: null,
         time: null,
         service_id: null,
         sub_service_id: null,
         description: "",
         attachment: null,
      })
   }

   useEffect(() => {
      if (!currentAppointment?.id) {
         cleanupSubscription();
         return;
      }

      // Cleanup any existing subscription
      cleanupSubscription();

      setAppointmentLoading(true);
      console.log("---- [Appointment Context] Worker Queue Attempt ----");
      console.log('[1] Waiting for appointment ID:', currentAppointment.id);

      const changes = supabase
         .channel(`appointment-${currentAppointment.id}`)
         .on(`postgres_changes`, {
            event: 'UPDATE',
            schema: 'public',
            table: 'initial_bookings',
            filter: `id=eq.${currentAppointment.id}`
         }, (payload) => {
            console.log("[2] Real-time Update Received");
            console.log("Old data:", payload.old);
            console.log("New data:", payload.new);
            
            const newData = payload.new;
            const oldData = payload.old;
            
            // Check for worker changes
            if (oldData.accepted_by !== newData.accepted_by) {
               console.log(`[3] Worker changed: ${oldData.accepted_by} -> ${newData.accepted_by}`);
            }
            
            setCurrentAppointment(newData);
            
            // Stop loading if we have a worker
            if (newData.accepted_by) {
               setAppointmentLoading(false);
            }
         })
         .subscribe();

      // Store reference to current subscription
      subscriptionRef.current = changes;

      return () => {
         cleanupSubscription();
      };
   }, [currentAppointment?.id, currentAppointment?.accepted_by]);

   const rejectAppointment = async (id) => {
      try {
         const currentId = id || currentAppointment?.id;

         console.log("---- [Appointment Context] Booking Cancellation Attempt ----");
         console.log("[1] Cancelling Booking:", currentId);
         
         // Cleanup subscription before cancelling
         cleanupSubscription();
         
         await api.delete(`/user/book/${currentId}/reject_booking`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });
         console.log("[2] Cancellation Successful");
         
         // Reset all states
         setCurrentAppointment(null);
         setAppointmentLoading(false);
         setQueueError(false);
         setNewWorkerError(false);
         setRetryCount(0);
         
         if (retryCount < MAX_RETRIES) {
            router.replace('/dashboard/client');
         } else {
            router.replace('/dashboard/client/appointment/failed');
         }
         
         clearAppointment();
         setAppointmentLoading(false);
         
      } catch (err) {
         console.log("[0] Cancellation Failed");
         const message = err?.response?.data?.message || "An unknown error has occurred when cancelling your appointment. Please try again."
         setErrorTitle("Initial Appointment Error");
         setErrorMessage(message);
         setShowErrorModal(true);
      }
   }

   const fetchSummary = async (id) => {
      try {
         setSummaryLoading(true);
         console.log("---- [Appointment Context] Summary Fetch Attempt ----");
         console.log("[1] Fetching Summary");
         const summaryResult = await api.get(`/user/book/${id}/view_review_summary`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const summaryData = summaryResult?.data?.data;
         console.log("[2] Successful Fetching:");
         console.log(summaryData);
         setSummary(summaryData);
         setSummaryLoading(false);

         if (worker === null) {
            console.log("[3] Fetching Worker Info,", summaryData?.booking?.accepted_by);
            fetchWorkerInfo(summaryData?.booking?.accepted_by || currentAppointment?.accepted_by);
         }
         

      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred fetching the review summary"
         console.log("[0] Error Fetching:", message);
         setSummaryError(true);
         setErrorMessage(message);
         setShowErrorModal(true);
      }
   }

   const fetchWorkerInfo = async (id) => {
      try {
         setWorkerLoading(true);
         console.log("---- [Appointment Context] Worker Fetch Attempt ----");
         console.log("[1] Fetching Worker");
         const workerResult = await api.get(`/user/book/worker/${id}/view`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const workerData = workerResult?.data?.data;
         console.log("[2] Successful Fetching:");
         console.log(workerData);
         setWorker(workerData);
         setWorkerLoading(false);

      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred fetching the review summary"
         console.log("[0] Error Fetching:", message);
         setWorkerError(true);
         setErrorMessage(message);
         setShowErrorModal(true);
      } 
   }

   const fetchNewWorker = async (id) => {
      try {
         console.log("---- [Appointment Context] New Worker Fetch Attempt ----");
         console.log("[1] Fetching New Worker for ID:", id);
         
         // Set loading state and navigate first
         setAppointmentLoading(true);

         if (retryCount === 0) {
            router.replace(`/dashboard/client/appointment/queue`);
         }
         
         // Clean up existing subscription
         cleanupSubscription();
         
         // Make API call to find new worker
         const workerResult = await api.get(`/user/book/${id}/find_new_worker`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         });

         console.log("[2] Successful New Worker Request");
         console.log(workerResult?.data?.data?.booking);
         setCurrentAppointment(workerResult?.data?.data?.booking);
         setRetryCount(0);

      } catch (err) {
         console.log("[0] New Worker Fetch Failed");
         const message = err?.response?.data?.message || "Unable to find another service provider at the moment."
         
         // Set queue error instead of turning off loading
         setQueueError(true);
         setNewWorkerError(true);
         setErrorTitle("No Providers Available");
         setErrorMessage(message);
         setShowErrorModal(true);
         // Don't set appointmentLoading to false here - keep in loading state until resolved
      }
   }

   const retryFindNewWorker = async () => {
      setQueueError(false);  // Reset error state
      setNewWorkerError(false);
      setShowErrorModal(false);
      
      if (retryCount < MAX_RETRIES) {
         setRetryCount(prev => prev + 1);
         await fetchNewWorker(currentAppointment?.id);
      } else {
         // Max retries reached, show cancellation option
         setQueueError(true);
         setNewWorkerError(true);
         setErrorTitle("Still No Providers");
         setErrorMessage("We've tried multiple times but couldn't find an available provider. You can cancel this booking and try again later.");
         setShowErrorModal(true);
      }
   }

   const confirmAppointment = async (id) => {
      try {
         console.log("---- [Appointment Context] Confirming Attempt ----");
         setConfirmLoading(true);
         console.log("[1] Confirming Booking:", id);
         await api.put(`/user/book/${id}/confirm_booking`, {}, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })

         console.log("[2] Confirmed Succesfully, Routing to Success Screen");
         router.replace('/dashboard/client/appointment/success');
         clearAppointment();
         setAppointmentLoading(false);
      } catch (err) {
         console.log("[0] Confirming Failed");
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred while confirming your booking. Please try again.";
         setErrorMessage(message);
         setErrorTitle("Booking Confirmation Error");
         setShowErrorModal(true);
      } finally {
         setConfirmLoading(false);
      }
   }

   return (
      <AppointmentContext.Provider 
      value={{
        appointment,
        setAppointment,
        currentAppointment,
        setCurrentAppointment, // Expose this for manual state management if needed
        appointmentLoading,
        setAppointmentLoading,
        queueError,
        createAppointment,
        rejectAppointment,

        summary,
        summaryLoading,
        fetchSummary,

        worker,
        workerLoading,
        fetchWorkerInfo,

        fetchNewWorker,
        retryFindNewWorker,
        newWorkerError,
        retryCount,
        MAX_RETRIES,

        confirmAppointment,
        confirmLoading,
      }}>
         <ErrorModal 
         visible={showErrorModal}
         setVisible={setShowErrorModal}
         message={errorMessage}
         title={errorTitle}
         onExit={summaryError ? () => {
            setSummaryError(false);
            fetchSummary(currentAppointment?.id);
         } : workerError ? () => {
            setWorker(false);
            fetchWorkerInfo(currentAppointment?.accepted_by);
         } : newWorkerError ? (retryCount < MAX_RETRIES ? retryFindNewWorker : rejectAppointment) : null}
         buttonText={
            summaryError || workerError ? "Try again" : 
            newWorkerError ? (retryCount < MAX_RETRIES ? "Try Again" : "Cancel Booking") : 
            null
         }
         otherOnExit={newWorkerError && retryCount < MAX_RETRIES ? rejectAppointment : null}
         otherButtonText={newWorkerError && retryCount < MAX_RETRIES ? "Cancel Booking" : null}
         />
         
         {children}
      </AppointmentContext.Provider>
   )
}

export const useAppointment = () => useContext(AppointmentContext);