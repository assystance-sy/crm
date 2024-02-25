import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native';
import Button from '../components/Button';
import products from '../database/products.json';
import ProductList from '../components/ProductList';

const SearchScreen = ({route, navigation}) => {
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [barcode, setBarcode] = useState('');

  const fetchProducts = () => {
    if (barcode.length < 4) {
      Alert.alert('Barcode too short', 'Please input at least 4 digits', [
        {text: 'OK', onPress: () => {}},
      ]);
      return;
    }

    const existingProducts = products.filter(p => p.barcode.includes(barcode));
    setMatchedProducts(existingProducts);
  };

  const handleProductPress = product => {
    navigation.push('Item', {product});
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.productInfoLabel}>Barcode:</Text>
        <TextInput
          style={styles.textInput}
          value={barcode}
          onChangeText={value => setBarcode(value)}
          onEndEditing={() => fetchProducts()}
          keyboardType={'numeric'}
        />
      </View>

      <ProductList
        items={matchedProducts}
        handleItemPress={handleProductPress}
      />

      <Button label={'Back'} onPress={handleBackPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
  },
});

export default SearchScreen;
