import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router';
import {MediaProvider} from '../../../../context/MediaContext';

const ClientChatLayout = () => {
   return (
      <MediaProvider>
         <Stack 
         screenOptions={{
            headerShown: false
         }}/>
      </MediaProvider>
   )
}

export default ClientChatLayout

const styles = StyleSheet.create({})