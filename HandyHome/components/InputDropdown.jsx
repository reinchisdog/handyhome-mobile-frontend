// Component: Input Dropdown

// Imports
// ---- React Components
import { Text, View, Animated, Easing, TouchableWithoutFeedback, TouchableHighlight, ScrollView, useWindowDimensions, StyleSheet, Modal } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
// ---- Styles and Icons
import { authStyles as auth } from '../styles/authStyles';
import { COLORS } from '../styles/constants';
import Icons from '@expo/vector-icons/Feather';

const InputDropdown = ({
   placeholder = 'Select Item',
   items = [],
   onSelect,
   selectedItem,
}) => {
   /* ----------------------------- Initialization ----------------------------- */
   const { height, width } = useWindowDimensions();
   const [itemListView, setItemListView] = useState(false);
   const [selected, setSelected] = useState(null);

   /* -------------------------------- Functions ------------------------------- */
   // --- For Matching
   useEffect(() => {
      setSelected(selectedItem);
    }, [selectedItem]);

   // ---- Opens Modal
   const onDropdownPress = () => {
      Animated.timing(borderColor, {
         toValue: 1,
         duration: 100,
         easing: Easing.out(Easing.ease),
         useNativeDriver: false
      }).start();
      setItemListView(true);
   }

   // ---- Closes Modal
   const onDropDownExit = () => {
      Animated.timing(borderColor, {
         toValue: 0,
         duration: 100,
         easing: Easing.out(Easing.ease),
         useNativeDriver: false
      }).start();
      setItemListView(false);
   }

   // ---- Handles Selection of Item
   const handleSelect = (item) => {
      setSelected(item);
      onSelect(item);
      onDropDownExit();
   }

   /* -------------------------------- Animation ------------------------------- */
   const borderColor = useRef(new Animated.Value(0)).current;
   const animBorderColor = borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.strokes, COLORS.primary]
   })

   return (
   <>
      {/* DROPDOWN BOX */}
      <TouchableWithoutFeedback
      onPress={onDropdownPress}>
         
         <Animated.View style={[
            auth.inputContainer,{
            borderColor: animBorderColor,
            position: 'static'
         }
         ]}> 
            <Text 
            style={[auth.inputText, {padding: 12, color: selected?.title ? COLORS.lettersicons : COLORS.strokes}]}>
               {selected?.title || placeholder}
            </Text>
            <View style={auth.inputIcon}>
               <Icons name="chevron-down" size={24} color="black" />
            </View>
            
         </Animated.View>

      </TouchableWithoutFeedback>

      {/* DROPDOWN LIST */}
      <Modal
      visible = {itemListView}
      transparent
      statusBarTranslucent
      animationType='fade'
      onRequestClose={onDropDownExit}
      >
         <View style={{
            width: width,
            height: height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
         }}>

            {/* SCROLL LIST */}
            <ScrollView style={auth.dropdownList}>

            {items?.map((item, index) => (
               <TouchableHighlight
               underlayColor='#7FCDEE20'
               key={index}
               onPress={() => handleSelect(item)}>
                  <View style={[
                     auth.dropdownItem, {
                     backgroundColor: (selected && selected.value == item.value)? '#7FCDEE40' : 'transparent'
                  }]}>
                     <Text style={auth.inputText}>
                        {item.title}
                     </Text>
                  </View>
               </TouchableHighlight>                     
               ))
            }

            </ScrollView>

            {/* BACKGROUND BUTTON (FOR EXIT) */}
            <TouchableWithoutFeedback
            onPress={onDropDownExit}>
               <View  style={{
               width: '100%',
               height: '100%',
               backgroundColor: '#00000040',
               position: 'absolute',
               top: 0,
               left: 0,
               zIndex: 1,
               elevation: 1
               }}></View>
            </TouchableWithoutFeedback>
         </View>
      </Modal>
   </>


      
   )
}

export default InputDropdown;
