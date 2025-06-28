/* --------------------------------- Imports -------------------------------- */
import { Stack } from 'expo-router';
import { WorkerVerificationProvider } from '../../../../context/WorkerVerificationContext';
import { CameraProvider } from '../../../../context/CameraContext';

export default WorkerVerifyLayout = () => {

   return (
      <CameraProvider>
      <WorkerVerificationProvider>
         <Stack
         screenOptions={{
            headerShown: false
         }}/>
      </WorkerVerificationProvider>
      </CameraProvider>
   );
}