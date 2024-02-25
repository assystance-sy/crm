import React, {useContext, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Picker from '../components/Picker';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import merchants from '../database/merchants.json';
import stores from '../database/stores.json';
import {DateTime} from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewOrderScreen = () => {
  const {updateSharedData} = useContext(DataContext);
  const navigation = useNavigation();
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const createPurchaseOrder = async () => {
    const orders = await AsyncStorage.getItem('orders');
    const orderCount = orders === null ? 0 : JSON.parse(orders).length;
    const currentDate = DateTime.local().toFormat('yyyyMMdd');
    const orderNumber = `PO${currentDate}${orderCount
      .toString()
      .padStart(3, '0')}`;

    if (orders === null) {
      await AsyncStorage.setItem(
        'orders',
        JSON.stringify([
          {
            orderNumber,
            storeCode: selectedStore,
            items: [],
          },
        ]),
      );
    } else {
      await AsyncStorage.setItem(
        'orders',
        JSON.parse(orders).concat([
          {
            orderNumber,
            storeCode: selectedStore,
            items: [],
          },
        ]),
      );
    }
  };

  const handleCreatePress = async () => {
    try {
      if (!selectedStore) {
        Alert.alert('No store selected', 'Please select a store', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      const orderNumber = await createPurchaseOrder(selectedStore);

      updateSharedData({purchaseOrderNumber: orderNumber});

      navigation.push('Scanner');
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          label={'Merchant:'}
          onValueChange={value => setSelectedMerchant(value)}
          items={merchants.map(merchant => ({
            label: merchant?.name,
            value: merchant?.name,
          }))}
          placeholder={{label: 'Select a merchant', value: null}}
        />

        <Picker
          label={'Store:'}
          onValueChange={value => setSelectedStore(value)}
          items={stores
            .filter(store =>
              selectedMerchant ? store.merchant === selectedMerchant : true,
            )
            .sort((a, b) => a.code - b.code)
            .map(store => ({
              label: `${store?.name} - #${store?.code}`,
              value: store?.code,
            }))}
          placeholder={{label: 'Select a store', value: null}}
        />
      </View>

      <Button onPress={handleCreatePress} label={'Create'} />
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
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default NewOrderScreen;
