/* --------------------------------- Imports -------------------------------- */
import SplashScreen from './splash';
import { View, useWindowDimensions } from 'react-native'
import { useCustomFonts } from '../assets/fonts/index';

export default App = () => {
    const {width, height} = useWindowDimensions()
    const [fontsLoaded] = useCustomFonts();

    if (!fontsLoaded) return (
        <View style={{
            height: height,
            width: width,
            backgroundColor: '#3A454D'
        }}/>
    )

    return <SplashScreen />
}