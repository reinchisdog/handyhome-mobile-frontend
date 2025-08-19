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
import api from '../lib/api';

const AppDataContext = createContext();

export const AppDataProvider = ({children}) => {
   // States and Hook Calls
   const [fontsLoaded] = useCustomFonts();
   const [isAppDataReady, setIsAppDataReady] = useState(false);
   const [ services, setServices ] = useState([]);

   // Functions
   const fetchServices = async () => { 
      try {
         console.log("BASE URL:", process.env.EXPO_PUBLIC_API_URL);
         console.log("API URL:", api);

         const res = await api.get(`/general/services`);
         setServices(res.data.data);

         console.log("[AppData Context]: Fetched Services Successfully");
      } catch (err) {
         console.error("[AppData Context]: Fetched Services Failed", err);
      }
   }

   useEffect(() => {
      if (!fontsLoaded || isAppDataReady) return;

      console.log("---");
      console.log("[AppData Context]: Initializing App Data");

      const init = async () => {
         try {
            await fetchServices();
   
            setIsAppDataReady(true);
            console.log("[AppData Context]: App Data Ready");
         } catch (err) {
            console.error("[AppData Context]: Initialization Failed", err);
         }
      };

      init();
   }, [fontsLoaded, isAppDataReady]);

   if (!fontsLoaded) return null;

   return (
      <AppDataContext.Provider
      value={{
         services,
         isAppDataReady,
      }}>
         {children}
      </AppDataContext.Provider>
   )
}

export const useAppData = () => useContext(AppDataContext);