import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';

const StoreDetailsScreen = ({route, navigation}) => {
  const {store} = route.params;
  const {merchant, address, code, staffs = [], remark, location} = store || {};
  const {street, city, province, postalCode} = address || {};
  const {coordinates} = location || {};
  const [lng, lat] = coordinates || [];

  const handleAddressPress = () => {
    const fullAddress = `${street}, ${city}, ${province}, ${postalCode}`;
    const scheme = Platform.select({
      ios: `maps://${lat},${lng}?q=${fullAddress}`,
      android: `geo:${lat},${lng}?q=${fullAddress}`,
    });
    Linking.openURL(scheme);
  };

  const handlePhoneNumberPress = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.store}>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Merchant:</Text>
          <Text style={styles.storeItemValue}>{merchant}</Text>
        </View>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Store ID:</Text>
          <Text style={styles.storeItemValue}>{code}</Text>
        </View>
        <View style={styles.storeItem}>
          <Text style={styles.storeItemLabel}>Address:</Text>
          <TouchableOpacity onPress={handleAddressPress} style={{flex: 1}}>
            <Text style={{...styles.storeItemValue, flex: 0}}>
              {`${street}, ${city}, ${province}, ${postalCode}`}
            </Text>
          </TouchableOpacity>
        </View>
        {staffs.map((storeStaff, index) => {
          return (
            <View key={index}>
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
                    style={{flex: 1}}
                    onPress={() => handlePhoneNumberPress(phone)}>
                    <Text style={styles.storeItemValue}>{phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
        {/*<View style={styles.storeItem}>*/}
        {/*  <Text style={styles.storeItemLabel}>Remark:</Text>*/}
        {/*  <Text style={styles.storeItemValue}>{remark}</Text>*/}
        {/*</View>*/}
      </View>
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
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000000',
  },
  storeItemValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  store: {
    paddingVertical: 10,
    rowGap: 10,
  },
});

export default StoreDetailsScreen;
