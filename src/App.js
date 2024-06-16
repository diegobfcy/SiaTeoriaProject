import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';
import LoginPage from './views/LoginPage/LoginPage';
import MainPage from './views/MainPage/MainPage';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
