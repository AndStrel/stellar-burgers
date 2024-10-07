import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';
import { updateUserApi } from '../utils/burger-api';

interface IAuthState {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  error: null,
  isLoading: false
};

// асинхронные экшены
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await updateUserApi(userData);
      return user;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    // обработка при загрузке
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    // обработка при успешном получении данных
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    });
    // обработка при ошибке
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error';
    });
  }
});

export const { setUser, setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
