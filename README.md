# [WhatsApp Web App](https://tanovik.github.io/greenapi-whatsapp/) | Frontend

### 📜 Описание:

Одностраничное мини-приложение на `React.js` для обмена сообщениями из браузера с пользователями WhatsApp. <br />

### 📲 Как пользоватся:

-   Зарегистрировавться на https://green-api.com/ для получения данных для авторизации (`idInstance` и `apiTokenInstance`) и привязки вашего номера WhatsApp.
-   Разрешить в настройказ аккаунта получать уведомления о входящих сообщениях и файлах.
-   Авторизоваться в приложении. Чат откроется автоматически. Имя или номер телефона собеседника будет отображен в правом верхнем углу.


### ⚙️ Функционал:

-   Single Page Application на Create React App в рамках одной страницы без перезагрузок.

-   Отправка сообщений реализована методом https://green-api.com/docs/api/sending/SendMessage/

-   Получение сообщений реализовано методом https://green-api.com/docs/api/receiving/technology-http-api/

-   Для формы авторизации использовал React Hook Form с валидацией.

### 🥞 Стек:

`HTML5` `CSS3` `JavaScript ES6+` `React v.19` `Create React App` `Webpack` `PostCSS` `ESLint` `Prettier` `БЭМ (Nested)`

### 💽 Установка и запуск:

1. Склонировать репозиторий в текущую папку:

`git clone https://github.com/tanovik/greenapi-whatsapp.git/`


2. Установить зависимости:

`npm install`

3. Запустить проект в режиме разработки:

`npm run start`
<br />
<br />
<img src="src/images/demo_chat.png" alt="demo chat" width="400">
<br />
<br />
<img src="src/images/demo_auth.png" alt="demo auth" width="400">