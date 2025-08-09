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
import axios from 'axios';
import {API_URL} from '../config'

const AppDataContext = createContext();

export const AppDataProvider = ({children}) => {
   // States and Hook Calls
   const [fontsLoaded] = useCustomFonts();
   const { user, token } = useAuth();
   const [isAppDataReady, setIsAppDataReady] = useState(false);
   const [ services, setServices ] = useState([]);
   const [ profile, setProfile ] = useState(null);
   const [ worker, setWorker ] = useState(null)

   // Functions
   const fetchServices = async () => { 
      try {
         const res = await axios.get(`${API_URL}/general/services`);
         setServices(res.data.data);

         console.log("[AppData Context]: Fetched Services Successfully");
      } catch (err) {
         console.error("[AppData Context]: Fetched Services Failed", err);
      }
   }

   const fetchProfile = async () => {
      try {
         const res = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setProfile(res.data.data);

         console.log("[AppData Context]: Fetched Profile Successfully");
      } catch (err) {
         console.error("[AppData Context]: Fetched Profile Failed", err);
      }
   }

   const fetchWorker = async () => {
      if (user?.role !== "Worker") return; 

      try {
         const res = await axios.get(`${API_URL}/worker`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setWorker(res.data.data);

         console.log("[AppData Context]: Fetched Worker Successfully");
      } catch (err) {
         console.error("[AppData Context]: Fetched Worker Failed", err);
      }
   }

   useEffect(() => {
      if (!fontsLoaded || isAppDataReady) return;

      console.log("---");
      console.log("[AppData Context]: Initializing App Data");

      const init = async () => {
         try {
            if (user && token) {
               fetchProfile(); 
               fetchWorker();  
            }
   
            await fetchServices();
   
            setIsAppDataReady(true);
            console.log("[AppData Context]: App Data Ready");
         } catch (err) {
            console.error("[AppData Context]: Initialization Failed", err);
         }
      };

      init();
   }, [fontsLoaded, user, token, isAppDataReady]);

   if (!fontsLoaded) return null;

   return (
      <AppDataContext.Provider
      value={{
         services,
         profile,
         worker,
         isAppDataReady,
      }}>
         {children}
      </AppDataContext.Provider>
   )
}

export const useAppData = () => useContext(AppDataContext);