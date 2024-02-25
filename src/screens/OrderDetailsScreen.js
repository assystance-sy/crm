import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DateTime} from 'luxon';
import ProductList from '../components/ProductList';

const OrderDetailsScreen = ({route, navigation}) => {
  const {order} = route.params;
  const {store = {}, orderNumber, createdAt, items = []} = order || {};

  const handleOrderItemPress = product => {
    navigation.push('Edit Item', {orderNumber, product});
  };

  return (
    <View style={styles.container}>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Order Number:</Text>
        <Text style={styles.orderItemValue}>{orderNumber}</Text>
      </View>
      <View style={styles.orderItem}>
        <Text style={styles.orderItemLabel}>Merchant:</Text>
        <Text style={styles.orderItemValue}>{store.merchant}</Text>
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
        <Text style={styles.orderItemValue}>{items.length}</Text>
      </View>

      <ProductList items={items} handleItemPress={handleOrderItemPress} />
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
});

export default OrderDetailsScreen;
