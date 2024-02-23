import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {createPurchaseOrder} from '../services/apiServices/purchaseOrderApiService';
import {getMerchants} from '../services/apiServices/merchantApiService';
import {getStores} from '../services/apiServices/storeApiService';
import {useNavigation} from '@react-navigation/native';
import Picker from '../components/Picker';
import Button from '../components/Button';

const NewOrderScreen = () => {
  const navigation = useNavigation();
  const [merchants, setMerchants] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const fetchMerchants = async () => {
    try {
      const response = await getMerchants();
      setMerchants(response.data);
    } catch (error) {
      console.error('Error fetching merchant:', error);
      setMerchants([]);
    }
  };

  const fetchStores = async (query = {}) => {
    try {
      const response = await getStores({
        page: 1,
        limit: 99,
        sort: 'code',
        ...query,
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching store:', error);
      setStores([]);
    }
  };

  const handleNextPress = async () => {
    try {
      if (!selectedStoreId) {
        Alert.alert('No store selected', 'Please select a store', [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      }

      const {data} = await createPurchaseOrder({
        merchant: stores.find(store => store._id === selectedStoreId).merchant,
        store: selectedStoreId,
      });

      const {_id: purchaseOrderId} = data || {};

      navigation.navigate('Scanner', {purchaseOrderId});
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  useEffect(() => {
    fetchMerchants();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchStores({merchant: selectedMerchantId});
  }, [selectedMerchantId]);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          label={'Merchant:'}
          onValueChange={value => setSelectedMerchantId(value)}
          items={merchants.map(merchant => ({
            label: merchant?.name,
            value: merchant?._id,
          }))}
          placeholder={{label: 'Select a merchant', value: null}}
        />

        <Picker
          label={'Store:'}
          onValueChange={value => setSelectedStoreId(value)}
          items={stores.map(store => ({
            label: `${store?.name} - #${store?.code}`,
            value: store?._id,
          }))}
          placeholder={{label: 'Select a store', value: null}}
          style={styles.pickerStyle}
        />
      </View>

      <Button onPress={handleNextPress} label={'Next'} />
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
    rowGap: 50,
  },
});

export default NewOrderScreen;
