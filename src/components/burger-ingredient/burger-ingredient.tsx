import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient, setBun } from '../../slices/constructorItemsSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      // создаем уникальный id из id ингредиента и даты создания
      const uniqueId = `${ingredient._id}-${Date.now()}`;
      // создаем объект с данными ингредиента и уникальным id (в соответствии с типом ингредиента)
      const ingredientWithId = {
        ...ingredient,
        id: uniqueId // Используем _id как уникальный id для конструктора
      };
      // проверяем если это булка то передаем в конструктор в раздел булки
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredientWithId));
        return;
      }
      dispatch(addIngredient(ingredientWithId));
    };
    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
