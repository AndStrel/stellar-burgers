import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorItemsSlice from '../slices/constructorItemsSlice';
import orderSlice from './orderSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice,
  order: orderSlice,
  user: userSlice
});

export default rootReducer;
