// Context: Appointment Context 

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
   const [errorModal, setErrorModal] = useState(false);
   const [errorType, setErrorType] = useState(null);
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
   const [materials, setMaterials] = useState([]);
   const [materialsSelected, setMaterialsSelected] = useState(false);
   const [summary, setSummary] = useState(null);
   const [worker, setWorker] = useState(null);

   const [createLoading, setCreateLoading] = useState(false);
   const [queueLoading, setQueueLoading] = useState(true);
   const [appointmentLoading, setAppointmentLoading] = useState(false);
   const [materialsLoading, setMaterialsLoading] = useState(true);
   const [summaryLoading, setSummaryLoading] = useState(true);
   const [workerLoading, setWorkerLoading] = useState(true);

   // New worker fetch error state
   const [retryCount, setRetryCount] = useState(0);
   const MAX_RETRIES = 2;

   // Add ref to track current subscription
   const subscriptionRef = useRef(null);

   // Functions
   const appendFormData = (formData, data, parentKey = '') => {
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;
            const value = data[key];

            if (value && typeof value === 'object' && value.uri && value.type) {
               // console.log(`📎 Appending file: ${key} -> ${value.name} (${value.type})`);
               formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               appendFormData(formData, value, formKey);
            } else {
               // console.log(`📝 Appending field: ${formKey} -> ${value}`);
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

   // Creates Appointment
   const createAppointment = async () => {
      try {
         setSummary(null);
         setWorker(null);

         console.log("---- [Appointment Context] Initial Appointment Attempt ----");
         setCreateLoading(true);
         console.log("[1] Preparing Appointment Data");
         const converted = {
            ...appointment,
            date: convertDateToFormattedDate(appointment.date),
            time: convertDateToTime24(appointment.time),
            attachment: convertUriToFile(appointment.attachment),
         }
         console.log(converted);

         const formData = new FormData();
         // appendFormData(formData, converted);
         formData.append('date', converted.date);
         formData.append('time', converted.time);
         formData.append('service_id', converted.service_id);
         formData.append('sub_service_id', converted.sub_service_id);
         formData.append('description', converted.description);
         if (converted.attachment) {
            formData.append('attachment', converted.attachment);
         }

         console.log("[2] Submitting Initial Appointment");
         const appointmentResult = await api.post(`/user/book`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`,
               'Content-Type' : "multipart/form-data"
            }
         });
         setCurrentAppointment(appointmentResult?.data?.data);
         const appointment_id = appointmentResult?.data?.data.id.toString();
         await AsyncStorage.setItem('pending_appointment', appointment_id);
         setQueueLoading(true);

         console.log(`[3] Successful Creation of Appointment ${appointmentResult?.data?.data?.id}. Routing to Worker Waiting`);
         router.push("/dashboard/client/appointment/queue");

      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred when creating your appointment. Please try again.";
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
      } finally {
         setCreateLoading(false);
      }
   }

   const checkPendingAppointment = async () => {
      try {
         const pending = await AsyncStorage.getItem('pending_appointment');
         console.log("Pending from AsyncStorage:", pending);

         let appointmentData = null;

         if (pending) {
            try {
               const response = await api.get(`user/book/${pending}/check-initial-booking`, {
                  headers: {'Authorization': `Bearer ${token}`}
               });
               appointmentData = response?.data?.data;
            } catch (err) {
               console.log("Error fetching with ID, will try backup endpoint:", err?.message);
            }
         }

         if (!appointmentData) {
            console.log("Trying backup endpoint to fetch pending appointment");
            try {
               const backupResponse = await api.get(`user/book/check-initial-existing-booking`, {
                  headers: {'Authorization': `Bearer ${token}`}
               });
               appointmentData = backupResponse?.data?.data;

               if (appointmentData?.id) {
                  await AsyncStorage.setItem('pending_appointment', appointmentData.id.toString());
                  console.log("Stored pending appointment ID from backup endpoint:", appointmentData.id);
               }
            } catch (backupErr) {
               console.log("Backup endpoint also failed:", backupErr?.message);
            }
         }
         
         if (appointmentData?.id) {
            const selected = await AsyncStorage.getItem('materialsSelected');
            console.log("SELECTED?", selected);
            setMaterialsSelected(selected === 'true');
            // console.log(appointmentData);
            setCurrentAppointment(appointmentData); 
         }

      } catch (err) {
         console.error("Error in checkPendingAppointment:", err?.response?.data?.message || err?.message);
      }
   }

   useEffect(() => {
      checkPendingAppointment();
   }, [])

   // Clears Appointment
   const clearAppointment = async () => {
      setAppointment({
         date: null,
         time: null,
         service_id: null,
         sub_service_id: null,
         description: "",
         attachment: null,
      })
      setCurrentAppointment(null);
      await AsyncStorage.removeItem('pending_appointment');
   }

   useEffect(() => {
      if (!currentAppointment?.id) {
         cleanupSubscription();
         return;
      }

      // Cleanup any existing subscription
      cleanupSubscription();
      // console.log("---- [Appointment Context] Worker Queue Attempt ----");
      // console.log('[1] Waiting for appointment ID:', currentAppointment.id);

      const changes = supabase
         .channel(`appointment-${currentAppointment.id}`)
         .on(`postgres_changes`, {
            event: 'UPDATE',
            schema: 'public',
            table: 'initial_bookings',
            filter: `id=eq.${currentAppointment.id}`
         }, async (payload) => {
            // console.log("======================= APPOINTMENT CHANGE =========================");
            const newData = payload.new;
            const oldData = currentAppointment;

            console.log("NEW DATA:", newData);
            console.log("OLD DATA:", oldData);

            let queueLoad;
            if (oldData.accepted_by !== newData.accepted_by) {
               if (oldData.accepted_by && !newData.accepted_by) {
                  // Worker was removed - looking for new worker
                  // console.log("LOOKING FOR NEW WORKER");
                  setQueueLoading(true);
               } else if (newData.accepted_by) {
                  // We have a worker (either new or replacement)
                  // console.log("FOUND A WORKER");
                  setQueueLoading(false);
               }
            } else {
               // accepted_by didn't change, don't modify loading state
               // console.log("OTHER FIELD UPDATED - NO QUEUE LOADING CHANGE");
            }
            
            setCurrentAppointment(newData);
            setQueueLoading(queueLoad);
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

         // console.log("---- [Appointment Context] Booking Cancellation Attempt ----");
         // console.log("[1] Cancelling Booking:", currentId);
         
         // Cleanup subscription before cancelling
         cleanupSubscription();
         
         await api.delete(`/user/book/${currentId}/reject_booking`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });
         // console.log("[2] Cancellation Successful");
         
         // Reset all states
         setCurrentAppointment(null);
         setAppointmentLoading(false);
         setErrorType(null);
         setRetryCount(0);
         
         if (retryCount < MAX_RETRIES) {
            router.replace('/dashboard/client');
         } else {
            router.replace('/dashboard/client/appointment/failed');
         }
         
         await clearAppointment();
         setAppointmentLoading(false);
         
      } catch (err) {
         // console.log("[0] Cancellation Failed");
         const message = err?.response?.data?.message || "An unknown error has occurred when cancelling your appointment. Please try again."
         setErrorMessage(message);
         setErrorType(null);
         setErrorModal(true);
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
         console.log("[0] Error Fetching Summary:", message);
         setErrorMessage(message);
         setErrorType('summary');
         setErrorModal(true);
      }
   }

   const fetchMaterials = async (id) => {
      try {
         setMaterialsLoading(true);
         // console.log("---- [Appointment Context] Materials Fetch Attempt ----");
         // console.log("[1] Fetching Materials");
         const materialResult = await api.get(`/user/book/${id}/booking_materials`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const materialData = materialResult?.data?.data;
         // console.log("[2] Successful Fetching:");
         console.log('CLIENT MATERIAL DATA:', materialData);
         const formattedData = materialData.map(material => ({
            id: material.id,
            material_id: material.material_id,
            name: material.name,
            description: material.description,
            price: material.unit_price,
            max_quantity: material.quantity,
            quantity: material.quantity,
            selected: false
         }))
         if (formattedData.length === 0) {
            setMaterialsSelected(true);
            AsyncStorage.setItem('materialsSelected', 'true');
            router.replace('/dashboard/client/appointment/summary');
         }
         setMaterials(formattedData);
         setMaterialsLoading(false);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred fetching the add-on materials for this booking."
         // console.log("[0] Error Fetching:", message);
         setErrorMessage(message);
         setErrorType(true);
         setErrorModal(true);
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
         console.log("[2] Successful Fetchinjg:");
         console.log(workerData);
         setWorker(workerData);
         setWorkerLoading(false);
 
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occurred fetching the review summary"
         console.log("[0] Error Fetching Worker Info:", message);
         setErrorMessage(message);
         setErrorType('worker');
         setErrorModal(true);
      } 
   }

   const fetchNewWorker = async (id) => {
      try {
         // console.log("---- [Appointment Context] New Worker Fetch Attempt ----");
         console.log("[1] Fetching New Worker for ID:", id);
         
         // Set loading state and navigate first
         setQueueLoading(true);

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

         // console.log("[2] Successful New Worker Request");
         // console.log(workerResult?.data?.data?.booking);
         setCurrentAppointment(workerResult?.data?.data?.booking);
         setRetryCount(0);
         await AsyncStorage.removeItem('materialsSelected');
         setMaterialsSelected(false);

      } catch (err) {
         // console.log("[0] New Worker Fetch Failed");
         const message = err?.response?.data?.message || "Unable to find another service provider at the moment."
         
         // Set queue error instead of turning off loading
         setErrorMessage(message);
         setErrorType('new-worker');
         setErrorModal(true);
         // Don't set appointmentLoading to false here - keep in loading state until resolved
      }
   }

   const retryFindNewWorker = async () => {
      setErrorType(null);
      setErrorModal(false);
      
      if (retryCount < MAX_RETRIES) {
         setRetryCount(prev => prev + 1);
         await fetchNewWorker(currentAppointment?.id);
      } else {
         // Max retries reached, show cancellation option
         setErrorType('new-worker');
         setErrorMessage("We've tried multiple times but couldn't find an available provider. You can cancel this booking and try again later.");
         setErrorModal(true);
      }
   }

   // Renders
   const getErrorHandler = () => {
      switch(errorType) {
         case 'material':
            return () => {
               setErrorType(null);
               fetchMaterials(currentAppointment?.id);
            };
         case 'summary':
            return () => {
               setErrorType(null);
               fetchSummary(currentAppointment?.id);
            };
         case 'worker':
            return () => {
               setErrorType(null);
               fetchWorkerInfo(currentAppointment?.accepted_by);
            };
         case 'new-worker':
            return retryCount < MAX_RETRIES ? retryFindNewWorker : rejectAppointment;
         default:
            return null;
      }
   }

   const getButtonText = () => {
      switch(errorType) {
         case 'material':
         case 'summary':
         case 'worker':
            return "Try again";
         case 'new-worker':
            return retryCount < MAX_RETRIES ? "Try Again" : "Cancel Booking";
         default:
            return null;
      }
   }

   return (
      <AppointmentContext.Provider 
      value={{
         appointment,
         setAppointment,
         currentAppointment,
         setCurrentAppointment, // Expose this for manual state management if needed
         clearAppointment,
         createLoading,
         queueLoading,
         
         appointmentLoading,
         setAppointmentLoading,
         createAppointment,
         rejectAppointment,

         summary,
         setSummary,
         summaryLoading,
         fetchSummary,

         materials,
         setMaterials,
         materialsSelected,
         setMaterialsSelected,
         materialsLoading,
         fetchMaterials,

         worker,
         workerLoading,
         fetchWorkerInfo,

         fetchNewWorker,
         retryFindNewWorker,
         retryCount,
         MAX_RETRIES,

         setErrorMessage,
         setErrorType,
         setErrorModal,
      }}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         message={errorMessage}
         title='Something went wrong!'
         onExit={getErrorHandler()}
         buttonText={getButtonText()}
         otherOnExit={errorType === 'new_worker' && retryCount < MAX_RETRIES ? rejectAppointment : null}
         otherButtonText={errorType === 'new_worker' && retryCount < MAX_RETRIES ? "Cancel Booking" : null}
         />
         
         {children}
      </AppointmentContext.Provider>
   )
}

export const useAppointment = () => useContext(AppointmentContext);