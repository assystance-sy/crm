import * as React from 'react';
import {View, StyleSheet, Linking, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {useCallback, useEffect} from 'react';
import {Camera, useCameraPermission} from 'react-native-vision-camera';

function HomeScreen() {
  const navigation = useNavigation();
  const {hasPermission} = useCameraPermission();
  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const handleStoresPress = () => {
    navigation.navigate('Stores');
  };

  const handleNewOrderPress = () => {
    if (!hasPermission) {
      Alert.alert('Camera permission not granted', '', [
        {
          text: 'OK',
          onPress: async () => {
            await Linking.openSettings();
          },
        },
      ]);
      return;
    }
    navigation.navigate('New Order');
  };

  const handleViewOrdersPress = () => {
    navigation.navigate('Orders');
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

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
        label={'Orders'}
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
