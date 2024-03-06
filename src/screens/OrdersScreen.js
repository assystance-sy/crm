import React, {useContext, useEffect, useState} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DateTime} from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataContext from '../services/DataContext';

const OrdersScreen = () => {
  const {updateSharedData} = useContext(DataContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  const handleOrderPress = order => {
    updateSharedData({purchaseOrderNumber: order.orderNumber});
    navigation.navigate('Order Details');
  };

  function convertToSectionListFormat(data) {
    // Grouping the data by createdAt
    const groupedData = data.reduce((acc, item) => {
      const createdAtDate = new Date(item.createdAt).toLocaleDateString();
      if (!acc[createdAtDate]) {
        acc[createdAtDate] = [];
      }
      acc[createdAtDate].push(item);
      return acc;
    }, {});

    // Converting the grouped data into the format expected by SectionList
    return Object.keys(groupedData).map(date => ({
      title: date,
      data: groupedData[date],
    }));
  }

  const fetchOrders = async () => {
    const data = await AsyncStorage.getItem('orders');
    if (data === null) {
      setOrders([]);
    } else {
      const parsedData = convertToSectionListFormat(
        JSON.parse(data).sort(
          (a, b) =>
            DateTime.fromISO(b.createdAt) - DateTime.fromISO(a.createdAt),
        ),
      );
      setOrders(parsedData);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isFocused]);

  const renderOrderItem = ({item}) => {
    const {items = [], store = {}, orderNumber, createdAt} = item || {};
    return (
      <TouchableOpacity
        style={styles.orderItem}
        key={orderNumber}
        onPress={() => handleOrderPress(item)}>
        <View style={styles.orderListItem}>
          <Text style={styles.orderListItemLabel}>Order No.:</Text>
          <Text style={styles.orderListItemValue}>{orderNumber}</Text>
        </View>
        {/*<View style={styles.orderListItem}>*/}
        {/*  <Text style={styles.orderListItemLabel}>Merchant:</Text>*/}
        {/*  <Text style={styles.orderListItemValue}>{store.merchant}</Text>*/}
        {/*</View>*/}
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
            {DateTime.fromISO(createdAt).toFormat('HH:mm')}
          </Text>
        </View>
        {/*<View style={styles.orderListItem}>*/}
        {/*  <Text style={styles.orderListItemLabel}>No. of Items:</Text>*/}
        {/*  <Text style={styles.orderListItemValue}>{items.length}</Text>*/}
        {/*</View>*/}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={orders}
        keyExtractor={item => item.orderNumber}
        renderItem={renderOrderItem}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
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
  },
  orderListItemLabel: {
    width: '35%',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  orderListItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  orderItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  sectionTitle: {
    marginTop: 20,
    color: '#000000',
  },
});

export default OrdersScreen;
