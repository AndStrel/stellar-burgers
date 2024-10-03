import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  removeIngredient,
  setBun
} from '../../slices/constructorItemsSlice';

export const BurgerConstructor: FC = () => {
  // берем состояние из стора
  const dispatch = useDispatch();
  // извлекаем состояние из стора (ингредиенты и булка)
  const { bun, ingredients } = useSelector((state) => state.constructorItems);
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const orderRequest = false;

  const orderModalData = null;

  // Добавление булки в конструктор
  const addBunToConstructor = (bun: TConstructorIngredient) => {
    dispatch(setBun(bun));
  };
  // Добавление ингредиента в конструктор
  const addIngredientToConstructor = (ingredient: TConstructorIngredient) => {
    dispatch(addIngredient(ingredient));
  };
  // Удаление ингредиента из конструктора
  const removeIngredientFromConstructor = (id: number) => {
    dispatch(removeIngredient(id));
  };

  // Кнопка "Оформить заказ"
  // должна быть активна, если в конструкторе есть булка и ингредиенты
  // при нажатии на нее открывается модальное окно с данными о заказе
  const onOrderClick = () => {
    console.log('Инфа о заказе', constructorItems);
    if (!constructorItems.bun || orderRequest) return;
  };

  // Закрытие модального окна
  const closeOrderModal = () => {
    // dispatch(setBun(null));
    // dispatch(clearConstructor());
  };

  // Подсчет общей стоимости
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
