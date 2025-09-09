// Context: DIY Context

// Imports
// ---- React and Expo Components
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {  useRouter } from 'expo-router';
// ---- Other Components
import ErrorModal from '../components/ErrorModal';
// ---- Other Libs
import { GoogleGenAI, Type } from "@google/genai";

const DiyContext = createContext();

export const DiyProvider = ({children}) => {
   // Hooks and States
   const ai = new GoogleGenAI({apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY});
   const router = useRouter();

   const commonPrompts = [
      {
         icon: 'faucet-drip', text: 'Leaking Faucet', 
         value: "Water keeps dripping from my faucet even when it’s fully turned off, and it won’t stop leaking."
      }, {
         icon: 'plug', text: 'Power Outlet', 
         value: "One of my power outlets has stopped working completely, and nothing I plug into it gets power."
      }, {
         icon: 'toilet', text: 'Clogged Outlet', 
         value: 'My toilet bowl is filled with water that won’t go down no matter how many times I flush.'
      }, {
         icon: 'house-crack', text: 'Cracked Wall', 
         value: 'There’s a long, visible crack running along my wall, and it seems to be getting worse over time.'
      },
   ]
   const [prompt, setPrompt] = useState("");
   const [promptLoading, setPromptLoading] = useState(false);
   const [result, setResult] = useState(null);
   const languageOptions = ["english", "tagalog", "taglish"];
   const [language, setLanguage] = useState("english");

   const [errorModal, setErrorModal] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   // Functions
   const handlePrompt = async () => {
      try {
         setPromptLoading(true);
         console.log("---- [DIY Context] Prompt Attempt ----");
         
         console.log("[1] Validating Prompt");
         setResult(null);
         if (prompt.trim().length === 0) {
            throw new Error("Type a description of your problem to proceed.");
         } else if (prompt.length > 2000) {
            throw new Error("Your description exceeded the character limit, please try a shorter one.");
         }
         
         const contents = `In conversational ${language}, give me clear, step-by-step guidance for solving this home issue: "${prompt}". Include the tools or materials needed, and a very short remark if should the client book a service provider instead from our app, HandyHome.`

         console.log("[2] Submitting Prompt:", contents);
         router.push('/dashboard/client/diy/loading');
         const promptResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
               responseMimeType: "application/json",
               responseSchema: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        issue_phrase: {
                           type: Type.STRING,
                        },
                        tools_materials: {
                           type: Type.ARRAY,
                           items: { type: Type.STRING } 
                        },
                        steps: {
                           type: Type.ARRAY,
                           items: {
                              type: Type.OBJECT,
                              properties: {
                                 title: { type: Type.STRING},
                                 substeps: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                 }
                              },
                              propertyOrdering: ["title", "substeps"]
                           },  
                        },
                        remarks: {
                           type: Type.STRING
                        }
                     },
                     propertyOrdering: ["issue_phrase", "tools_materials", "steps", "remarks"]
                  }
               }
            }
         })

         console.log("[3] Succesful Prompting");
         const promptData = JSON.parse(promptResult.text);

         console.log(promptData[0]);
         setResult(promptData[0]);
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || "An unknown error has occured when submitting your description. Please try again.";
         setErrorMessage(message);
         setErrorModal(true);
         router.replace('/dashboard/client/diy');
      } finally {
         setPromptLoading(false);
      }
   }

   return (
      <DiyContext.Provider
      value={{
         commonPrompts,
         prompt,
         setPrompt,
         promptLoading,
         handlePrompt,
         result,
         languageOptions,
         language,
         setLanguage,
      }}>
         <ErrorModal 
         visible={errorModal}
         setVisible={setErrorModal}
         title="Something Went Wrong"
         message={errorMessage}
         />
         {children}
      </DiyContext.Provider>
   )
}

export const useDiy = () => useContext(DiyContext);