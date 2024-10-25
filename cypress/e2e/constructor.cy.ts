describe('проверяем доступность страницы конструктора бургера', function () {
  // перед выполнением каждого теста сначала делаем перехват запроса на эндпоинт 'api/,
  // в ответе на который возвращаются созданные ранее моковые данные.
  beforeEach(() => {
    // перехват запросов на эндпоинт и замена на моковые данные
    cy.intercept('GET', `**/api/ingredients`, {
      fixture: 'ingredients.json'
    });
    cy.intercept('POST', `**/api/orders`, {
      fixture: 'postOrders.json'
    });
    cy.intercept('GET', `**/api/auth/user`, {
      fixture: 'getUser.json'
    });
    cy.intercept('POST', `**/api/auth/login`, {
      fixture: 'login.json'
    });
    cy.intercept('POST', `**/api/auth/logout`, {
      fixture: 'logout.json'
    });

    // запускаем  с главной страницы
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    // Очищаем localStorage и куки
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });

    cy.clearCookie('accessToken');
  });

  it('проверяем добавление ингредиента из списка в конструктор', function () {
    // находим кнопку по классу "common_button" и проверяем, что появилось 3 кнопки
    cy.get('.common_button').should('have.length', 3);

    // нажимаем на первую кнопку добавления ингредиента
    cy.get('.common_button').first().click();

    // Находим элемент конструктора и проверяем, что  появился текст 'Пробная булка №1'
    cy.get(`.constructor-element__text`).contains(`Пробная булка №1`);

    // нажимаем на последнюю кнопку добавления ингредиента
    cy.get('.common_button').last().click();

    // находим элемент конструктора и проверяем, что  появился текст 'Пробный соус №3'
    cy.get(`[class=constructor-element__text]`).contains(`Пробный соус №3`);
  });

  it('проверяем работу модальных окон', function () {
    // находим первый ингредиент и нажимаем на него
    cy.get(`.J2V21wcp5ddf6wQCcqXv`).first().click();

    // проверяем, что появилось модальное окно
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('exist');

    // нажимаем на кнопку закрытия модального окна
    cy.get(`.Z7mUFPBZScxutAKTLKHN`).click();

    // проверяем, что модалка закрылась
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('not.exist');

    // находим второй ингредиент и нажимаем на него
    cy.get(`.J2V21wcp5ddf6wQCcqXv`).eq(1).click();

    // проверяем, что появилось модальное окно
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('exist');

    // проверяем что появился оверлей
    cy.get(`.RuQycGaRTQNbnIEC5d3Y`).should('exist');

    // нажимаем на оверлей
    cy.get(`.RuQycGaRTQNbnIEC5d3Y`).click({ force: true });

    // проверяем, что модалка закрылась
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('not.exist');

    // находим второй ингредиент и нажимаем на него
    cy.get(`.J2V21wcp5ddf6wQCcqXv`).eq(2).click();

    // проверяем, что появилось модальное окно
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('exist');

    // Нажимаем клавишу Esc
    cy.get('body').trigger('keydown', { key: 'Escape' });

    // проверяем, что модалка закрылась
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('not.exist');
  });

  it('проверяем создание заказа с фековыми токенами', function () {
    // Устанавливаем фейковые токены в localStorage и куки
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    });
    cy.setCookie('accessToken', 'fakeAccessToken');
    // добавляем ингредиенты
    cy.get('.common_button').eq(0).click();
    cy.get('.common_button').eq(1).click();
    cy.get('.common_button').eq(2).click();

    // находим и нажимаем на кнопку создания заказа
    cy.get('.button_size_large').click();

    // проверяем, что появилось модальное окно
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('exist');

    // Нажимаем клавишу Esc
    cy.get('body').trigger('keydown', { key: 'Escape' });

    // проверяем, что модалка закрылась
    cy.get(`.xqsNTMuGR8DdWtMkOGiM`).should('not.exist');

    //проверяем что конструктор пустой
    cy.get(`.zsm0TegHwEKtU2E2I4R9 `).contains(0);
  });

  it('проверяем login и logout', function () {
    // // находим и нажимаем на кнопку личного кабинета
    cy.get('.EthV0Sfz22gpFO0doxic').eq(2).click();

    // Проверка переадресации на страницу авторизации
    cy.url().should('include', '/login');

    // находим кнопку "Войти" и нажимаем на нее
    cy.get('.button_size_medium').click();

    // Проверка переадресации на профиля
    cy.url().should('include', '/profile');

    // // находим и нажимаем на кнопку выхода
    cy.get('button').contains('Выход').click();
  });
});
