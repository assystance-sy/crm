import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Button from '../components/Button';
import products from '../database/products.json';
import images from '../assets/images';

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

      <ScrollView
        contentContainerStyle={styles.productListContentContainer}
        style={styles.productListContainer}>
        {matchedProducts.map(product => {
          return (
            <TouchableOpacity
              style={styles.productContainer}
              key={product.sku}
              onPress={() => handleProductPress(product)}>
              <Image
                source={images[product.image]}
                style={styles.productImage}
              />
              <View style={styles.productInfoContainer}>
                <View style={styles.product}>
                  <Text style={styles.productLabel}>Name:</Text>
                  <Text style={styles.productValue}>{product?.name}</Text>
                </View>
                <View style={styles.product}>
                  <Text style={styles.productLabel}>Code:</Text>
                  <Text style={styles.productValue}>{product?.sku}</Text>
                </View>
                <View style={styles.product}>
                  <Text style={styles.productLabel}>Barcode:</Text>
                  <Text style={styles.productValue}>{product?.barcode}</Text>
                </View>
                <View style={styles.product}>
                  <Text style={styles.productLabel}>Pack Size:</Text>
                  <Text style={styles.productValue}>{product?.packSize}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {matchedProducts.length === 0 && (
          <Text style={styles.noProduct}>No Item Found</Text>
        )}
      </ScrollView>

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
  productImage: {
    width: 100,
    aspectRatio: '4/3',
    objectFit: 'contain',
    alignSelf: 'center',
  },
  product: {
    flexDirection: 'row',
  },
  productLabel: {
    width: '35%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  productValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
  },
  productContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  productListContentContainer: {},
  productListContainer: {
    marginTop: 20,
  },
  productInfoContainer: {
    flex: 1,
  },
  noProduct: {
    textAlign: 'center',
  },
});

export default SearchScreen;
