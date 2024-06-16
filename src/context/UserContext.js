// UserContext.js

import React, { createContext, useState } from 'react';
import { login } from '../services/AuthService';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id:'',
    nombre: '',
    tipo: ''
  });

  const handleLogin = async (username, password) => {
    try {
      const userData = await login(username, password);
      console.log(userData);
      setUser(userData);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleLogout = () => {
    setUser({
        id:'',
      nombre: '',
      tipo: ''
    });
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
