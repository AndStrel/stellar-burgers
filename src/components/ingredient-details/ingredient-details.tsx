import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  // Получаем id ингредиента из URL
  const { id } = useParams();

  // Получаем список ингредиентов из стора
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  // Записываем данные ингредиента в переменную путем фильтрации по id
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  // Если ингредиент не найден, отображаем прелоадер
  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
