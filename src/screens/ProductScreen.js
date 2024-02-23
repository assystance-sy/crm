import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import Button from '../components/Button';
import {getProduct} from '../services/apiServices/productApiService';
import {getPackagings} from '../services/apiServices/packagingApiService';
import DataContext from '../services/DataContext';
import {createPurchaseOrderItem} from '../services/apiServices/purchaseOrderItemApiService';

const ProductScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [product, setProduct] = useState(null);
  const [packaging, setPackaging] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(route.params.id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    }
  };

  const fetchPackagings = async () => {
    try {
      const response = await getPackagings({product: route.params.id});
      setPackaging(response.data?.[0]);
    } catch (error) {
      console.error('Error fetching packaging:', error);
      setPackaging(null);
    }
  };

  const handleQuantityPress = async quantity => {
    try {
      await createPurchaseOrderItem({
        product: route.params.id,
        purchaseOrder: sharedData.purchaseOrderId,
        packaging: packaging?._id,
        quantity,
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert('Failed to add item', `Error message: ${e.message}`, [
        {text: 'OK'},
      ]);
    }
  };

  const handleDonePress = () => {
    navigation.navigate('Home');
  };

  const handleCancelPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    fetchProduct();
    fetchPackagings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Image source={{uri: product?.image}} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Product Name:</Text>
          <Text style={styles.productInfoValue}>{product?.name}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Pack Size:</Text>
          <Text style={styles.productInfoValue}>
            {packaging?.quantity || 'N/A'}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Code:</Text>
          <Text style={styles.productInfoValue}>{product?.sku}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Barcode:</Text>
          <Text style={styles.productInfoValue}>{product?.barcode}</Text>
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

      <View style={styles.buttonGroup}>
        <Button label={'Done'} onPress={handleDonePress} />
        <Button label={'Cancel'} onPress={handleCancelPress} />
      </View>
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
    width: '80%',
    aspectRatio: 1,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  productInfo: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  productInfoLabel: {
    width: '30%',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  productInfoValue: {
    flexGrow: 1,
    fontSize: 18,
    flex: 1,
  },
  productContainer: {
    rowGap: 20,
  },
  quantityButton: {
    width: 60,
    paddingHorizontal: 10,
    aspectRatio: 1,
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
});

export default ProductScreen;
