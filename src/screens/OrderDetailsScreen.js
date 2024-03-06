import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  PermissionsAndroid,
  TextInput,
  ScrollView,
} from 'react-native';
import {DateTime} from 'luxon';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dirs, FileSystem} from 'react-native-file-access';

const OrderDetailsScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const [order, setOrder] = useState({});
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

      setOrder(orders[index]);
      setNotes(orders[index]?.notes || '');
    } catch (e) {
      ToastAndroid.show('Failed to fetch order', ToastAndroid.SHORT);
      navigation.goBack();
    }
  };

  const handleUpdateNotes = async () => {
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

      orders[index].notes = notes;
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      setIsEditing(false);
      ToastAndroid.show('Saved', ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show('Failed to update notes', ToastAndroid.SHORT);
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

      orders.splice(index, 1);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));

      navigation.goBack();
    } catch (e) {
      ToastAndroid.show('Failed to remove order', ToastAndroid.SHORT);
    }
  };

  const handleRemovePress = async () => {
    Alert.alert('Confirm?', '', [
      {text: 'OK', onPress: handleRemove},
      {text: 'Cancel'},
    ]);
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
        orderInfo.push(['Notes', order.notes].join(','));

        const headers = [
          'Name',
          'Brand',
          'Barcode',
          'Pack Size',
          'Code',
          'Quantity',
          '\n',
        ].join(',');

        const data = order.items
          .sort((a, b) => a.sku - b.sku)
          .map(item => {
            const {name, brand, sku, barcodes, packSizes, quantity} = item;
            return [
              name,
              brand,
              barcodes.join(' '),
              packSizes.join(' '),
              sku,
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

  const handleViewItemPress = () => {
    navigation.navigate('Order Items');
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemLabel}>Order Number:</Text>
          <Text style={styles.orderItemValue}>{order.orderNumber}</Text>
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
          <Text style={styles.orderItemValue}>
            {(order?.items || []).length}
          </Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemLabel}>Notes:</Text>
          <View style={styles.notesInput}>
            <TextInput
              style={styles.textInput}
              value={notes}
              onChangeText={value => setNotes(value)}
              multiline={true}
              editable={isEditing}
            />
            <View style={styles.notesButtonGroup}>
              <Button
                label={'Edit'}
                onPress={() => setIsEditing(true)}
                style={isEditing ? styles.disabledButton : styles.notesButton}
                disabled={isEditing}
              />
              <Button
                label={'Save'}
                onPress={handleUpdateNotes}
                style={isEditing ? styles.notesButton : styles.disabledButton}
                disabled={!isEditing}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button
          label={'View Items'}
          onPress={handleViewItemPress}
          style={styles.button}
        />
        <Button
          label={'Add Item'}
          onPress={handleAddPress}
          style={styles.button}
        />
        <Button
          label={'Remove Order'}
          onPress={handleRemovePress}
          style={styles.button}
        />
        <Button
          label={'Export Order'}
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
    flexWrap: 'wrap',
    rowGap: 10,
  },
  button: {
    width: '45%',
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
  textInput: {
    borderWidth: 1,
    color: '#000000',
  },
  notesInput: {
    flexGrow: 1,
    rowGap: 10,
  },
  notesButtonGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    columnGap: 10,
  },
  notesButton: {
    width: '30%',
    paddingHorizontal: 10,
  },
  disabledButton: {
    width: '30%',
    paddingHorizontal: 10,
    opacity: 0.2,
  },
});

export default OrderDetailsScreen;
