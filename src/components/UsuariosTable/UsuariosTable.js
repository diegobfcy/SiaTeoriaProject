// UsuariosTable.js

import React, { useState, useEffect } from "react";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../../services/UsuarioService"; // Ajusta la ruta según tu estructura de archivos
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos
import UsuariosModal from "../Modals/UsuariosModal/UsuariosModal";
import "./UsuariosTable.css"; // Asegúrate de crear e importar este archivo de estilos

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleAgregarUsuario = () => {
    setShowModal(true);
    setUsuarioEditar(null);
  };

  const handleEditarUsuario = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    setUsuarioEditar(usuario);
    setShowModal(true);
  };

  const handleGuardarUsuario = async (usuario) => {
    try {
      if (usuarioEditar) {
        await updateUsuario(usuarioEditar.id, usuario);
        const usuariosActualizados = usuarios.map((u) =>
          u.id === usuarioEditar.id ? { ...u, ...usuario } : u
        );
        setUsuarios(usuariosActualizados);
      } else {
        const nuevoUsuario = await createUsuario(usuario);
        setUsuarios([...usuarios, nuevoUsuario]);
      }
      setShowModal(false);
      setUsuarioEditar(null);
    } catch (error) {
      console.error("Error saving usuario:", error);
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await deleteUsuario(id);
      const usuariosFiltrados = usuarios.filter((u) => u.id !== id);
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error("Error deleting usuario:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioEditar(null);
  };

  return (
    <div className="container mt-3">
      <Button onClick={handleAgregarUsuario} className="mb-3">
        Agregar Usuario
      </Button>
      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contraseña</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.contrasena}</td>
                <td className="options-column">
                  <Button
                    variant="warning"
                    className="mr-2"
                    onClick={() => handleEditarUsuario(usuario.id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleEliminarUsuario(usuario.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <UsuariosModal
        show={showModal}
        handleClose={handleCloseModal}
        handleGuardarUsuario={handleGuardarUsuario}
        usuario={usuarioEditar}
      />
    </div>
  );
};

export default UsuariosTable;
