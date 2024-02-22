import * as React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  const handleStoresPress = () => {
    navigation.navigate('Stores');
  };

  const handleNewOrderPress = () => {
    navigation.navigate('New Order');
  };

  const handleViewOrdersPress = () => {
    navigation.navigate('View Orders');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleStoresPress}>
        <Text style={styles.buttonText}>Stores</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNewOrderPress}>
        <Text style={styles.buttonText}>New Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleViewOrdersPress}>
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#cccccc',
    padding: 40,
    marginVertical: 30,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
