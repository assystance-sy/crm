import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Linking, Alert} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {getProducts} from '../services/apiServices/productApiService';
import Button from '../components/Button';

const ScannerScreen = ({route, navigation}) => {
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
      const response = await getProducts({barcode: code});
      const matchedProduct = response.data?.[0];

      if (!matchedProduct) {
        Alert.alert(
          'No product found',
          `No product matches with barcode ${code}`,
          [
            {text: 'Try again', onPress: onScanPress},
            {text: 'Manual Input', onPress: onManualInputPress},
          ],
        );

        return;
      }

      navigation.navigate('Product', {
        id: matchedProduct?._id,
        purchaseOrderId: route.params.purchaseOrderId,
      });
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

  const onScanPress = async () => {
    await requestCameraPermission();
    setCameraOn(true);
  };

  const onManualInputPress = async () => {
    navigation.navigate('New Product', {
      purchaseOrderId: route.params.purchaseOrderId,
    });
  };

  useEffect(() => {
    if (barcode) {
      setCameraOn(false);
      fetchProduct(barcode);
    }
  }, [barcode]);

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          style={styles.camera}
          device={device}
          isActive={cameraOn}
          codeScanner={codeScanner}
        />
      )}

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
    top: 50,
    width: '90%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  productContainer: {},
  buttonGroup: {
    flexDirection: 'column',
    gap: 20,
  },
});

export default ScannerScreen;
