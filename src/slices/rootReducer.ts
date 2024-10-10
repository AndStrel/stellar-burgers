import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorItemsSlice from '../slices/constructorItemsSlice';
import orderSlice from './orderSlice';
import ordersDataSlice from './ordersDataSlice';
import userOrdersSlice from './userOrdersSlice';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice,
  ordersData: ordersDataSlice,
  order: orderSlice,
  userOrders: userOrdersSlice,
  auth: authSlice
});

export default rootReducer;
