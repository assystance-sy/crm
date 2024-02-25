import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../assets/images';
import React from 'react';

const ProductList = props => {
  const {items = [], handleItemPress = () => {}} = props;

  return (
    <ScrollView
      contentContainerStyle={styles.productListContentContainer}
      style={styles.productListContainer}>
      {items.map(product => {
        return (
          <TouchableOpacity
            style={styles.productContainer}
            key={product.sku}
            onPress={() => handleItemPress(product)}>
            <Image source={images[product.image]} style={styles.productImage} />
            <View style={styles.productInfoContainer}>
              <View style={styles.product}>
                <Text style={styles.productLabel}>Name:</Text>
                <Text style={styles.productValue}>{product?.name}</Text>
              </View>
              <View style={styles.product}>
                <Text style={styles.productLabel}>Code:</Text>
                <Text style={styles.productValue}>{product?.sku}</Text>
              </View>
              <View style={styles.product}>
                <Text style={styles.productLabel}>Barcode:</Text>
                <Text style={styles.productValue}>{product?.barcode}</Text>
              </View>
              <View style={styles.product}>
                <Text style={styles.productLabel}>Pack Size:</Text>
                <Text style={styles.productValue}>{product?.packSize}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      {items.length === 0 && (
        <Text style={styles.noProduct}>No Item Found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  },
  productValue: {
    flexGrow: 1,
    fontSize: 14,
    flex: 1,
  },
  productContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  productListContentContainer: {},
  productListContainer: {
    marginTop: 20,
  },
  buttonGroup: {
    rowGap: 20,
  },
  textInput: {
    borderWidth: 1,
  },
  productInfoContainer: {
    flex: 1,
  },
  noProduct: {
    textAlign: 'center',
  },
});
export default ProductList;
