// Данные, сохраненный при авторизации пользователя
const idInstance = localStorage.getItem("idInstance");
const apiTokenInstance = localStorage.getItem("apiTokenInstance");
const chatId = localStorage.getItem("phoneNumber");

// Адрес для запросов
const URL = (idInstance, apiTokenInstance, action) => {
  return `https://api.green-api.com/waInstance${idInstance}/${action}/${apiTokenInstance}`;
};

// Проверяем статус авторизации на console.green-api.com
export async function getUserStatus(action) {
  try {
    const response = await fetch(URL(idInstance, apiTokenInstance, action));
    const responseData = await response.json();
    if (responseData.stateInstance) {
      return responseData;
    } else {
      throw new Error("Invalid response from server.");
    }
  } catch (error) {
    throw new Error(`Error during getUserStatus function: ${error}`);
  }
}

// Отправка сообщения
export async function sendMessage(outMessage, action) {
  /////////////////////// может быть ошибка!!!
  try {
    const response = await fetch(URL(idInstance, apiTokenInstance, action), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatId,
        message: outMessage,
      }),
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки");
    }
  } catch (error) {
    console.error("Ошибка отправки:", error);
  }
}

// Получение уведомления (сообщения)
export async function ReceiveMessage(action) {
  let responseData;
  try {
    const response = await fetch(URL(idInstance, apiTokenInstance, action));
    if (!response.ok) {
      throw new Error("Ошибка запроса на получение уведомлений");
    }
    responseData = await response.json(); // Сохраняем responseData
    // Если есть флаг входящего сообщения, то извлекаем данные.
    if (
      responseData &&
      responseData.body.typeWebhook === "incomingMessageReceived"
    ) {
      const textMessage =
        responseData.body.messageData?.textMessageData?.textMessage;
      const sender = responseData.body.senderData?.sender;
      const senderName = responseData.body.senderData?.senderName;
      // Если сообщение от того, с кем ведется диалог.
      if (sender === chatId) {
        // Возвращаем объект с текстом сообщения, отправителем и именем отправителя
        return { textMessage, sender, senderName };
      }
    }
    // Если флага нет, ничего не делаем
    return;
  } catch (error) {
    console.error("Ошибка ReceiveMessage:", error);
  } finally {
    // В конце, если уведомление сушествует, то удаляем его на сервере.
    if (responseData) {
      const receiptId = responseData.receiptId;
      await DeleteNotification(idInstance, apiTokenInstance, receiptId);
    }
  }
}

// Удаленине уведомления
async function DeleteNotification(idInstance, apiTokenInstance, receiptId) {
  try {
    const deleteUrl = `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка запроса на удаление уведомления");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
}
