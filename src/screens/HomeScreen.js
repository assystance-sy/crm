import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';

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
      <Button
        onPress={handleStoresPress}
        label={'Stores'}
        style={styles.button}
      />
      <Button
        onPress={handleNewOrderPress}
        label={'New Order'}
        style={styles.button}
      />
      <Button
        onPress={handleViewOrdersPress}
        label={'View Orders'}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    rowGap: 50,
  },
  button: {
    paddingVertical: 40,
  },
});

export default HomeScreen;
