import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

const initialState: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null as string | null
};

export const fetchOrders = createAsyncThunk(
  'ordersData/fetchOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);
export const fetchOrderById = createAsyncThunk(
  'ordersData/fetchOrderById',
  async (orderId: string) => {
    const response = await getOrderByNumberApi(Number(orderId));
    return response.orders[0]; // Возвращаем один заказ
  }
);

export const ordersDataSlice = createSlice({
  name: 'ordersData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;

          // Проверяем, есть ли уже такой заказ в списке
          const existingOrderIndex = state.orders.findIndex(
            (order) => order._id === action.payload._id
          );

          // Если такой заказ уже есть, обновляем его
          // Если нет, добавляем новый
          if (existingOrderIndex !== -1) {
            state.orders[existingOrderIndex] = action.payload;
          } else {
            state.orders.push(action.payload);
          }
        }
      )
      .addCase(fetchOrderById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default ordersDataSlice.reducer;
