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
import {
  createProduct,
  getProducts,
} from '../services/apiServices/productApiService';
import {
  createPackaging,
  getPackagings,
} from '../services/apiServices/packagingApiService';
import DataContext from '../services/DataContext';
import {createPurchaseOrderItem} from '../services/apiServices/purchaseOrderItemApiService';
import axios from 'axios';

const NewProductScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [product, setProduct] = useState({});
  const [packaging, setPackaging] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (!product?.barcode) {
      setProduct({});
      setPackaging({});
      return;
    }

    try {
      setLoading(true);
      const response = await getProducts({barcode: product?.barcode});
      const matchedProduct = response.data[0];

      if (matchedProduct) {
        setProduct(matchedProduct);
        await fetchPackagings(matchedProduct._id);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagings = async productId => {
    try {
      setLoading(true);
      const response = await getPackagings({product: productId});
      const matchedPackaging = response.data[0];

      if (matchedPackaging) {
        setPackaging(matchedPackaging);
      }
    } catch (error) {
      console.error('Error fetching packaging:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductInputChange = (key, value) => {
    setProduct(prevState => ({...prevState, [key]: value, _id: null}));
  };

  const handlePackagingInputChange = (key, value) => {
    setPackaging(prevState => ({...prevState, [key]: value, _id: null}));
  };

  const handleQuantityPress = async quantity => {
    try {
      if (!packaging?._id && !packaging?.quantity) {
        Alert.alert('Empty Pack Size', 'Please input the pack size', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?._id && !product?.name) {
        Alert.alert('Empty Product Name', 'Please input the product name', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?._id && !product?.sku) {
        Alert.alert('Empty Product Code', 'Please input the product code', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      if (!product?._id && !product?.barcode) {
        Alert.alert(
          'Empty Product Barcode',
          'Please input the product barcode',
          [{text: 'OK', onPress: () => {}}],
        );
        return;
      }

      let productId = product._id;
      let packagingId = packaging._id;

      if (!productId) {
        const response = await createProduct({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
        });
        productId = response.data._id;
        setProduct(response.data);
      }

      if (!packaging._id) {
        const response = await createPackaging({
          product: productId,
          quantity: packaging.quantity,
        });
        packagingId = response.data._id;
        setPackaging(response.data);
      }

      await createPurchaseOrderItem({
        product: productId,
        purchaseOrder: sharedData.purchaseOrderId,
        packaging: packagingId,
        quantity,
      });

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

  const handleCancelPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params.code) {
      handleProductInputChange('barcode', route.params.code);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.productContainer}>
          <Image source={{uri: product?.image}} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Product Name:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              value={product?.name || ''}
              onChangeText={value => handleProductInputChange('name', value)}
              multiline={true}
              editable={!product?._id && !loading}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Pack Size:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              keyboardType="numeric"
              value={packaging?.quantity?.toString() || ''}
              onChangeText={value =>
                handlePackagingInputChange('quantity', parseInt(value, 10))
              }
              editable={!packaging?._id && !loading}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productInfoLabel}>Code:</Text>
            <TextInput
              style={{...styles.productInfoValue, ...styles.textInput}}
              value={product?.sku || ''}
              onChangeText={value => handleProductInputChange('sku', value)}
              editable={!product?._id && !loading}
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

      <Button label={'Cancel'} onPress={handleCancelPress} />
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
