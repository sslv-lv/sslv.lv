<template>
    <div class="login-container">
      <label class="input-label">E-pasts</label>
      <input type="email" placeholder="Ievadi savu e-pastu" />

      <label class="input-label">Parole</label>
      <input type="password" placeholder="Ievadi savu paroli" />

      <button class="login-btn">Ienākt</button>
      <button class="register-btn">Reģistrēties</button>
    </div>
  </template>

  <script>
  export default {
    name: "LoginView",
  };
  </script>

  <style scoped>
  .login-container {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .input-label {
    color: black;
    display: block;
    margin-top: 20px;
    font-weight: bold;
    font-size: 16px;
  }

  input {
    width: 100%;
    padding: 10px 15px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  .login-btn,
  .register-btn {
    width: 100%;
    padding: 10px 0;
    margin-top: 15px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  .login-btn {
    background-color: #007bff;
    color: #fff;
  }

  .register-btn {
    background-color: #f7f7f7;
    color: #333;
  }
  </style>
