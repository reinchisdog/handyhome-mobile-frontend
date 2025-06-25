/* --------------------------------- Imports -------------------------------- */
import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkerVerificationContext = createContext();

export const WorkerVerificationProvider = ({ children }) => {
   const [workerVerification, setWorkerVerification] = useState({
      verificationPhoto: null,
      validId1: {
         type: null,
         file: null,
      },
      validId2: {
         type: null,
         file: null,
      },
      nbiClearance: null,
      brgyClearance: null,
      certifications: [],        //max 5
      experience: {
         jobTitle: null,
         company: null,
         fromDate: null,
         toDate: null
      },
      workSamples: [],           //max 5
      offeredService: null,      //id
      offeredSubService: null    //id
   });

   const clearWorkerVerification = () => {
    setWorkerVerification(null);
   }

   return (
      <WorkerVerificationContext.Provider 
      value={{
         workerVerification,
         setWorkerVerification,
         clearWorkerVerification
      }}>
         {children}
      </WorkerVerificationContext.Provider>
   )
}

export const useWorkerVerification = () => useContext(WorkerVerificationContext);