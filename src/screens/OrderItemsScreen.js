import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {DateTime} from 'luxon';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import images from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';

const OrderItemsScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [items, setItems] = useState([]);
  const [displayMode, setDisplayMode] = useState('detail');

  const fetchOrder = async () => {
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

      setItems(orders[index]?.items);
    } catch (e) {
      ToastAndroid.show('Failed to fetch items', ToastAndroid.SHORT);
      navigation.goBack();
    }
  };

  const handleOrderItemPress = product => {
    navigation.push('Edit Item', {product});
  };

  const handleAddPress = () => {
    navigation.navigate('Scanner');
  };

  const handleSortingPress = sortBy => {
    const newList = items
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
      .map((p, index) => ({...p, key: index}));
    setItems(newList);
  };

  const renderOrderItem = ({item}) => {
    const {image, name, sku, barcodes, packSizes, quantity, createdAt, brand} =
      item || {};
    return (
      <TouchableOpacity
        style={styles.productContainer}
        key={sku}
        onPress={() => handleOrderItemPress(item)}>
        <FastImage
          source={images[image]}
          style={styles.productImage}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.productInfoContainer}>
          {displayMode === 'detail' && (
            <View style={styles.product}>
              <Text style={styles.productLabel}>Name:</Text>
              <Text style={styles.productValue}>{name}</Text>
            </View>
          )}
          {displayMode === 'detail' && (
            <View style={styles.product}>
              <Text style={styles.productLabel}>Brand:</Text>
              <Text style={styles.productValue}>{brand}</Text>
            </View>
          )}
          <View style={styles.product}>
            <Text style={styles.productLabel}>Code:</Text>
            <Text style={styles.productValue}>{sku}</Text>
          </View>
          {displayMode === 'detail' && (
            <View style={styles.product}>
              <Text style={styles.productLabel}>Barcode:</Text>
              <Text style={styles.productValue}>{barcodes.join(', ')}</Text>
            </View>
          )}
          {displayMode === 'detail' && (
            <View style={styles.product}>
              <Text style={styles.productLabel}>Pack Size:</Text>
              <Text style={styles.productValue}>{packSizes.join(', ')}</Text>
            </View>
          )}
          <View style={styles.product}>
            <Text style={styles.productLabel}>Quantity:</Text>
            <Text style={styles.productValue}>{quantity}</Text>
          </View>
          {displayMode === 'detail' && (
            <View style={styles.product}>
              <Text style={styles.productLabel}>Created At:</Text>
              <Text style={styles.productValue}>
                {DateTime.fromISO(createdAt).toFormat('dd/MM/yyyy HH:mm')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Sort By:</Text>
        <View style={styles.sortingButtonGroup}>
          <Button
            label={'Created At'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => handleSortingPress('createdAt')}
          />
          <Button
            label={'Code'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => handleSortingPress('sku')}
          />
        </View>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Display mode:</Text>
        <View style={styles.sortingButtonGroup}>
          <Button
            label={'Detail'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => setDisplayMode('detail')}
          />
          <Button
            label={'Minimal'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => setDisplayMode('minimal')}
          />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderOrderItem}
        keyExtractor={item => item.sku}
        contentContainerStyle={styles.productListContainer}
        maxToRenderPerBatch={10}
      />

      <Button
        label={'Add Item'}
        onPress={handleAddPress}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    padding: 5,
    flexDirection: 'row',
    columnGap: 10,
  },
  productListContentContainer: {},
  productListContainer: {
    paddingVertical: 20,
    rowGap: 10,
  },
  productInfoContainer: {
    flex: 1,
  },
  noProduct: {
    textAlign: 'center',
    color: '#000000',
  },
  buttonGroup: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    marginTop: 10,
    width: '30%',
    paddingHorizontal: 10,
  },
  sortingButtonGroup: {
    flexDirection: 'row',
    columnGap: 5,
  },
  sortingButton: {
    paddingHorizontal: 10,
    width: 'fit-content',
    paddingVertical: 5,
  },
});

export default OrderItemsScreen;
