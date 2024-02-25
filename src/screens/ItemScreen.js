import React, {useContext} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import images from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const product = route.params.product;

  const handleQuantityPress = async quantity => {
    try {
      let orders = await AsyncStorage.getItem('orders');
      if (orders === null) {
        Alert.alert('Order not found', '', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);

        return;
      }

      orders = JSON.parse(orders);
      const index = orders.findIndex(
        o => o.orderNumber === sharedData.purchaseOrderNumber,
      );
      if (index === -1) {
        Alert.alert('Order not found', '', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);

        return;
      }

      const order = orders[index];
      order.items.push({...product, quantity});
      orders[index] = order;
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      navigation.navigate('Scanner');
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

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Image source={images[product.image]} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Product Name:</Text>
          <Text style={styles.productInfoValue}>{product?.name}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productInfoLabel}>Pack Size:</Text>
          <Text style={styles.productInfoValue}>
            {product?.packSize || 'N/A'}
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

export default ItemScreen;
