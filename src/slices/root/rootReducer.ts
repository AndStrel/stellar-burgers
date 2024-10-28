import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../ingredients/ingredientsSlice';
import constructorItemsSlice from '../constructorItem/constructorItemsSlice';
import orderSlice from '../order/orderSlice';
import ordersDataSlice from '../ordersData/ordersDataSlice';
import userOrdersSlice from '../userOrders/userOrdersSlice';
import authSlice from '../auth/authSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice,
  ordersData: ordersDataSlice,
  order: orderSlice,
  userOrders: userOrdersSlice,
  auth: authSlice
});

export default rootReducer;
