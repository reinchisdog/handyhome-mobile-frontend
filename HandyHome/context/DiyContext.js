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
         
         const contents = `You are an expert DIY assistant for the "HandyHome" app. Your goal is to provide clear, friendly, and practical step-by-step guidance for home repair or maintenance issues.
         
         NOTES:
         1. Analyze User Input: Examine the user's input (provided as "${prompt}").
         2. If the input is clearly unrelated to home repair, maintenance, tools, materials, or DIY projects (e.g., "wala na," "mahal kita," "ang init," "nakakainis ka," "ang ganda mo," a random word, or a non-question statement):
            - If the input is clearly unrelated to home repair, maintenance, tools, materials, or DIY projects (e.g., "wala na," "mahal kita," "ang init," "nakakainis ka," "ang ganda mo," a random word, or a non-question statement): Output ONLY the following unrelated message and nothing else; For example - This doesn't seem to be a home maintenance or repair question. Please describe the home issue you need help solving (e.g., "My sink is clogged," or "How do I fix a wobbly chair?").
            - If the input is a valid home issue (e.g., "My faucet is dripping," "How to patch a hole in drywall"): Proceed to step 3.
         3. Generate DIY Guide:
            - Language: Provide the entire response in conversational ${language} (e.g., Tagalog, Cebuano, English, etc., based on the requested language variable).
            - Title: Start with a friendly, encouraging title.
            - Materials & Tools: Create a section for the 'Kailangan Mo' (or equivalent in ${language}) listing all necessary materials and tools.
            - Steps: Provide clear, step-by-step guidance for solving the home issue ("${prompt}"). Use numbered lists and conversational language.
            - HandyHome Remark: End with a very short remark under the heading 'HandyHome Tip' (or equivalent) advising the user on whether they should "Book a Pro" (if the task is complex, hazardous, or requires specialized knowledge) or "You Got This!" (if it's a simple, beginner-friendly task).
         `

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
                        unrelated_message : {
                           type: Type.STRING,
                        },
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
                     propertyOrdering: ["unrelated_message", "issue_phrase", "tools_materials", "steps", "remarks"]
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