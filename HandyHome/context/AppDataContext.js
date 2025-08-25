//Context: AppDataContext - Handles application-wide data such as services and user profile.

//Imports
import 
   React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState 
} from 'react';
import { useAuth } from './AuthContext';
import { useCustomFonts } from '../assets/fonts';
import ErrorModal from '../components/ErrorModal';
import api from '../lib/api';

const AppDataContext = createContext();

export const AppDataProvider = ({children}) => {
   // States and Hook Calls
   const {token, isTokenValid} = useAuth();

   const [fontsLoaded] = useCustomFonts();
   const [isAppDataReady, setIsAppDataReady] = useState(false);
   const [services, setServices] = useState([]);

   const [addresses, setAddresses] = useState([]);
   const [addressLoading, setAddressLoading] = useState(false);

   const [showError, setShowError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [errorTitle, setErrorTitle] = useState("");
   const [errorMode, setErrorMode] = useState(null);

   // Functions
   const fetchServices = async () => { 
      try {
         console.log("BASE URL:", process.env.EXPO_PUBLIC_API_URL);
         console.log("API URL:", api);

         const res = await api.get(`/general/services`);
         setServices(res.data.data);

         console.log("[AppData Context]: Fetched Services Successfully");
      } catch (err) {
         throw new Error("[AppData Context]: Fetched Services Failed", err);
      }
   }

   const fetchAddresses = async () => {
      try {
         console.log("---- [App Data Context] Fetch Addresses ----");
         setAddressLoading(true);
         console.log("[1] Fetching Addresses")
         const addressResult = await api.get(`/user/addresses`, {
            headers: {'Authorization' : `Bearer ${token}`}
         });

         console.log("[2] Fetched Succesfully")
         console.log(addressResult?.data?.data)
         setAddresses(addressResult?.data?.data);
      } catch (err) {
         console.log("[0] Fetching Error");
         const message = err?.response?.data?.message || err?.message || "An unkown error has ocurred when fetching your addresses. Please try again."
         setErrorTitle("Addresses Fetch Error");
         setErrorMessage(message);
         setErrorMode("addresses");
         setShowError(true);
      } finally {
         setAddressLoading(false);
      }
   }

   useEffect(() => {
      if (!fontsLoaded || isAppDataReady) return;

      console.log("---");
      console.log("[AppData Context]: Initializing App Data");

      const init = async () => {
         try {
            await fetchServices();
            if (token && isTokenValid) await fetchAddresses();
            
            setIsAppDataReady(true);
            console.log("[AppData Context]: App Data Ready");
         } catch (err) {
            console.error("[AppData Context]: Initialization Failed", err);
         }
      };

      init();
   }, [fontsLoaded, isAppDataReady, token]);

   if (!fontsLoaded) return null;

   return (
      <AppDataContext.Provider
      value={{
         services,
         isAppDataReady,
         addresses,
         addressLoading,
         fetchAddresses
      }}>
         <ErrorModal
         visible={showError}
         setVisible={setShowError}
         title={errorTitle}
         message={errorMessage}
         onExit={
            errorMode === "sevices" ? () => fetchServices() : 
            errorMode === "addresses" ? () => fetchAddresses() :
            null
         }
         buttonText={errorMode && "Try Again"}
         buttonLoad={addressLoading}
         />
         {children}
      </AppDataContext.Provider>
   )
}

export const useAppData = () => useContext(AppDataContext);