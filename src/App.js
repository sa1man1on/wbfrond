import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from "./screens/Login/Login";
import Catalog from "./screens/Catalog/Catalog";
import MyProvider from "./Context/provider";

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Проверяем, доступен ли объект Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Инициализируем данные
      tg.ready();

      // Получаем данные пользователя
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUsername(tg.initDataUnsafe.user.first_name);
      }

      // Обработка событий (опционально)
      tg.onEvent('mainButtonClicked', () => {
        // Действия при нажатии на основную кнопку
        tg.close();
      });
    }
  }, []);

  const handleClose = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  return (
      <MyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/catalog" element={<Catalog />} />
          </Routes>
        </Router>
      </MyProvider>

  );
}

export default App;
