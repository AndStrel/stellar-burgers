import { getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IUserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IUserOrdersState = {
  orders: [],
  isLoading: true,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error';
      });
  }
});

export default userOrdersSlice.reducer;
