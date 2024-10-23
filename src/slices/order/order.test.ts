import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderSlice, { sendOrder, clearOrder } from './orderSlice';
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
    // диспатчим экшен получения заказа
    store.dispatch(sendOrder(testOrderIngridients));
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с начальными
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешной отправке заказа (fulfilled)', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue({ order: testOrder });
    // диспатчим экшен получения заказа
    await store.dispatch(sendOrder(testOrderIngridients));
    // получаем состояние хранилища
    let state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.order).toEqual(testOrder);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();

    // очищаем хранилище
    store.dispatch(clearOrder());
    // получаем актуальное состояние хранилища
    state = store.getState();
    //   реальность / ожидание
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при ошибке при отправке заказа (rejected)', async () => {
    (orderBurgerApi as jest.Mock).mockRejectedValue(testError);
    // обновляем хранилище
    const store = configureStore({ reducer: orderSlice });
    // диспатчим экшен получения заказа
    await store.dispatch(sendOrder(testOrderIngridients));
    // получаем состояние хранилища
    const state = store.getState();
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    // проверяем что в хранилище записана ошибка
    expect(state.error).toEqual(testError);
  });
});
