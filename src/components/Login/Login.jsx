/* eslint-disable react/prop-types */
import React from "react";
import { useForm } from "react-hook-form";
import "./Login.scss";

function Login({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const submitForm = (data) => {
    // Вызов переданной функции обратного вызова onSubmit для передачи в App
    onSubmit(data);
    reset();
  };

  return (
    <div className="login">
      <div name="description" className="login__textarea">
        Для использования сервиса вам необходимо зарегистрироваться и привязать
        свой номер WhatsApp на сайте
        <a
          href="https://green-api.com/"
          target="_blank"
          rel="noreferrer"
          className="link"
          style={{ color: "#111b21" }}
        >
          &nbsp;Green API
        </a>
      </div>
      <form className="login__form" onSubmit={handleSubmit(submitForm)}>
        <div className="login__input-wrapper">
          <label className="login__label">Instance ID</label>
          <input
            className="login__input"
            {...register("idInstance", {
              required: "Поле обязательно для заполнения",
              pattern: {
                value: /^\d{10}$/,
                message: "Неверный формат ID (ожидается 10 цифр)",
              },
              minLength: {
                value: 10,
                message: "Должно быть 10 цифр",
              },
            })}
            defaultValue="1101821335"
            autoComplete="on"
            type="text"
            id="idInstance"
            maxLength="10"
          />
          {errors.idInstance && (
            <span className="login__input-error">
              {errors.idInstance.message}
            </span>
          )}
        </div>
        <div className="login__input-wrapper">
          <label className="login__label">Instance Token</label>
          <input
            className="login__input"
            {...register("apiTokenInstance", {
              required: "Поле обязательно для заполнения",
              pattern: {
                value: /^[a-zA-Z0-9]{50}$/,
                message:
                  "Неверный формат apiTokenInstance (ожидается 50 символов)",
              },
              minLength: {
                value: 50,
                message: "Должно быть 50 символов",
              },
            })}
            type="text"
            maxLength="50"
            id="apiTokenInstance"
          />
          {errors.apiTokenInstance && (
            <span className="login__input-error">
              {errors.apiTokenInstance.message}
            </span>
          )}
        </div>
        <div className="login__input-wrapper">
          <label className="login__label">Номер телефона собеседника</label>
          <input
            className="login__input"
            {...register("phoneNumber", {
              required: "Поле обязательно для заполнения",
              pattern: {
                value: /^\+7\d{10}$/,
                message: "Неверный формат номера.",
              },
            })}
            type="text"
            maxLength="12"
            id="phoneNumber"
            defaultValue="+7"
            onKeyDown={(e) => {
              if (e.key === "Backspace" && e.target.value === "+7") {
                e.preventDefault();
              }
            }}
          />
          {errors.phoneNumber && (
            <span className="login__input-error">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>
        <button className="login__button" type="submit">
          В О Й Т И
        </button>
      </form>
    </div>
  );
}

export default Login;
