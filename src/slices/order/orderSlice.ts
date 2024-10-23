import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';

// Начальное состояние для заказа
const initialState = {
  order: null as TOrder | null,
  isLoading: false,
  error: null as string | null
};

// Thunk для отправки заказа на сервер
export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (orderIngredients: string[]) => {
    const response = await orderBurgerApi(orderIngredients);
    return response.order; // Вернуть данные о заказе, если запрос успешен
  }
);

// Слайс для заказа
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Очистить информацию о заказе
    clearOrder(state) {
      state.order = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // включаем загрузчик при отправке заказа
      .addCase(sendOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      //при успешной отправке заказа записываем данные
      //о заказе полученые с сервера в стор
      .addCase(sendOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      //при ошибке отправки заказа записываем ошибку в стор
      .addCase(sendOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Экспорт действий и редюсера
export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
