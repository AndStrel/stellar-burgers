import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface IOrderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // обработка при загрузке
    getOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // обработка при успешном получении данных
    getOrdersSuccess: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
    },
    getOrdersFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { getOrdersRequest, getOrdersSuccess, getOrdersFailed } =
  orderSlice.actions;

export default orderSlice.reducer;
