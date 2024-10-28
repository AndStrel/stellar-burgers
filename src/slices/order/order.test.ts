import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderSlice, { sendOrder, clearOrder, initialState } from './orderSlice';
import { TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы orderSlice.', () => {
  const testOrder: TOrder = {
    _id: '643d69a5c3f7b9001cfa0940',
    ingredients: ['643d69a5c3f7b9001cfa093e', '643d69a5c3f7b9001cfa0941'],
    status: 'done',
    name: 'Пробный хаказ',
    createdAt: '2022-12-12T13:33:05.000Z',
    updatedAt: '2022-12-12T13:33:05.000Z',
    number: 123456
  };
  const testOrderIngridients = [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ];
  const testError = 'Тестовая ошибка';

  const store = configureStore({ reducer: orderSlice });

  test('Проверяем правильную инициализацию orderSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при отправке заказа (pending)', () => {
    const actualState = orderSlice(
      initialState,
      sendOrder.pending('', testOrderIngridients)
    );
    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('Проверка состояния при успешной отправке заказа (fulfilled)', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue({ order: testOrder });
    const actualState = orderSlice(
      initialState,
      sendOrder.fulfilled(testOrder, '', testOrderIngridients)
    );
    expect(actualState).toEqual({
      ...initialState,
      order: testOrder,
      isLoading: false,
      error: null
    });
  });

  test('Проверка состояния при ошибке при отправке заказа (rejected)', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue({ order: testOrder });
    const actualState = orderSlice(
      initialState,
      sendOrder.rejected(new Error(testError), '', testOrderIngridients)
    );
    expect(actualState).toEqual({
      ...initialState,
      order: null,
      isLoading: false,
      error: testError
    });
  });
});
