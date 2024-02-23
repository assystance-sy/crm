import {StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import React from 'react';

const Picker = props => {
  const {onValueChange, items, placeholder, label, labelStyle} = props;

  return (
    <View style={styles.container}>
      <Text style={{...styles.pickerLabel, ...labelStyle}}>{label}</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          placeholder={placeholder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center'},
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

export default Picker;
