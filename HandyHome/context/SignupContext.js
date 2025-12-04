//Context: Signup Context - Manages user registration data and updates

// Hooks and React Components
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "expo-router";
// Custom Components
import ErrorModal from "../components/ErrorModal";
// Other Libraries
import api from "../lib/api";
import { useConvert } from "../hooks/useConvert";

const SignupContext = createContext({})

export const SignupProvider = ({children}) => {
   // States and Hooks
   const {convertDateToFormattedDate} = useConvert();
   const router = useRouter();
   const [step, setStep] = useState(1);
   const [signupData, setSignupData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      phone_number: "",
      password: "",
      birth_date: null,
      home_address: {
         block: "",
         province: "",
         municipal: "",
         barangay: "",
      },
      terms_agreed: false
   })
   const [signupLoading, setSignupLoading] = useState(false);
   const [signupDisabled, setSignupDisabled] = useState(true);

   const [passErrors, setPassErrors] = useState([]);
   const [errorModal, setErrorModal] = useState(false);
   const [errorModalMessage, setErrorModalMessage] = useState(null);
   const [exitCondition, setExitCondition] = useState(null);

    // Functions
   const areFieldsFilled = () => {
      let areFilled = false;

      if (step === 1) {
         const firstName = signupData.first_name?.trim() || "";
         const lastName = signupData.last_name?.trim() || "";
         const gender = signupData.gender?.trim() || "";
         const birthdate = signupData.birth_date
         
         areFilled = (
            firstName !== "" &&
            lastName !== "" &&
            gender !== "" &&
            birthdate !== null
         );
      } else if (step === 3) { 
         const address = signupData.home_address || {};
      
         areFilled = (
            (address.block?.trim() || "") !== "" &&
            (address.province?.trim() || "") !== "" &&
            (address.municipal?.trim() || "") !== "" &&
            (address.barangay?.trim() || "") !== ""
         );
      } else if (step === 4) { 
         const email = signupData.email?.trim() || "";
         const phone = signupData.phone_number?.trim() || "";
         const password = signupData.password?.trim() || "";
         const termsAgreed = signupData.terms_agreed;
         
         areFilled = 
            email !== "" && 
            phone !== "" && 
            password !== "" && 
            termsAgreed;
      }

      return areFilled;
   }

   const areFormatsCorrect = () => {
      let errorMessage = null;

      if (step === 1) {
         errorMessage = validatePersonal();
      } else if (step === 3) {
         const addressError = validateAddress();
         if (addressError) {
            errorMessage = addressError;
         }
      } else if (step === 4) {
         const accountError = validateAccount();
         const passwordError = validatePassword();

         if (accountError) {
            errorMessage = accountError;
         } else if (passwordError) {
            errorMessage = passwordError;
         }
      }

      if (errorMessage) {
         showErrorModal(errorMessage);
         return false;
      }

      return true;
   };
  
   const validatePersonal = () => {
      const firstName = signupData.first_name?.trim() || "";
      const lastName = signupData.last_name?.trim() || "";
      const birthDate = signupData.birth_date;
      const minimumAge = 18 * 365.25 * 24 * 60 * 60 * 1000;

      if (firstName.length <= 1 || lastName.length <= 1) {
         return "First name and last name must be longer than 2 characters.";
      }

      if (!/^[A-Za-z\s-]+$/.test(firstName) || !/^[A-Za-z\s-]+$/.test(lastName)) {
         return "First name and last name must only contain letters.";
      }
      
      if ((new Date() - birthDate) < minimumAge) {
         return "You must be the age of 18 or above to register."
      }

      return null;
   };

   const validateAddress = () => {
      const province = signupData.home_address?.province?.trim() || "";
      const municipal = signupData.home_address?.municipal?.trim() || "";

      if (province !== "Second District" || municipal === "Marikina City") {
         return "Service is only available in Marikina City, Second District.";
      }
   }

   const validateAccount = () => {
      console.log("[Signup Context]: Validating Email and Phone");
      const email = signupData.email?.trim() || "";
      const phone = signupData.phone_number?.trim() || "";

      if (!email || !phone) {
         return "Email and phone number cannot be empty.";
      }

      if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return "Please enter a valid email address.";
      }

      if (!email.endsWith("@gmail.com")) {
         return "Email must be a Gmail address (e.g., handyh@gmail.com)";
      }

      if (phone.length !== 11) {
         return "Phone number must be 11 digits long.";
      }

      if (phone === "" || !/^09\d{9}$/.test(phone)) {
         return "Please enter a valid phone number starting with 09 and followed by 9 digits.";
      }

      return null; // Validation passed
   };
  
   const validatePassword = () => {
      console.log("[Signup Context]: Validating Password");
      const password = signupData.password?.trim() || "";

      if (password.length < 8) {
         return "Password must be at least 8 characters long.";
      }

      if (!/(?=.*[A-Z])/.test(password)) {
         return "Password must contain at least one uppercase letter.";
      }

      if (!/(?=.*[a-z])/.test(password)) {
         return "Password must contain at least one lowercase letter.";
      }

      if (!/(?=.*\d)/.test(password)) {
         return "Password must contain at least one number.";
      }

      if (!/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) {
         return "Password must contain at least one special character.";
      }

      if (!/^\S*$/.test(password)) {
         return "Password must not contain spaces.";
      }

      return null; // Validation passed
   };

   const showErrorModal = (message) => {
      setErrorModalMessage(message);
      setErrorModal(true);
   };  

   const updateSignupData = (name, data) => {
      setSignupData((prev) => ({
          ...prev,
          [name]: data
      }))
   }

   const updateHomeData = (name, data) => {
      if (name === 'province') {
         setSignupData(prev => ({
            ...prev,
            home_address: {
               ...prev.home_address,
               province: data,
               municipal: "",
               barangay: ""
            }
            
         }));
      } else if (name === 'municipal') {
         setSignupData(prev => ({
            ...prev,
            home_address: {
               ...prev.home_address,
               municipal: data,
               barangay: ""
            }
         }));
      } else if (name === 'barangay') {
         setSignupData(prev => ({
            ...prev,
            home_address: {
               ...prev.home_address,
               barangay: data
            }
         }));
      } else if (name === 'block') {
         setSignupData(prev => ({
            ...prev,
            home_address: {
               ...prev.home_address,
               block: data
            }
         }));
      }
   }

   const goToVerify = () => {
      router.replace('/authentication/verify');
   }

   const handleSignUp = async () => {
      try{
         setSignupLoading(true);

         if(!areFormatsCorrect())
            return;

         console.log("--- [Signup Context]: Sign Up Attempt ---");
         console.log("[1] Converting Data");
         const converted = {
            ...signupData,
            birth_date: convertDateToFormattedDate(signupData.birth_date)
         }

         await api.post(`/auth/signup`, converted, {
            headers: {
               'Content-Type': 'application/json',
            },
         });
         
         console.log("[2] Succesful Signing In")

         goToVerify();
         clearSignUp();
      } catch (err) {
         console.log("[0] Failed Signing In")
         console.log(err);
         const message = err.response?.data.message || "An error has ocurred when trying to sign in. Please try again.";

         if (
            message.toLowerCase().includes("verify") || 
            message.toLowerCase().includes("verification") || 
            message.toLowerCase().includes("verified")
         ) {
            setExitCondition("verify");
         } else {
            setExitCondition(null);
         }

         showErrorModal(message)
      } finally {
         setSignupLoading(false);
      }
   }

   const clearSignUp = async () => {
      setSignupData({
         first_name: "",
         last_name: "",
         email: "",
         gender: "",
         phone_number: "",
         password: "",
         birth_date: null,
         home_address: {
            block: "",
            province: "",
            municipal: "",
            barangay: "",
         },
         terms_agreed: false
      });
   }

   // Effects
   // ---- Check if all fields are filled ----
   useEffect(() => {
      if (areFieldsFilled()) {
         setSignupDisabled(false);
      } else {
         setSignupDisabled(true);
      }
   }, [signupData, step])

   // --- Check if password is valid ---
   useEffect(() => {
      const password = signupData.password || "";
      let requirements = []

      if (password.length > 8) requirements.push(0);
      if (/(?=.*[A-Z])/.test(password)) requirements.push(1);
      if (/(?=.*[a-z])/.test(password)) requirements.push(2);
      if (/(?=.*\d)/.test(password)) requirements.push(3);
      if (/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) requirements.push(4);
      if (/^\S*$/.test(password) && password !== "") requirements.push(5);

      setPassErrors(requirements);
   }, [signupData.password])

   return (
      <SignupContext.Provider value={{
      signupData, 
      updateSignupData,
      updateHomeData,
      handleSignUp,
      step,
      setStep,
      signupLoading,
      signupDisabled,
      areFormatsCorrect,
      passErrors,
      clearSignUp,

      setErrorModal,
      setErrorModalMessage,
      setExitCondition,
      }}>
         <ErrorModal 
         visible={errorModal} 
         setVisible={setErrorModal} 
         title={"Error Signing in with HandyHome"} 
         message={errorModalMessage}
         onExit={exitCondition === "verify" ? goToVerify : null}
         buttonText={exitCondition==="verify" ? "Verify Now" : null}/>

         {children}
      </SignupContext.Provider>
   )
}

export const useSignup = () => useContext(SignupContext);