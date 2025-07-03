/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
   const { token } = useAuth();

   const [appointment, setAppointment] = useState(null);
   
   const fetchAppointmentStatus = async (id) => {
      try {
         const result = await axios.get(`${API_URL}/user/book/${id}/check_status`, {
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
         await axios.delete(`${API_URL}/user/book/${id}/reject_booking`, {
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
         const result = await axios.get(`${API_URL}/user/book/${id}/view_review_summary`, {
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
        fetchAppointmentStatus,
        rejectInitialBooking,
        reviewSummary,
        fetchReviewSummary,
        summaryLoading,
        setSummaryLoading
      }}>
         {children}
      </AppointmentContext.Provider>
   )
}

export const useAppointment = () => useContext(AppointmentContext);