import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getPurchaseOrders} from '../services/apiServices/purchaseOrderApiService';
import {DateTime} from 'luxon';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  const handleOrderPress = id => {
    navigation.navigate('Order Details', {id});
  };

  const renderOrderItem = ({item}) => {
    const {merchant, store, orderNumber, _id, createdAt} = item;
    return (
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => handleOrderPress(_id)}>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Order Number:</Text>
          <Text style={styles.orderListItemValue}>{orderNumber}</Text>
        </View>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Merchant:</Text>
          <Text style={styles.orderListItemValue}>{merchant?.name}</Text>
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
      </TouchableOpacity>
    );
  };

  const fetchPurchaseOrderList = async () => {
    try {
      const response = await getPurchaseOrders({
        populate: ['merchant', 'store'],
        limit: 999,
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order list:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderList();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id.toString()}
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
    paddingTop: 20,
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
