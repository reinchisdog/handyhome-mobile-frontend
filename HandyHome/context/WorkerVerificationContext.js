/* --------------------------------- Imports -------------------------------- */
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from './AuthContext';

const WorkerVerificationContext = createContext();

export const WorkerVerificationProvider = ({ children }) => {
   const router = useRouter();
   const {token} = useAuth();

   const [workerVerify, setWorkerVerify] = useState({
      verificationPhoto: null,
      validIds: [],           
      nbiClearance: null,
      brgyClearance: null,
      certifications: [],        
      experience: null,             
      workSamples: [],           
      offeredService: null,      
      offeredSubService: null    
   });

   /* ---- STRUCTURE
      verificationPhoto: uri,
      validIds[2]: [{
         file: uri,
         number: string,
         type: {
            title: string,
            value: string,
         },
      }],
      nbiClearance: uri,
      brgyClearance: uri,
      certifications: [{
         date: Date,
         file: uri,
         name: string,
         organization: string
      }],
      experience: {
         company: string
         title: string
         fromDate: Date,
         toDate: Date
      },
      workSamples: [uri],
      offeredServices: {
         id: int,
         name: string
      },
      offeredSubServices: {
         id: int,
         name: string
      }
   */

   const [fileInfo, setFileInfo] = useState({
      nbiClearance: null,
      brgyClearance: null,
      certifications: []
   })

   const clearWorkerVerify = () => {
    setWorkerVerify(null);
   }

   const convertToBlob = async (uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
   }

   const convertDateToString = async (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth is 0-based
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
    
      return `${month}-${day}-${year}`;
    };

   const buildFormData = async () => {
      const w = workerVerify;
      const formData = new FormData();
    
      if (!w.validIds[0] || !w.validIds[1]) throw new Error("Both valid IDs are required");
    
      formData.append('service_id', w.offeredService.id);
      formData.append('sub_service_id', w.offeredSubService.id);
    
      formData.append('primary_id_1', await convertToBlob(w.validIds[0].file));
      formData.append('primary_id_1_number', w.validIds[0].number);
    
      formData.append('primary_id_2', await convertToBlob(w.validIds[1].file));
      formData.append('primary_id_2_number', w.validIds[1].number);
    
      formData.append('nbi', await convertToBlob(w.nbiClearance));
      formData.append('barangay', await convertToBlob(w.brgyClearance));
    
      const certBlobs = await Promise.all(w.certifications.map(cert => convertToBlob(cert.file)));
      const issueDates = await Promise.all(w.certifications.map(cert => convertDateToString(cert.date)));
    
      certBlobs.forEach((blob, i) => {
        formData.append(`certificates[${i}]`, blob);
        formData.append(`certificate_name[${i}]`, w.certifications[i].name);
        formData.append(`issue_organization[${i}]`, w.certifications[i].organization);
        formData.append(`issue_date[${i}]`, issueDates[i]);
      });
    
      const workBlobs = await Promise.all(w.workSamples.map(sample => convertToBlob(sample)));
      workBlobs.forEach((blob, i) => {
        formData.append(`work_samples[${i}]`, blob);
      });
    
      return formData;
   };

   const submitWorkerVerify = async () => {
      try {
        console.log('[1] Converting Files for Submission');
        const body = await buildFormData();
        console.log('[Application Body]', body);
    
        console.log('[2] Submitting Files');
        const result = await axios.post(`${API_URL}/user/upload_application_documents`, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
    
        console.log('[3] Done Submitting Files');
        const status = result?.data?.status || "error";
        const message = result?.data?.message;
    
        if (status === "success") {
          return { success: true };
        } else {
          throw new Error(message);
        }
      } catch (err) {
        const message = err.message || "An unknown error occurred when submitting your application.";
        return { success: false, message };
      }
    };

   return (
      <WorkerVerificationContext.Provider 
      value={{
         workerVerify,
         setWorkerVerify,
         clearWorkerVerify,
         fileInfo,
         setFileInfo,
         submitWorkerVerify
      }}>
         {children}
      </WorkerVerificationContext.Provider>
   )
}

export const useWorkerVerify = () => useContext(WorkerVerificationContext);