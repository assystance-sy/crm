import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DateTime} from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  const handleOrderPress = order => {
    navigation.navigate('Order Details', {order});
  };

  const fetchOrders = async () => {
    const data = await AsyncStorage.getItem('orders');
    if (data === null) {
      setOrders([]);
    } else {
      setOrders(
        JSON.parse(data).sort(
          (a, b) =>
            DateTime.fromISO(b.createdAt) - DateTime.fromISO(a.createdAt),
        ),
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({item}) => {
    const {items = [], store = {}, orderNumber, createdAt} = item || {};
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => handleOrderPress(item)}>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Order Number:</Text>
          <Text style={styles.orderListItemValue}>{orderNumber}</Text>
        </View>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Merchant:</Text>
          <Text style={styles.orderListItemValue}>{store.merchant}</Text>
        </View>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Store:</Text>
          <Text
            style={
              styles.orderListItemValue
            }>{`${store?.name} - #${store?.code}`}</Text>
        </View>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Created At:</Text>
          <Text style={styles.orderListItemValue}>
            {DateTime.fromISO(createdAt).toFormat('dd/MM/yyyy HH:mm')}
          </Text>
        </View>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>No. of Items:</Text>
          <Text style={styles.orderListItemValue}>{items.length}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.orderNumber}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  orderList: {
    flexGrow: 1,
    marginBottom: 20,
  },
  orderListItem: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  orderListItemLabel: {
    width: '35%',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderListItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
  },
  orderItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default OrdersScreen;
