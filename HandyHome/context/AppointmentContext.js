// Context: Appointment Context

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
// ---- Misc
import api from '../lib/api';
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
   const [appointmentLoading, setAppointmentLoading] = useState(false);

   // Functions
   const appendFormData = (formData, data, parentKey = '') => {
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
                appendFormData(formData, data[key], formKey);
            } else {
                formData.append(formKey, data[key]);
            }
         }
      }
   }

   const createAppointment = async () => {
      try {
         console.log("---- [Appointment Context] Initial Appointment Attempt ----");
         setAppointmentLoading(true);
         console.log("[1] Preparing Appointment Data");
         const converted = {
            ...appointment,
            date: convertDateToFormattedDate(appointment.date),
            time: convertDateToTime24(appointment.time),
            attachment: convertUriToFile(appointment.attachment),
         }

         const formData = new FormData();
         appendFormData(formData, converted);

         console.log("[2] Submitting Initial Appointment");
         const appointmentResult = await api.post(`/user/book`, formData, {
            headers: {
               'Authorization' : `Bearer ${token}`,
               'Content-Type' : "multipart/form-data"
            }
         });

         console.log("[3] Succesful Creation of Appointment. Routing to Worker Waiting");
         router.push("/dashboard/client/appointment/queue");

      } catch (err) {
         const message = err?.response?.data?.message || "An unknown error has ocurred when creating your appointment. Please try again.";
         console.log("[0.1] ", err);
         console.log("[0.2] Error:", message);
         setErrorTitle("Appointment Error");
         setErrorMessage(message);
         setShowErrorModal(true);
      } finally {
         setAppointmentLoading(false);
      }
   }

   
   const fetchAppointmentStatus = async (id) => {
      try {
         const result = await api.get(`/user/book/${id}/check_status`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         });

         const reqStatus = result?.data?.status || "error";
         const message = result?.data?.message;
         const bookStatus = result?.data?.data;

         if (reqStatus === "success") {
            return {
               success: true,
               status: bookStatus ? "ready" : "pending"
            }
         } else if (reqStatus === "failed" || reqStatus === "error") {
            throw Error (message);
         }

      } catch (err) {
         // Cancel Initial Booking
         const rejectResult = await rejectInitialBooking(id)
         const message = rejectResult.success ? err?.message || "An unknown error has occured." : rejectResult.message
         
         return {success: false, message: message}
      }
   }

   const rejectInitialBooking = async (id) => {
      try {
         await api.delete(`/user/book/${id}/reject_booking`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         return {success: true}
      } catch (err) {
         const message = err?.message || "An unknown error has occured."
         return {success: false, message: message}
      }
   }

   const [reviewSummary, setReviewSummary] = useState(null);
   const [summaryLoading, setSummaryLoading] = useState(true);

   const fetchReviewSummary = async (id) => {
      try {
         const result = await api.get(`/user/book/${id}/view_review_summary`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         })

         const status = result?.data?.status || "error";
         const message = result?.data?.message;

         if (status === "success") {
            setReviewSummary(result?.data?.data);
            return {succes: true}
         } else if (status === "failed" || status === "error") {
            throw new Error(message);
         }
      } catch (err) {
         const message = err?.message || "An unknown error has occurred fetching the review summary"
         return {success: false, message: message}
      }
   }

   return (
      <AppointmentContext.Provider 
      value={{
        appointment,
        setAppointment,
        appointmentLoading,
        createAppointment,
        fetchAppointmentStatus,
        rejectInitialBooking,
        reviewSummary,
        fetchReviewSummary,
        summaryLoading,
        setSummaryLoading
      }}>
         <ErrorModal 
         visible={showErrorModal}
         setVisible={setShowErrorModal}
         message={errorMessage}
         title={errorTitle}
         />
         {children}
      </AppointmentContext.Provider>
   )
}

export const useAppointment = () => useContext(AppointmentContext);