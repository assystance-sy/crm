import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Button from '../components/Button';
import products from '../database/products.json';
import images from '../assets/images';
import FastImage from 'react-native-fast-image';

const SearchScreen = ({route, navigation}) => {
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [barcode, setBarcode] = useState(route?.params?.barcode || '');
  const [name, setName] = useState('');

  const searchByBarcode = () => {
    const existingProducts = products.filter(p =>
      p.barcodes.some(b => b.includes(barcode)),
    );
    setMatchedProducts(existingProducts);
    setBarcode('');
  };

  const searchByName = () => {
    const existingProducts = products.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    );
    setMatchedProducts(existingProducts);
    setName('');
  };

  const handleProductPress = product => {
    navigation.push('Item', {product});
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderOrderItem = ({item}) => {
    const {image, name, sku, barcodes, packSizes} = item || {};
    return (
      <TouchableOpacity
        style={styles.productContainer}
        key={sku}
        onPress={() => handleProductPress(item)}>
        <FastImage
          source={images[image]}
          style={styles.productImage}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.productInfoContainer}>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Name:</Text>
            <Text style={styles.productValue}>{name}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Code:</Text>
            <Text style={styles.productValue}>{sku}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Barcode:</Text>
            <Text style={styles.productValue}>{barcodes.join(', ')}</Text>
          </View>
          <View style={styles.product}>
            <Text style={styles.productLabel}>Pack Size:</Text>
            <Text style={styles.productValue}>{packSizes.join(', ')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (route?.params?.barcode) {
      searchByBarcode();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.productLabel}>Barcode:</Text>
      <TextInput
        style={styles.textInput}
        value={barcode}
        onTextInput={() => setName('')}
        onChangeText={value => setBarcode(value)}
        onEndEditing={() => searchByBarcode()}
        keyboardType={'numeric'}
      />

      <Text style={styles.productLabel}>Name:</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onTextInput={() => setBarcode('')}
        onChangeText={value => setName(value)}
        onEndEditing={() => searchByName()}
      />

      <Text style={styles.productLabel}>Products:</Text>
      <FlatList
        data={matchedProducts}
        renderItem={renderOrderItem}
        keyExtractor={item => item.sku}
        contentContainerStyle={styles.productListContainer}
      />

      <Button label={'Back'} onPress={handleBackPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'space-between',
    rowGap: 10,
    height: '100%',
  },
  textInput: {
    borderWidth: 1,
    color: '#000000',
  },
  productImage: {
    width: 100,
    aspectRatio: '4/3',
    objectFit: 'contain',
    alignSelf: 'center',
  },
  product: {
    flexDirection: 'row',
  },
  productLabel: {
    width: '35%',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000000',
  },
  productValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
    color: '#000000',
  },
  productContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
  },
  productListContainer: {
    paddingBottom: 20,
    rowGap: 10,
    flexGrow: 1,
  },
  productInfoContainer: {
    flex: 1,
  },
});

export default SearchScreen;
