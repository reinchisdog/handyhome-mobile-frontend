// Component: Header

// Imports
// ---- React and Expo Components
import { View, useWindowDimensions, StatusBar, Animated, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
// ---- Styles and Icons
import { globalStyles as global } from "../styles/globalStyles";
import { COLORS, FONTS, FONT_SIZES } from "../styles/constants";
import Arrows from '@expo/vector-icons/Entypo';

const Header = ({
   backgroundColor = '#fff',
   textColor = COLORS.darkblue,
   hasBack = true,
   onBack,
   backColor = COLORS.primary,
   position = 'relative',
   title,
   customTitle,
   leftIcon,
   rightIcon,
}) => {
   // States and Hooks
   const { width } = useWindowDimensions();
   const router = useRouter();

   let flexDirection = 'row';
   if ((hasBack ||leftIcon) && !rightIcon) flexDirection = 'row';
   else if (rightIcon && !(hasBack ||leftIcon)) flexDirection = 'row-reverse';

   return (
      <Animated.View
      style = {[{
         width: width,
         backgroundColor: backgroundColor,
         paddingTop: StatusBar.currentHeight || 24,
         paddingHorizontal: 24,
         position: position,
         top: 0,
         left: 0,
         zIndex: 100,
      }]}>
         <View 
         style = {[{
            width: '100%',
            height: 64,
            flexDirection: flexDirection,
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
         }]}>
            {/* ---- Left Icon */}
            {hasBack ? (
               <TouchableOpacity
               onPress={onBack ? onBack : () => router.back()}
               >
                  <Arrows name="chevron-left" color={backColor} size={24}/>
               </TouchableOpacity>
            ) : leftIcon && leftIcon}

            {/* ---- Title */}
            {(title || customTitle) && (
               <View
               style={[{
                  height: '100%',
                  width: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute'
               }]}>
                  {customTitle && customTitle}
                  {title && (
                     <Text 
                     style={[
                        global.headingText, {
                        color: textColor}
                     ]}>
                        {title}
                     </Text>
                  )}
               </View>
            )}
            
            {/* ---- Right Icon */}
            {rightIcon && rightIcon}
         </View>
      </Animated.View>
   )
};

export default Header;