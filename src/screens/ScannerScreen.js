import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Linking, Alert, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import products from '../database/products.json';

const ScannerScreen = ({route, navigation}) => {
  const {sharedData} = useContext(DataContext);
  const device = useCameraDevice('back');
  const [cameraOn, setCameraOn] = useState(false);
  const [barcode, setBarcode] = useState('');
  const codeScanner = useCodeScanner({
    codeTypes: ['code-128', 'ean-13'],
    onCodeScanned: async codes => {
      const code = codes[0].value;
      setBarcode(code);
    },
  });

  const fetchProduct = async code => {
    try {
      const matchedProduct = products.find(p => p.barcode === code);

      if (!matchedProduct) {
        Alert.alert(
          'No product found',
          `No product matches with barcode ${code}`,
          [
            {text: 'Try again', onPress: onScanPress},
            {text: 'Manual Input', onPress: () => onManualInputPress(code)},
          ],
        );

        return;
      }

      setBarcode('');
      setCameraOn(false);

      navigation.push('Product', {product: matchedProduct});
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  const onScanPress = () => {
    setBarcode('');
    setCameraOn(true);
  };

  const onManualInputPress = code => {
    setBarcode('');
    setCameraOn(false);
    navigation.push('New Product', {code});
  };

  useEffect(() => {
    if (barcode) {
      setCameraOn(false);
      fetchProduct(barcode);
    }
  }, [barcode]);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={
            styles.orderInfo
          }>{`Order Number: ${sharedData.purchaseOrderNumber}`}</Text>

        {device && (
          <Camera
            style={styles.camera}
            device={device}
            isActive={cameraOn}
            codeScanner={codeScanner}
          />
        )}
      </View>

      <View style={styles.buttonGroup}>
        <Button label={'Scan'} onPress={onScanPress} />
        <Button label={'Manual Input'} onPress={onManualInputPress} />
      </View>
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
  camera: {
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 20,
  },
  orderInfo: {
    textTransform: 'uppercase',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 40,
  },
});

export default ScannerScreen;
