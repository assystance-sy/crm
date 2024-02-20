import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {getStores} from '../services/apiServices/storeApiService';

const StoreScreen = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStoreList();
  }, []);

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

  const renderStoreItem = ({item}) => {
    const {merchant, address, code, staff} = item;
    const {street, city, province, postalCode} = address;
    return (
      <View style={styles.storeItem}>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>MERCHANT:</Text>
          <Text style={styles.storeListItemValue}>{merchant.name}</Text>
        </View>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>STORE ID:</Text>
          <Text style={styles.storeListItemValue}>{code}</Text>
        </View>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>ADDRESS:</Text>
          <Text
            style={
              styles.storeListItemValue
            }>{`${street}, ${city.name}, ${province.abbreviation}, ${postalCode}`}</Text>
        </View>
        {staff.map(storeStaff => {
          return (
            <>
              <View style={styles.storeListItem}>
                <Text style={styles.storeListItemLabel}>MANAGER:</Text>
                <Text style={styles.storeListItemValue}>
                  {storeStaff.firstName}
                </Text>
              </View>
              <View style={styles.storeListItem}>
                <Text style={styles.storeListItemLabel}>PHONE:</Text>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.storeList}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.buttonText}>Add</Text>
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
  storeListItem: {
    flexDirection: 'row',
  },
  storeListItemLabel: {
    width: '25%',
    fontSize: 24,
  },
  storeListItemValue: {
    flexGrow: 1,
    fontSize: 24,
    flex: 1,
  },
  storeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  addButton: {
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

export default StoreScreen;
