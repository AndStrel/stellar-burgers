import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../utils/types';

interface IUserState {
  user: TUser;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: IUserState = {
  user: {
    email: '',
    name: ''
  },
  isLoading: false,
  error: null,
  isLoggedIn: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // обработка при загрузке
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isLoggedIn = true;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = {
        email: '',
        name: ''
      };
      state.isLoggedIn = false;
    }
  }
});

export const { loginRequest, loginSuccess, loginFailed, logout } =
  userSlice.actions;
export default userSlice.reducer;
