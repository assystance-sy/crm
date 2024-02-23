import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {getStores} from '../services/apiServices/storeApiService';
import {useNavigation} from '@react-navigation/native';

const StoreScreen = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);

  const handleStorePress = id => {
    navigation.navigate('Store Details', {id});
  };

  const renderStoreItem = ({item}) => {
    const {merchant, address, code, staff, _id} = item;
    const {street, city, province, postalCode} = address;
    return (
      <TouchableOpacity
        style={styles.storeItem}
        onPress={() => handleStorePress(_id)}>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>Merchant:</Text>
          <Text style={styles.storeListItemValue}>{merchant.name}</Text>
        </View>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>Store Id:</Text>
          <Text style={styles.storeListItemValue}>{code}</Text>
        </View>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>Address:</Text>
          <Text
            style={
              styles.storeListItemValue
            }>{`${street}, ${city.name}, ${province.abbreviation}, ${postalCode}`}</Text>
        </View>
        {staff.map(storeStaff => {
          return (
            <>
              <View style={styles.storeListItem}>
                <Text style={styles.storeListItemLabel}>Manager:</Text>
                <Text style={styles.storeListItemValue}>
                  {storeStaff.firstName}
                </Text>
              </View>
              <View style={styles.storeListItem}>
                <Text style={styles.storeListItemLabel}>Phone:</Text>
                <View>
                  {storeStaff.phones?.map(phone => (
                    <Text style={styles.storeListItemValue}>
                      {phone.number}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          );
        })}
      </TouchableOpacity>
    );
  };

  const fetchStoreList = async () => {
    try {
      const response = await getStores({
        page: 1,
        limit: 99,
        sort: 'code',
        populate: ['merchant', 'address.city', 'address.province', 'staff'],
      });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching store list:', error);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchStoreList();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.storeList}
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
  storeList: {
    flexGrow: 1,
    marginBottom: 20,
  },
  storeListItem: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  storeListItemLabel: {
    width: '35%',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  storeListItemValue: {
    flexGrow: 1,
    fontSize: 18,
    flex: 1,
  },
  storeItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default StoreScreen;
