import 
   React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState 
} from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import {API_URL} from '../config'

const AppDataContext = createContext();

export const AppDataProvider = ({children}) => {
   const { user, token } = useAuth();
   const [ services, setServices ] = useState([]);
   const [ profile, setProfile ] = useState(null);
   const [ loading, setLoading ] = useState(true);

   const fetchAppData = async () => {
      if (!user || !token) return;

      try {
         setLoading(true);

         const res = await axios.get(`${API_URL}/general/services`);

         setServices(res.data.data);
      } catch (err) {
         console.log(err)
      } finally {
         setLoading(false);
      }
   }

   const fetchUserData = async () => {
      if (!user || !token) return;

      try {
         setLoading(true);

         const res = await axios.get(`${API_URL}/user/fetch_user`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         })
         setProfile(res.data.data);
      } catch (err) {
         console.log(err)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchAppData();
      fetchUserData();
   }, [user, token])

   return (
      <AppDataContext.Provider
      value={{
         services,
         profile,
         loading
      }}>
         {children}
      </AppDataContext.Provider>
   )
}

export const useAppData = () => useContext(AppDataContext);