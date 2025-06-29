import 
   React, { 
   createContext, 
   useContext, 
   useEffect, 
   useState 
} from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AppDataContext = createContext();

const API_URL = 'http://localhost:5001/api/v1';

export const AppDataProvider = ({children}) => {
   const { user, token } = useAuth();
   const [ services, setServices ] = useState([]);
   const [ loading, setLoading ] = useState(true);

   const fetchAppData = async () => {
      if (!user || !token) return;

      try {
         setLoading(true);

         const res = await axios.get(`${API_URL}/general/services`);
         setServices(res.data);
      } catch (err) {

      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchAppData();
   }, [user, token])

   return (
      <AppDataContext.Provider
      value={{
         services,
         loading
      }}>
         {children}
      </AppDataContext.Provider>
   )
}

export const useAppData = () => useContext(AppDataContext);