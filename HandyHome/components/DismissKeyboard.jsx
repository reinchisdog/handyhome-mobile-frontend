import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, TextInput } from 'react-native';

const DismissKeyboardWrapper = ({ children }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={{ flex: 1 }}>
      {children}
    </View>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardWrapper