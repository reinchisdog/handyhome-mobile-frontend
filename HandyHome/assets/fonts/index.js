import {useFonts} from 'expo-font';

export const useCustomFonts = () => {
    return useFonts({
        'Roboto-400': require('./Roboto-Regular.ttf'),
        'Roboto-500': require('./Roboto-Medium.ttf'),
        'Roboto-600': require('./Roboto-SemiBold.ttf'),
        'Roboto-700': require('./Roboto-Bold.ttf'),
    })
}