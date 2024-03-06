import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  SectionList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DateTime} from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataContext from '../services/DataContext';
import Button from '../components/Button';
import {Dirs, FileSystem} from 'react-native-file-access';

const OrdersScreen = () => {
  const {updateSharedData} = useContext(DataContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const exportOrder = async order => {
    try {
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
      const fileName = `${order.orderNumber}_#${order.store.code}.csv`;
      const filePath = `${Dirs.DocumentDir}/${fileName}`;

      await FileSystem.writeFile(filePath, csv, 'utf8');

      await FileSystem.cpExternal(filePath, fileName, 'downloads');
    } catch (e) {
      ToastAndroid.show('Failed to export', ToastAndroid.SHORT);
    }
  };

  const handleExportPress = async date => {
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

      if (!granted) {
        return;
      }

      setIsLoading(true);

      const selectedOrders = orders.find(order => order.title === date).data;

      await Promise.all(selectedOrders.map(order => exportOrder(order)));

      ToastAndroid.show('Saved to /Download', ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show('Failed to export', ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
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
        style={styles.orderList}
        sections={orders}
        keyExtractor={item => item.orderNumber}
        renderItem={renderOrderItem}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>{title}</Text>
            <Button
              label={'Export'}
              style={styles.sectionTitleButton}
              buttonTextStyle={{fontSize: 14}}
              onPress={() => handleExportPress(title)}
            />
          </View>
        )}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  orderList: {
    paddingHorizontal: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleText: {
    color: '#000000',
  },
  sectionTitleButton: {
    paddingHorizontal: 10,
    width: 'fit-content',
  },
  loadingOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    opacity: 0.5,
    justifyContent: 'center',
  },
});

export default OrdersScreen;
