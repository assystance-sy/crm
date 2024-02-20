import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import {getStore} from '../services/apiServices/storeApiService';

const StoreDetailsScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [store, setStore] = useState([]);
  const {merchant, address, code, staff = [], remark, location} = store || {};
  const {street, city, province, postalCode} = address || {};
  const {coordinates} = location || {};
  const [lng, lat] = coordinates || [];

  const handleAddressPress = () => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = merchant?.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const handlePhoneNumberPress = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const fetchStore = async () => {
    try {
      const response = await getStore(id, {
        populate: ['merchant', 'address.city', 'address.province', 'staff'],
      });
      setStore(response.data);
    } catch (error) {
      console.error('Error fetching store:', error);
      setStore({});
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.store}>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Merchant:</Text>
          <Text style={styles.storeItemValue}>{merchant?.name}</Text>
        </View>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Store ID:</Text>
          <Text style={styles.storeItemValue}>{code}</Text>
        </View>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Address:</Text>
          <TouchableOpacity onPress={handleAddressPress} style={{flex: 1}}>
            <Text style={{...styles.storeItemValue, flex: 0}}>
              {`${street}, ${city?.name}, ${province?.abbreviation}, ${postalCode}`}
            </Text>
          </TouchableOpacity>
        </View>
        {staff.map(storeStaff => {
          return (
            <>
              <View style={styles.storeItem}>
                <Text style={styles.storeItemLabel}>Manager:</Text>
                <Text style={styles.storeItemValue}>
                  {storeStaff?.firstName}
                </Text>
              </View>
              <View style={styles.storeItem}>
                <Text style={styles.storeItemLabel}>Phone:</Text>
                {storeStaff.phones?.map(phone => (
                  <TouchableOpacity
                    onPress={() => handlePhoneNumberPress(phone?.number)}>
                    <Text style={styles.storeItemValue}>{phone?.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          );
        })}
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Remark:</Text>
          <Text style={styles.storeItemValue}>{remark}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
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
  storeList: {
    flexGrow: 1,
    marginBottom: 20,
  },
  storeItem: {
    flexDirection: 'row',
  },
  storeItemLabel: {
    width: '25%',
    fontSize: 24,
    textTransform: 'uppercase',
  },
  storeItemValue: {
    flexGrow: 1,
    fontSize: 24,
    flex: 1,
  },
  store: {
    paddingVertical: 10,
    rowGap: 30,
  },
  editButton: {
    backgroundColor: '#cccccc',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    padding: 40,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});

export default StoreDetailsScreen;
