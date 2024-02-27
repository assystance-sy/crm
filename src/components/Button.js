import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const Button = props => {
  const {onPress, label, style, buttonTextStyle} = props;
  return (
    <TouchableOpacity style={{...styles.button, ...style}} onPress={onPress}>
      <Text style={{...styles.buttonText, ...buttonTextStyle}}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cccccc',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 40,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});

export default Button;
