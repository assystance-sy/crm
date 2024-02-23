import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import ViewOrdersScreen from '../screens/ViewOrdersScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ProductScreen from '../screens/ProductScreen';

const Stack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stores" component={StoresScreen} />
        <Stack.Screen name="New Order" component={NewOrderScreen} />
        <Stack.Screen name="View Orders" component={ViewOrdersScreen} />
        <Stack.Screen name="Store Details" component={StoreDetailsScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
