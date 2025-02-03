import React, { useState, useEffect } from 'react'

import {
    sendMessage,
    ReceiveMessage,
    getStateInstance,
    getMyAvatar,
    getContactInfo,
    getSettings,
} from '../Utils/GreenAPI'
import './App.scss'
import Header from './Header/Header'
import Login from './Login/Login'
import Chat from './Chat/Chat'

function App() {
    // Хранит номер телефона собесендика
    const [phoneNumber, setPhoneNumber] = useState('')
    // Хранит информацию о состоянии авторизации пользователя
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // Хранит исходящее сообщение, которое пользователь ввел
    const [outMessage, setOutMessage] = useState('')
    // Хранит массив сообщений, которые отображаются в диалоговом окне
    const [messages, setMessages] = useState([])
    // Хранит состояние активности кнопки отправки сообщения
    const [isButtonActive, setIsButtonActive] = useState(false)
    // Хранит имя отправителя сообщения
    const [senderName, setSenderName] = useState('')
    // Храним URL аватара собеседника
    const [contactAvatarUrl, setContactAvatarUrl] = useState()
    // Храним URL своего аватара.
    const [myAvatarUrl, setMyAvatarUrl] = useState()

    // Логика авторизации: если инстанс статус authorized, то открываем чат.
    const handleLogin = async (data) => {
        // Приведение номера к формату ********@c.us и сохранение данных в localStorage
        localStorage.setItem(
            'phoneNumber',
            data.phoneNumber.replace('+', '') + '@c.us',
        )
        localStorage.setItem('idInstance', data.idInstance)
        localStorage.setItem('apiTokenInstance', data.apiTokenInstance)
        try {
            // Проверяем статус инстанса
            const response = await getStateInstance('getStateInstance')
            if (response.stateInstance === 'authorized') {
                // Установим состояние авторизации в true
                setIsLoggedIn(true)
                // Установка номера в состояние phoneNumber
                setPhoneNumber(data.phoneNumber)
                // Получаем информацию о контакте
                const { name, avatar } = await getContactInfo('getContactInfo')
                // Устанавливаем полученное URL аватара собеседника в contactAvatarUrl
                setContactAvatarUrl(avatar)
                // Устанавливаем полученное имя собеседника в senderName (оно уходит в хедер)
                setSenderName(name)
                // Выполняем запрос для получения ownerID
                const { wid: ownerId } = await getSettings('getSettings')
                // Записываем ownerId в localStorage
                localStorage.setItem('ownerId', ownerId)
                // Устанавливаем полученный адрес аватара собеседника в состояние myAvatarUrl
                setMyAvatarUrl(await getMyAvatar('GetAvatar'))
            }
        } catch (error) {
            console.error(
                'Ошибка при выполнении функции getStateInstance:',
                error,
            )
        }
    }

    // Логика отправки сообщения
    const handleSendMessage = async () => {
        // Проверяем, что сообщение не пустое
        if (!outMessage.trim()) {
            return // Если пустое, просто выходим из функции
        }
        try {
            await sendMessage(outMessage, 'SendMessage') // Отправляем сообщенине.
                .then(() => {
                    // Добавляем новое сообщение в массив messages и передаем ссылку на аватар из состояния myAvatarUrl
                    setMessages([
                        ...messages,
                        { text: outMessage, type: 'out', avatar: myAvatarUrl },
                    ])
                    // Очищаем поле ввода
                    setOutMessage('')
                })
                .catch((error) => {
                    console.error(
                        'Ошибка при получении ссылки на аватар:',
                        error,
                    )
                })
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error)
        }
    }

    // Нажмем Enter для отправки
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            setIsButtonActive(true)
            setTimeout(() => {
                setIsButtonActive(false)
                handleSendMessage()
            }, 200)
        }
    }

    // Логика входящих сообшений (используем pending для сохранения очередности ответов)
    let isRequestPending = false

    function handleReceiveMessage(avatarUrl) {
        if (!isRequestPending) {
            isRequestPending = true
            ReceiveMessage('ReceiveNotification')
                .then((data) => {
                    if (!data) {
                        isRequestPending = false
                        return
                    }
                    // Используем функцию обновления состояния для гарантии последовательного добавления сообщений
                    // Вызов setReceivedMessages будет выполнен после получения нового сообщения
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            text: data.textMessage,
                            type: 'in',
                            avatar: avatarUrl,
                        },
                    ])
                })
                .catch((error) => {
                    isRequestPending = false
                    console.error(
                        'Ошибка при получении входящего сообщения:',
                        error,
                    )
                })
                .finally(() => {
                    isRequestPending = false
                })
        }
    }

    // Запускаем запрос на наличие уведомлений каждые 5 секунд
    useEffect(() => {
        if (isLoggedIn === true) {
            const intervalId = setInterval(
                () => handleReceiveMessage(contactAvatarUrl),
                5000,
            )
            return () => {
                clearInterval(intervalId)
            }
        }
    }, [isLoggedIn, contactAvatarUrl])

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
    )
}

export default App
