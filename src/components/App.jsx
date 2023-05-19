import React, { useState, useEffect } from "react";

import { sendMessage, ReceiveMessage, getUserStatus } from "../Utils/GreenAPI";
import "./App.scss";
import Header from "./Header/Header";
import Login from "./Login/Login";
import Chat from "./Chat/Chat";

function App() {
  // Хранит текущий номер телефона
  const [phoneNumber, setPhoneNumber] = useState("");
  // Хранит информацию о состоянии авторизации пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Хранит исходящее сообщение, которое пользователь ввел
  const [outMessage, setOutMessage] = useState("");
  // Хранит массив сообщений, которые отображаются в диалоговом окне
  const [messages, setMessages] = useState([]);
  // Хранит состояние активности кнопки отправки сообщения
  const [isButtonActive, setIsButtonActive] = useState(false);
  // Хранит имя отправителя сообщения
  const [senderName, setSenderName] = useState("");

  // Логика авторизации: если инстанс статус authorized, то открываем чат.
  const handleLogin = async (data) => {
    // Очистим хранилище после прошлой сессии
    localStorage.clear();
    // Приведение номера к формату ********@c.us и сохранение всех данных в localStorage
    localStorage.setItem(
      "phoneNumber",
      data.phoneNumber.replace("+", "") + "@c.us"
    );
    localStorage.setItem("idInstance", data.idInstance);
    localStorage.setItem("apiTokenInstance", data.apiTokenInstance);
    try {
      // Проверяем статус инстанса
      const response = await getUserStatus("getStateInstance");
      const stateInstance = response.stateInstance;
      if (stateInstance === "authorized") {
        setIsLoggedIn(true);
        // Установка номера в состояние phoneNumber
        setPhoneNumber(data.phoneNumber);
      }
    } catch (error) {
      console.error("Ошибка при выполнении функции getUserStatus:", error);
    }
  };

  // Логика исходящих сообщений
  const handleSendMessage = () => {
    // Отправляем запрос
    sendMessage(outMessage, "SendMessage")
      .then(() => {
        // Обработка успешного ответа от API
        setMessages([...messages, { text: outMessage, type: "out" }]); // Добавляем новое сообщение в массив messages
        setOutMessage(""); // Очищаем поле ввода
      })
      .catch((error) => {
        console.error("Ошибка при отправке сообщения:", error);
      });
  };

  // Нажмем Enter для отправки
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      setIsButtonActive(true);
      setTimeout(() => {
        setIsButtonActive(false);
        handleSendMessage();
      }, 200);
    }
  };

  // Логика входящих сообшений (используем pending для сохранения очередности ответов)
  let isRequestPending = false;

  function handleReceiveMessage() {
    if (!isRequestPending) {
      isRequestPending = true;
      ReceiveMessage("ReceiveNotification")
        .then((data) => {
          if (!data) {
            isRequestPending = false;
            return;
          }
          // Извлекаем сообщение и имя отправителя
          const message = data.textMessage;
          const senderName = data.senderName;
          setSenderName(senderName);
          // Используем функцию обновления состояния для гарантии последовательного добавления сообщений
          // Вызов setReceivedMessages будет выполнен после получения нового сообщения
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, type: "in" },
          ]);
        })
        .catch((error) => {
          isRequestPending = false;
          console.error("Ошибка при получении сообщения:", error);
        })
        .finally(() => {
          isRequestPending = false;
        });
    }
  }

  // Запускаем запрос на наличие уведомлений каждые 5 секунд
  useEffect(() => {
    // Проверяем наличие значений в localStorage
    if (isLoggedIn === true) {
      const intervalId = setInterval(handleReceiveMessage, 5000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <Header phoneNumber={phoneNumber} senderName={senderName} />
      {isLoggedIn ? (
        <Chat
          outMessage={outMessage}
          messages={messages}
          isButtonActive={isButtonActive}
          onOutMessageChange={(e) => setOutMessage(e.target.value)}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      ) : (
        <Login onSubmit={handleLogin} />
      )}
    </div>
  );
}

export default App;
