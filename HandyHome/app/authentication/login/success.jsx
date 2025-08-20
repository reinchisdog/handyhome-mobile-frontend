// Screen: Auth Loading Screen - Animated Loading Screen for Authentication

// Imports
// ---- Hooks and React Components
import { View, Animated, Easing } from 'react-native'
// ---- Contexts
import {useAuth} from '../../../context/AuthContext'
// ---- Libraries
import {useRouter} from 'expo-router';
// ---- Custom Components
import LoadingDots from '../../../components/LoadingDots';
// ---- Styles and Icons
import { globalStyles as global } from '../../../styles/globalStyles';

export default AuthLoadingScreen = () => {
   // Hooks and States
   const {user} = useAuth();
   const router = useRouter();

   // Functions
   const handleRedirect = () => {
      if (user.role === 'User' || user.role === 'Guest') 
         router.replace('dashboard/client');
      else if (user.role === 'Worker') 
         router.replace('dashboard/worker');
   }
    
   return (
      <View style={[global.screenContainer, global.centerContainer, {backgroundColor: '#fff'}]}>
         <LoadingDots onAnimationEnd={handleRedirect} />
      </View>
   );
}
