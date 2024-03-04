import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ItemScreen from '../screens/ItemScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import EditItemScreen from '../screens/EditItemScreen';
import OrderItemsScreen from '../screens/OrderItemsScreen';

const Stack = createNativeStackNavigator();

function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stores" component={StoresScreen} />
        <Stack.Screen name="New Order" component={NewOrderScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Store Details" component={StoreDetailsScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="Order Details" component={OrderDetailsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Edit Item" component={EditItemScreen} />
        <Stack.Screen name="Order Items" component={OrderItemsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
