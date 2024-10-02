import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../utils/types';

interface ConstructorItemsState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}
// начальное состояние
const initialState: ConstructorItemsState = {
  bun: null,
  ingredients: []
};

const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addIngredient, removeIngredient, setBun, clearConstructor } =
  constructorItemsSlice.actions;
export default constructorItemsSlice.reducer;
