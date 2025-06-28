/* --------------------------------- Imports -------------------------------- */
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkerVerificationContext = createContext();

export const WorkerVerificationProvider = ({ children }) => {
   const router = useRouter();

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

   const convertFiles = async (w) => {

   }

   const submitWorkerVerify = async () => {
      const body = await convertFiles(workerVerify)

      const successful = true;

      if (successful) router.replace('client-dashboard/verify-worker/success')      
   }

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