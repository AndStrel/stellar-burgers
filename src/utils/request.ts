// // 1 раз объявляем базовый урл
// export const BASE_URL = 'https://norma.nomoreparties.space/api/';

// // создаем функцию проверки ответа на `ok`
// const checkResponse = (res) => {
//   if (res.ok) {
//     return res.json();
//   }
//   // не забываем выкидывать ошибку, чтобы она попала в `catch`
//   return Promise.reject(`Ошибка ${res.status}`);
// };

// // создаем функцию проверки на `success`
// const checkSuccess = (res) => {
//   if (res && res.success) {
//     return res;
//   }
//   // не забываем выкидывать ошибку, чтобы она попала в `catch`
//   return Promise.reject(`Ответ не success: ${res}`);
// };

// // создаем универсальную фукнцию запроса с проверкой ответа и `success`
// // В вызов приходит `endpoint`(часть урла, которая идет после базового) и опции
// const request = (endpoint: string, options?: RequestInit) =>
//   // а также в ней базовый урл сразу прописывается, чтобы не дублировать в каждом запросе
//   fetch(`${BASE_URL}${endpoint}`, options)
//     .then(checkResponse)
//     .then(checkSuccess);
