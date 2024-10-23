import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '../../utils/types';

interface IConstructorItemsState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  price: number;
}
// начальное состояние
const initialState: IConstructorItemsState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  price: 0
};

const constructorItemsSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    // редюсер для добавления ингредиента в конструктор
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (state.ingredients.length < 6) {
        state.ingredients.push(action.payload);
      }
    },
    // редюсер для удаления ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    // редюсер для добавления булки в конструктор
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    // редюсер для перемещения ингредиента вниз
    moveDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const ingredient = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = ingredient;
      }
    },
    // редюсер для перемещения ингредиента вверх
    moveUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const ingredient = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = ingredient;
      }
    },
    // редюсер для установки состояния загрузки заказа в стор (для отображения в модалке)
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    // редюсер для установки информации о заказе в стор (для отображения в модалке)
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    // редюсер для установки цены
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    // редюсер для очистки конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setOrderModalData,
  setPrice,
  setBun,
  clearConstructor,
  moveDown,
  moveUp
} = constructorItemsSlice.actions;
export default constructorItemsSlice.reducer;
