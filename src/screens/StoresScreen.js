import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import stores from '../database/stores.json';

const StoreScreen = () => {
  const navigation = useNavigation();

  const handleStorePress = code => {
    const store = stores.find(s => s.code === code);
    navigation.navigate('Store Details', {store});
  };

  const renderStoreItem = ({item}) => {
    const {merchant, address, code, staffs = []} = item;
    const {street, city, province, postalCode} = address;
    return (
      <TouchableOpacity
        style={styles.storeItem}
        key={code}
        onPress={() => handleStorePress(code)}>
        <View style={styles.storeListItem}>
          <Text style={styles.storeListItemLabel}>Merchant:</Text>
          <Text style={styles.storeListItemValue}>{merchant}</Text>
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
            }>{`${street}, ${city}, ${province}, ${postalCode}`}</Text>
        </View>
        {staffs.map((storeStaff, index) => {
          return (
            <View key={index}>
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
                    <Text key={phone} style={styles.storeListItemValue}>
                      {phone}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={item => item.code}
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
    width: '25%',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  storeListItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  storeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default StoreScreen;
