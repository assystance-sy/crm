import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Button from '../components/Button';
import DataContext from '../services/DataContext';
import products from '../database/products.json';
import {useIsFocused} from '@react-navigation/native';

const ScannerScreen = ({route, navigation}) => {
  const {prevScreen} = route?.params || {};
  const {sharedData} = useContext(DataContext);
  const isFocused = useIsFocused();
  const {hasPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [cameraOn, setCameraOn] = useState(false);
  const [barcode, setBarcode] = useState('');
  const codeScanner = useCodeScanner({
    codeTypes: ['code-128', 'ean-13'],
    onCodeScanned: async codes => {
      if (cameraOn) {
        const code = codes[0].value;
        if (code) {
          setBarcode(code);
          setCameraOn(false);
        }
      }
    },
  });

  const fetchProduct = async code => {
    try {
      const matchedProducts = products.filter(p =>
        p.barcodes.some(b => b.includes(code)),
      );

      if (matchedProducts.length === 0) {
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

      setBarcode('');
      setCameraOn(false);

      if (matchedProducts.length === 1) {
        navigation.push('Item', {product: matchedProducts[0]});
      } else {
        navigation.push('Search', {barcode: code});
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const onScanPress = () => {
    setBarcode('');
    setCameraOn(true);
  };

  const onManualInputPress = () => {
    setBarcode('');
    setCameraOn(false);
    navigation.push('Search');
  };

  const onDonePress = () => {
    setCameraOn(false);

    if (prevScreen) {
      navigation.navigate(prevScreen);
    } else {
      navigation.popToTop();
    }
  };

  useEffect(() => {
    if (barcode && !cameraOn) {
      fetchProduct(barcode);
    }
  }, [barcode]);

  useEffect(() => {
    if (isFocused) {
      setBarcode('');
      setCameraOn(false);
    }
  }, [isFocused]);

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
            isActive={cameraOn && hasPermission && isFocused}
            codeScanner={codeScanner}
          />
        )}
      </View>

      <View style={styles.buttonGroup}>
        <Button label={'Scan'} onPress={onScanPress} />
        <Button label={'Manual Input'} onPress={onManualInputPress} />
        <Button label={'Done'} onPress={onDonePress} />
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
    gap: 10,
  },
  orderInfo: {
    textTransform: 'uppercase',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 40,
    color: '#000000',
  },
});

export default ScannerScreen;
