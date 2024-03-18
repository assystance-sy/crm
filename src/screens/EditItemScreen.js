import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Button from '../components/Button';
import images from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataContext from '../services/DataContext';
import Picker from '../components/Picker';

const EditItemScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const {product} = route.params;
  const [status, setStatus] = useState('inStock');

  const handleQuantityPress = async quantity => {
    try {
      let orders = await AsyncStorage.getItem('orders');
      if (orders === null) {
        ToastAndroid.show('Order not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      orders = JSON.parse(orders);
      const index = orders.findIndex(
        o => o.orderNumber === sharedData.purchaseOrderNumber,
      );
      if (index === -1) {
        ToastAndroid.show('Order not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      const order = orders[index];
      const itemIndex = order.items.findIndex(i => i.sku === product.sku);
      if (itemIndex === -1) {
        ToastAndroid.show('Item not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      order.items[itemIndex].quantity = quantity;
      orders[index] = order;
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      ToastAndroid.show('Updated', ToastAndroid.SHORT);

      navigation.goBack();
    } catch (e) {
      ToastAndroid.show('Failed to update item', ToastAndroid.SHORT);
    }
  };

  const handleRemove = async () => {
    try {
      let orders = await AsyncStorage.getItem('orders');
      if (orders === null) {
        ToastAndroid.show('Order not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      orders = JSON.parse(orders);
      const index = orders.findIndex(
        o => o.orderNumber === sharedData.purchaseOrderNumber,
      );
      if (index === -1) {
        ToastAndroid.show('Order not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      const order = orders[index];
      const itemIndex = order.items.findIndex(i => i.sku === product.sku);
      if (itemIndex === -1) {
        ToastAndroid.show('Item not found', ToastAndroid.SHORT);
        navigation.goBack();
        return;
      }

      order.items.splice(itemIndex, 1);
      orders[index] = order;
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      ToastAndroid.show('Removed', ToastAndroid.SHORT);

      navigation.goBack();
    } catch (e) {
      ToastAndroid.show('Failed to remove item', ToastAndroid.SHORT);
    }
  };

  const handleRemovePress = async () => {
    Alert.alert('Confirm?', '', [
      {text: 'OK', onPress: handleRemove},
      {text: 'Cancel'},
    ]);
  };

  const handleCancelPress = () => {
    navigation.goBack();
  };

  const handleStatusChange = async newStatus => {
    try {
      let products = await AsyncStorage.getItem('products');
      if (products === null) {
        products = '[]';
      }

      products = JSON.parse(products);
      const index = products.findIndex(o => o.sku === product.sku);
      if (index === -1) {
        products.push({sku: product.sku, status: newStatus});
      } else {
        products[index].status = newStatus;
      }

      await AsyncStorage.setItem('products', JSON.stringify(products));
    } catch (e) {
      ToastAndroid.show('Failed to update item', ToastAndroid.SHORT);
    }
  };

  const checkIsOutOfStock = async () => {
    try {
      let products = await AsyncStorage.getItem('products');
      if (products === null) {
        products = '[]';
      }

      products = JSON.parse(products);
      const index = products.findIndex(o => o.sku === product.sku);
      if (index === -1) {
        setStatus('inStock');
      } else {
        setStatus(products[index].status);
      }
    } catch (e) {
      ToastAndroid.show('Failed to get product status', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    checkIsOutOfStock();
  }, [product]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.productContainer}>
        <Image source={images[product.image]} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Product Name:</Text>
          <Text style={styles.productInfoValue}>{product?.name}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Pack Size:</Text>
          <Text style={styles.productInfoValue}>
            {product?.packSizes.join(', ')}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Code:</Text>
          <Text style={styles.productInfoValue}>{product?.sku}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Barcode:</Text>
          <Text style={styles.productInfoValue}>
            {product?.barcodes.join(', ')}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Quantity:</Text>
          <View style={styles.quantityButtonGroup}>
            {[1, 2, 3, 4, 5].map(number => (
              <Button
                key={number}
                label={number.toString()}
                onPress={() => handleQuantityPress(number)}
                style={styles.quantityButton}
              />
            ))}
          </View>
        </View>
        <View style={{...styles.productInfo, alignItems: 'center'}}>
          <Text style={styles.productInfoLabel}>Status:</Text>
          <View style={{flex: 1}}>
            <Picker
              onValueChange={value => handleStatusChange(value)}
              items={[
                {label: 'In Stock', value: 'inStock'},
                {label: 'Out Of Stock', value: 'outOfStock'},
              ]}
              value={status}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button label={'Remove'} onPress={handleRemovePress} />
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
    height: '50%',
    aspectRatio: '4/3',
    objectFit: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
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
    color: '#000000',
  },
  productInfoValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  productContainer: {},
  quantityButton: {
    width: 45,
    paddingHorizontal: 0,
    aspectRatio: 1,
  },
  quantityButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    flex: 1,
    flexGrow: 1,
  },
  buttonGroup: {
    rowGap: 10,
  },
});

export default EditItemScreen;
