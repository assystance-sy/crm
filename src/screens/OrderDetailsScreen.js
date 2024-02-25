import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {DateTime} from 'luxon';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import images from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const OrderDetailsScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [order, setOrder] = useState({});
  const isFocused = useIsFocused();

  const fetchOrder = async () => {
    try {
      let orders = await AsyncStorage.getItem('orders');
      if (orders === null) {
        Alert.alert('Order not found', '', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);

        return;
      }

      orders = JSON.parse(orders);
      const index = orders.findIndex(
        o => o.orderNumber === sharedData.purchaseOrderNumber,
      );
      if (index === -1) {
        Alert.alert('Order not found', '', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);

        return;
      }

      setOrder(orders[index]);
    } catch (e) {
      Alert.alert('Failed to remove item', `Error message: ${e.message}`, [
        {text: 'OK'},
      ]);
    }
  };

  const handleRemove = async () => {
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

      orders.splice(index, 1);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      navigation.goBack();
    } catch (e) {
      Alert.alert('Failed to remove order', `Error message: ${e.message}`, [
        {text: 'OK'},
      ]);
    }
  };

  const handleRemovePress = async () => {
    Alert.alert('Confirm?', '', [
      {text: 'OK', onPress: handleRemove},
      {text: 'Cancel'},
    ]);
  };

  const handleOrderItemPress = product => {
    navigation.push('Edit Item', {product});
  };

  const handleAddPress = () => {
    navigation.navigate('Scanner');
  };

  useEffect(() => {
    fetchOrder();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Order Number:</Text>
        <Text style={styles.orderItemValue}>{order.orderNumber}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Merchant:</Text>
        <Text style={styles.orderItemValue}>{order?.store?.merchant}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Store:</Text>
        <Text
          style={
            styles.orderItemValue
          }>{`${order?.store?.name} - #${order?.store?.code}`}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Created At:</Text>
        <Text style={styles.orderItemValue}>
          {DateTime.fromISO(order?.createdAt).toFormat('dd/MM/yyyy HH:mm')}
        </Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>No. of Items:</Text>
        <Text style={styles.orderItemValue}>{(order?.items || []).length}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.productListContentContainer}
        style={styles.productListContainer}>
        {(order?.items || []).map(product => {
          return (
            <TouchableOpacity
              style={styles.productContainer}
              key={product.sku}
              onPress={() => handleOrderItemPress(product)}>
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
                <View style={styles.product}>
                  <Text style={styles.productLabel}>Quantity:</Text>
                  <Text style={styles.productValue}>{product?.quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {(order?.items || []).length === 0 && (
          <Text style={styles.noProduct}>No Item Found</Text>
        )}
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button
          label={'Remove'}
          onPress={handleRemovePress}
          style={styles.button}
        />
        <Button label={'Add'} onPress={handleAddPress} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  orderItemLabel: {
    width: '35%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000000',
  },
  orderItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  productImage: {
    width: 100,
    aspectRatio: '4/3',
    objectFit: 'contain',
    alignSelf: 'center',
  },
  product: {
    flexDirection: 'row',
    rowGap: 10,
  },
  productLabel: {
    width: '35%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000000',
  },
  productValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
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
    color: '#000000',
  },
  buttonGroup: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: '45%',
    paddingHorizontal: 0,
  },
});

export default OrderDetailsScreen;
