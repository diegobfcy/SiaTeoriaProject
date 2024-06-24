import React, { useState, useContext } from "react";
import "./MainPage.css";
import CuentasTable from "../../components/CuentasTable/CuentasTable";
import SubdiariosTable from "../../components/SubdiariosTable/SubdiariosTable";
import UsuariosTable from "../../components/UsuariosTable/UsuariosTable";
import LibroDiarioTable from "../../components/LibroDiarioTable/LibroDiarioTable";
import { UserContext } from "../../context/UserContext";

const MainPage = () => {
  const [selectedTable, setSelectedTable] = useState("libroDiario"); // Estado para controlar qué tabla mostrar
  const { user } = useContext(UserContext); // Obtiene el usuario del contexto

  const handleMenuClick = (tableName) => {
    setSelectedTable(tableName); // Actualiza el estado con el nombre de la tabla seleccionada
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="logo-section">
          <span className="app-name">Asiento Contable</span>
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
      </main>
    </div>
  );
};

export default MainPage;
