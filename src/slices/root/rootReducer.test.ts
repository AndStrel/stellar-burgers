import { expect, test, describe } from '@jest/globals';
import rootReducer from './rootReducer';
import { initialState as ingredientsInitialState } from '../ingredients/ingredientsSlice';
import { initialState as constructorItemsInitialState } from '../constructorItem/constructorItemsSlice';
import { initialState as ordersDataInitialState } from '../order/orderSlice';
import { initialState as orderInitialState } from '../ordersData/ordersDataSlice';
import { initialState as userOrdersInitialState } from '../userOrders/userOrdersSlice';
import { initialState as authInitialState } from '../auth/authSlice';

describe('Проверяем корректность работы rootReducer.', () => {
  test('Проверка корректного начального состояния при неизвестном экшене', () => {
    // вызываем rootReducer с undefined состоянием и неизвестным экшеном

    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // получаем начальное состояние для всех редюсеров
    expect(initialState.ingredients).toEqual(ingredientsInitialState);
    expect(initialState.constructorItems).toEqual(constructorItemsInitialState);
    expect(initialState.ordersData).toEqual(orderInitialState);
    expect(initialState.order).toEqual(ordersDataInitialState);
    expect(initialState.userOrders).toEqual(userOrdersInitialState);
    expect(initialState.auth).toEqual(authInitialState);
  });
  // test('Проверяем правильную инициализацию rootReducer.', () => {
  //   //  создаем хранилище используя rootReducer как основный reducer
  //   const store = configureStore({ reducer: rootReducer });
  //   //  получаем состояние хранилища
  //   const state = store.getState();

  //   // проверяем наличие каждого ининциализируемого редюсера
  //   expect(state.ingredients).toBeDefined();
  //   expect(state.constructorItems).toBeDefined();
  //   expect(state.ordersData).toBeDefined();
  //   expect(state.order).toBeDefined();
  //   expect(state.userOrders).toBeDefined();
  //   expect(state.auth).toBeDefined();
  // });
});
