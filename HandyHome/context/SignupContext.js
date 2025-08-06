//Context: Signup Context - Manages user registration data and updates

// Hooks and React Components
import { createContext, useState, useEffect, useContext } from "react";
// Config
import {API_URL} from '../config';
// Custom Components
import ErrorModal from "../components/ErrorModal";

const SignupContext = createContext({})

export const SignupProvider = ({children}) => {
    // States and Hooks
    const [step, setStep] = useState(1);
    const [signupData, setSignupData] = useState({
        first_name: "",
        last_name: "",
        email: null,
        gender: "",
        phone_number: null,
        password: "",
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

    const [ passErrors, setPassErrors ] = useState([]);
    const [errorModal, setErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState(null);

    // Functions
    const validatePersonal = () => {
        const firstName = signupData.first_name?.trim() || "";
        const lastName = signupData.last_name?.trim() || "";
        const gender = signupData.gender?.trim() || "";
        
        const isNotEmpty = (
            firstName !== "" &&
            lastName !== "" &&
            gender !== ""
        );
        
        const isNotShort = (
            firstName.length > 2 &&
            lastName.length > 2
        );
        
        return isNotEmpty && isNotShort;
    };
  
    const validateLocation = () => {
    const address = signupData.home_address || {};
    
    const isNotEmpty = (
        (address.block?.trim() || "") !== "" &&
        (address.province?.trim() || "") !== "" &&
        (address.municipal?.trim() || "") !== "" &&
        (address.barangay?.trim() || "") !== ""
    );
    
    return isNotEmpty;
    };

    const validateAccount = () => {
    const email = signupData.email?.trim() || "";
    const phone = signupData.phone_number?.trim() || "";
    const password = signupData.password?.trim() || "";
    const termsAgreed = signupData.terms_agreed;
    
    const isNotEmpty = (email !== "" || phone !== "") && password !== "" && termsAgreed;
    
    const isValidEmail = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = phone === "" || /^09\d{9}$/.test(phone);
    
    return isNotEmpty && isValidEmail && isValidPhone;
    };

    const validatePassword = () => {
    const password = signupData.password?.trim() || "";
    
    const tempArr = [];
    
    if (password.length >= 8) tempArr.push(0);
    if (/(?=.*[A-Z])/.test(password)) tempArr.push(1);
    if (/(?=.*[a-z])/.test(password)) tempArr.push(2);
    if (/(?=.*\d)/.test(password)) tempArr.push(3);
    if (/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(password)) tempArr.push(4);
    if (/^\S*$/.test(password) && password.length > 1) tempArr.push(5);
    
    // Only update if changed
    setPassErrors(prev => {
        const same = prev.length === tempArr.length && prev.every((val, i) => val === tempArr[i]);
        return same ? prev : tempArr;
    });
    };

    const updateSignupData = (name, data) => {
        setSignupData((prev) => ({
            ...prev,
            [name]: data
        }))
    }

    const updateHomeData = (name, data) => {
        setSignupData((prev) => {
            return {
                ...prev,
                home_address: {
                    ...prev.home_address,
                    [name]: data
                }
            }
        })
    }

    const handleSignUp = async () => {
        try{
          setSignupLoading(true);
  
          // console.log('[SignUp] Sending:', signupData);
  
          const result = await axios.post(`${API_URL}/auth/signup`, signupData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const status = result?.data?.status || "error";
  
          if (status === "success") {
            router.push('authentication/signup/verify');
  
          } else if (status === "failed" || status === "error") {
            const message = result.data.message || 'Sign-up failed.';
            throw new Error(message);
          }
  
        } catch (err) {
          console.log(err.message);
          const message = err.message || "An error has ocurred when trying to sign in. Please try again.";
  
          showErrorModal(message)
        } finally {
          setSignupLoading(false);
        }
    }

    const showErrorModal = (message) => {
        setErrorModalMessage(message);
        setErrorModal(true);
    }

    // Effects
    useEffect(() => {
        validatePassword();
  
        if (step === 1 && validatePersonal()) {
          setSignupDisabled(false)
        } else if (step === 3 && validateLocation()) {
          setSignupDisabled(false)
        } else if (step === 4 && validateAccount() && passErrors.length === 6) {
          setSignupDisabled(false)
        } else {
          setSignupDisabled(true)
        }
      }, [signupData, step])

    return (
        <SignupContext.Provider value={{
            signupData, 
            updateSignupData,
            updateHomeData,
            handleSignUp,
            step,
            setStep,
            signupLoading,
            signupDisabled
        }}>
            <ErrorModal 
            visible={errorModal} 
            setVisible={setErrorModal} 
            title={"There is an error signing into HandyHome"} 
            message={errorModalMessage}/>
            {children}
        </SignupContext.Provider>
    )
}

export const useSignup = () => useContext(SignupContext);