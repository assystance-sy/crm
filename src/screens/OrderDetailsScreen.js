import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {getPurchaseOrder} from '../services/apiServices/purchaseOrderApiService';
import {getPurchaseOrderItems} from '../services/apiServices/purchaseOrderItemApiService';
import {DateTime} from 'luxon';

const OrderDetailsScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const {merchant, store, orderNumber, createdAt} = order || {};

  const fetchOrder = async () => {
    try {
      const response = await getPurchaseOrder(id, {
        populate: ['merchant', 'store'],
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrder({});
    }
  };

  const fetchOrderItems = async () => {
    try {
      const response = await getPurchaseOrderItems({
        purchaseOrder: id,
        populate: ['product', 'packaging'],
        limit: 99,
      });
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
      setOrderItems([]);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchOrderItems();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Order Number:</Text>
        <Text style={styles.orderItemValue}>{orderNumber}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Merchant:</Text>
        <Text style={styles.orderItemValue}>{merchant?.name}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Store:</Text>
        <Text
          style={
            styles.orderItemValue
          }>{`${store?.name} - #${store?.code}`}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Created At:</Text>
        <Text style={styles.orderItemValue}>
          {DateTime.fromISO(createdAt).toFormat('dd/MM/yyyy HH:mm')}
        </Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>No. of Items:</Text>
        <Text style={styles.orderItemValue}>{orderItems.length}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.orderItemListContentContainer}
        style={styles.orderItemListContainer}>
        {orderItems.map((orderItem, index) => {
          return (
            <View style={styles.orderItemContainer}>
              <Text style={styles.orderItemLabel}>{index + 1}</Text>
              <Image
                source={{uri: orderItem?.product?.image}}
                style={{width: 100, aspectRatio: 1, objectFit: 'contain'}}
              />
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Product Name:</Text>
                <Text style={styles.orderItemValue}>
                  {orderItem?.product?.name}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Product Code:</Text>
                <Text style={styles.orderItemValue}>
                  {orderItem?.product?.sku}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Product Barcode:</Text>
                <Text style={styles.orderItemValue}>
                  {orderItem?.product?.barcode}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Pack Size:</Text>
                <Text style={styles.orderItemValue}>
                  {orderItem?.packaging?.quantity}
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Quantity:</Text>
                <Text style={styles.orderItemValue}>{orderItem?.quantity}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  orderItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  orderItemLabel: {
    width: '35%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  orderItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
  },
  orderItemContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 20,
  },
  orderItemListContentContainer: {},
  orderItemListContainer: {
    marginTop: 20,
  },
});

export default OrderDetailsScreen;
