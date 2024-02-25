import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import axios from 'axios';
import products from '../database/products.json';
import images from '../assets/images';

const NewProductScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [product, setProduct] = useState({});
  const [barcode, setBarcode] = useState('');
  const [matchedProducts, setMatchedProducts] = useState([]);

  const fetchProducts = () => {
    const existingProducts = products.filter(p => p.barcode.includes(barcode));
    if (existingProducts.length >= 1) {
      setMatchedProducts(existingProducts);
      setProduct(existingProducts[0]);
    }
  };

  const handleProductInputChange = (key, value) => {
    setProduct(prevState => ({...prevState, [key]: value}));

    if (key === 'barcode') {
      setBarcode(value);
    }
  };

  const handleQuantityPress = async quantity => {
    try {
      if (!product?.packSize) {
        Alert.alert('Empty Pack Size', 'Please input the pack size', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?.name) {
        Alert.alert('Empty Product Name', 'Please input the product name', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?.sku) {
        Alert.alert('Empty Product Code', 'Please input the product code', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?.barcode) {
        Alert.alert(
          'Empty Product Barcode',
          'Please input the product barcode',
          [{text: 'OK', onPress: () => {}}],
        );
        return;
      }

      // await createPurchaseOrderItem({
      //   product: productId,
      //   purchaseOrder: sharedData.purchaseOrderId,
      //   packaging: packagingId,
      //   quantity,
      // });

      navigation.goBack();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        Alert.alert(
          'Failed to add item',
          `Error message: ${e.response.data.error.message}`,
          [{text: 'OK'}],
        );
      } else {
        Alert.alert('Failed to add item', `Error message: ${e.message}`, [
          {text: 'OK'},
        ]);
      }
    }
  };

  const handleScanPress = () => {
    setProduct({});
    navigation.push('Scanner');
  };

  useEffect(() => {
    if (route?.params?.code) {
      handleProductInputChange('barcode', route.params.code);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.productContainer}>
          <Image source={images[product.image]} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Product Name:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              value={product?.name || ''}
              onChangeText={value => handleProductInputChange('name', value)}
              multiline={true}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Pack Size:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              keyboardType="numeric"
              value={product?.packSize?.toString() || ''}
              onChangeText={value =>
                handleProductInputChange('packSize', parseInt(value, 10))
              }
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Code:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              value={product?.sku || ''}
              onChangeText={value => handleProductInputChange('sku', value)}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Barcode:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              keyboardType="numeric"
              value={product?.barcode || ''}
              onChangeText={value => handleProductInputChange('barcode', value)}
              onBlur={() => fetchProducts()}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Quantity:</Text>
            <View style={styles.quantityButtonGroup}>
              {[1, 2, 3, 4, 5].map(number => (
                <Button
                  label={number.toString()}
                  onPress={() => handleQuantityPress(number)}
                  style={styles.quantityButton}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Button label={'Scan'} onPress={handleScanPress} />
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
  productImage: {
    width: '50%',
    aspectRatio: '4/3',
    objectFit: 'contain',
    alignSelf: 'center',
  },
  productInfo: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  productInfoLabel: {
    width: '30%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  productInfoValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
  },
  productContainer: {
    rowGap: 20,
    marginVertical: 20,
  },
  quantityButton: {
    width: 45,
    aspectRatio: 1,
    paddingHorizontal: 0,
  },
  quantityButtonGroup: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    flex: 1,
    flexGrow: 1,
  },
  buttonGroup: {
    rowGap: 20,
  },
  textInput: {
    borderWidth: 1,
  },
});

export default NewProductScreen;
