import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorItemsSlice from '../slices/constructorItemsSlice';
import orderSlice from './orderSlice';
import ordersDataSlice from './ordersDataSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice,
  ordersData: ordersDataSlice,
  order: orderSlice,
  user: userSlice
});

export default rootReducer;
