import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearOrder, sendOrder } from '../../slices/orderSlice';
import {
  clearConstructor,
  setOrderModalData,
  setOrderRequest
} from '../../slices/constructorItemsSlice';
// import { addOrder } from '../../slices/ordersDataSlice';

export const BurgerConstructor: FC = () => {
  // берем состояние из стора
  const dispatch = useDispatch();
  // извлекаем состояние из стора (ингредиенты и булка)
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.constructorItems
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };
  const onOrderClick = async () => {
    // если нет булки или заказ уже отправляется, то ничего не делаем
    if (!constructorItems.bun || orderRequest) return;

    // если булка есть и заказ ещё не отправлялся
    // создаем массив ингредиентов состоящий из ид булки и ид ингредиентов для отправки на сервер
    const orderIngredients = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];

    // устанавливаем состояние загрузки
    dispatch(setOrderRequest(true));

    // отправляем заказ на сервер
    try {
      const response = await dispatch(sendOrder(orderIngredients)).unwrap();

      // устанавливаем состояние модального окна
      dispatch(setOrderModalData(response));

      // добавляем данные о заказе в стор
      // dispatch(addOrder(response));

      // очищаем конструктор
      dispatch(clearConstructor());

      // закрываем модальное окно через 5 секунд
      setTimeout(() => {
        closeOrderModal();
      }, 5000);
    } catch (error) {
      console.log('Ошибка при отправке заказа:', error);
    } finally {
      // устанавливаем состояние загрузки
      dispatch(setOrderRequest(false));
    }
  };

  // Закрытие модального окна
  const closeOrderModal = () => {
    dispatch(clearOrder()); // сбросить данные заказа
    dispatch(setOrderModalData(null)); // закрыть модалку
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
