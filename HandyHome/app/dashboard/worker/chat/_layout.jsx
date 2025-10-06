import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router';
import {MediaProvider} from '../../../../context/MediaContext';

const WorkerChatLayout = () => {
   return (
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false
         }}/>
      </MediaProvider>
   )
}

export default WorkerChatLayout

const styles = StyleSheet.create({})