import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorItemsSlice from '../slices/constructorItemsSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorItemsSlice
});

export default rootReducer;
