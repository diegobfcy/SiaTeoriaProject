import React, { useState, useContext } from "react";
import "./MainPage.css";
import CuentasTable from "../../components/CuentasTable/CuentasTable";
import SubdiariosTable from "../../components/SubdiariosTable/SubdiariosTable";
import UsuariosTable from "../../components/UsuariosTable/UsuariosTable";
import LibroDiarioTable from "../../components/LibroDiarioTable/LibroDiarioTable";
import { UserContext } from "../../context/UserContext";
import Bienvenido from "../../components/Bienvenido/Bienvenido";
import { FaUser } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [selectedTable, setSelectedTable] = useState("bienvenido"); // Estado para controlar qué tabla mostrar
  const { user, handleLogout } = useContext(UserContext); // Obtiene el usuario y la función de logout del contexto
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar la visibilidad del pop-up
  const navigate = useNavigate();

  const handleMenuClick = (tableName) => {
    setSelectedTable(tableName); // Actualiza el estado con el nombre de la tabla seleccionada
  };

  const togglePopup = () => {
    setShowPopup(!showPopup); // Alterna la visibilidad del pop-up
  };
  const handleLogoutOnClick = () => {
    navigate("/");
    handleLogout();
  }


  return (
    <div className="main-page">
      <header className="main-header">
        <div className="logo-section">
          <span className="app-name">Asiento Contable</span>
          <button className="user-icon-button" onClick={togglePopup}>
            <FaUser />
          </button>
        </div>
        
        <nav className="main-menu">
          {user.tipo !== "admin" && (
            <button
              className="menu-button"
              onClick={() => handleMenuClick("libroDiario")}
            >
              Libro Diario
            </button>
          )}

          {user.tipo !== "admin" && (
            <button
              className="menu-button"
              onClick={() => handleMenuClick("cuentas")}
            >
              Cuentas
            </button>
          )}

          {user.tipo !== "admin" && (
            <button
              className="menu-button"
              onClick={() => handleMenuClick("subdiarios")}
            >
              Subdiarios
            </button>
          )}

          {user.tipo === "admin" && (
            <button
              className="menu-button"
              onClick={() => handleMenuClick("usuarios")}
            >
              Usuarios
            </button>
          )}
        </nav>
        
      </header>

      <main className="content">
        {selectedTable === "cuentas" && <CuentasTable />}
        {selectedTable === "libroDiario" && <LibroDiarioTable />}
        {selectedTable === "subdiarios" && <SubdiariosTable />}
        {selectedTable === "usuarios" && <UsuariosTable />}
        {selectedTable === "bienvenido" && (
          <Bienvenido nombre={user.nombre} />
        )}{" "}
        {/* Pasa el nombre del usuario */}
      </main>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="popup-username">{user.nombre}</span>
            <button className="popup-logout-button" onClick={handleLogoutOnClick}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
