import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ToastAndroid,
  PermissionsAndroid,
  Share,
} from 'react-native';
import {DateTime} from 'luxon';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import images from '../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {Dirs, FileSystem} from 'react-native-file-access';

const OrderDetailsScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [order, setOrder] = useState({});
  const [items, setItems] = useState([]);
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
      setItems(orders[index]?.items);
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

  const handleExportPress = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Require Permission For Writing To External Storage',
          message:
            'Need to access your external storage in order to export the order.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const orderInfo = [];
        orderInfo.push(['Order Number', order.orderNumber].join(','));
        orderInfo.push(['Merchant', order.store.merchant].join(','));
        orderInfo.push(
          ['Store', `${order.store.name} - #${order.store.code}`].join(','),
        );
        orderInfo.push(
          [
            'Created At',
            DateTime.fromISO(order.createdAt).toFormat('dd/MM/yyyy HH:mm'),
          ].join(','),
        );

        const headers = [
          'Name',
          'Brand',
          'Code',
          'Barcode',
          'Pack Size',
          'Quantity',
          '\n',
        ].join(',');

        const data = items
          .map(item => {
            const {name, brand, sku, barcodes, packSizes, quantity} = item;
            return [
              name,
              brand,
              sku,
              barcodes.join(' '),
              packSizes.join(' '),
              quantity,
            ].join(',');
          })
          .join('\n');

        const csv = `${orderInfo.join('\n')}\n\n${headers}${data}`;
        const fileName = `${order.orderNumber}.csv`;
        const filePath = `${Dirs.DocumentDir}/${fileName}`;

        await FileSystem.writeFile(filePath, csv, 'utf8');

        await FileSystem.cpExternal(filePath, fileName, 'downloads');

        ToastAndroid.show(`Saved to /Download/${fileName}`, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e.message);
    }
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
          <View style={styles.product}>
            <Text style={styles.productLabel}>Name:</Text>
            <Text style={styles.productValue}>{name}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Brand:</Text>
            <Text style={styles.productValue}>{brand}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Code:</Text>
            <Text style={styles.productValue}>{sku}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Barcode:</Text>
            <Text style={styles.productValue}>{barcodes.join(', ')}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Pack Size:</Text>
            <Text style={styles.productValue}>{packSizes.join(', ')}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Quantity:</Text>
            <Text style={styles.productValue}>{quantity}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Created At:</Text>
            <Text style={styles.productValue}>
              {DateTime.fromISO(createdAt).toFormat('dd/MM/yyyy HH:mm')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
            label={'Brand'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => handleSortingPress('brand')}
          />
          <Button
            label={'Code'}
            style={styles.sortingButton}
            buttonTextStyle={{fontSize: 14}}
            onPress={() => handleSortingPress('sku')}
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

      <View style={styles.buttonGroup}>
        <Button
          label={'Remove'}
          onPress={handleRemovePress}
          style={styles.button}
        />
        <Button label={'Add'} onPress={handleAddPress} style={styles.button} />
        <Button
          label={'Export'}
          onPress={handleExportPress}
          style={styles.button}
        />
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
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
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

export default OrderDetailsScreen;
