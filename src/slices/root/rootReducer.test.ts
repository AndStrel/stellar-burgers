import { expect, test, describe } from '@jest/globals';
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';

describe('Проверяем корректность работы rootReducer.', () => {
  test('Проверка корректного начального состояния при неизвестном экшене', () => {
    // вызываем rootReducer с undefined состоянием и неизвестным экшеном
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // получаем начальное состояние для всех редюсеров
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.constructorItems).toBeDefined();
    expect(initialState.ordersData).toBeDefined();
    expect(initialState.order).toBeDefined();
    expect(initialState.userOrders).toBeDefined();
    expect(initialState.auth).toBeDefined();
  });
  test('Проверяем правильную инициализацию rootReducer.', () => {
    //  создаем хранилище используя rootReducer как основный reducer
    const store = configureStore({ reducer: rootReducer });
    //  получаем состояние хранилища
    const state = store.getState();

    // проверяем наличие каждого ининциализируемого редюсера
    expect(state.ingredients).toBeDefined();
    expect(state.constructorItems).toBeDefined();
    expect(state.ordersData).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.userOrders).toBeDefined();
    expect(state.auth).toBeDefined();
  });
});
