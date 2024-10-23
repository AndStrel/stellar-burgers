import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

jest.mock('../../utils/burger-api');

describe('Проверяем корректность работы ingredientsSlice.', () => {
  const testIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Пробный ништяк',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Второй ништяк',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];
  const store = configureStore({ reducer: ingredientsSlice });

  const testError = 'Тестовая ошибка';

  test('Проверяем правильную инициализацию ingredientsSlice.', () => {
    //  получаем состояние хранилища
    const state = store.getState();
    // проверяем наличие каждого ининциализируемого состояния
    expect(state.ingredients).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при запросе ингредиентов (pending)', () => {
    // диспатчим экшен получения ингредиентов
    store.dispatch(fetchIngredients());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.ingredients).toEqual([]);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Проверка состояния при успешном получении ингредиентов (fulfilled)', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(testIngredients);
    // диспатчим экшен получения ингредиентов
    await store.dispatch(fetchIngredients());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(testIngredients);
  });

  test('Проверка состояния при ошибке при получении ингредиентов (rejected)', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(testError);
    const store = configureStore({ reducer: ingredientsSlice });
    // диспатчим экшен получения ингредиентов
    await store.dispatch(fetchIngredients());
    // получаем состояние хранилища
    const state = store.getState();
    // проверяем все поля переданного объекта с ожидаемым
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(testError);
    expect(state.ingredients).toEqual([]);
  });
});
