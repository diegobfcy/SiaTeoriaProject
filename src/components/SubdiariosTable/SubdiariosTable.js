import React, { useState, useEffect } from "react";
import { getSubdiarios, createSubdiario, updateSubdiario, deleteSubdiario } from "../../services/SubdiariosService";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import SubdiariosModal from "../Modals/SubdiariosModal/SubdiariosModal";
import ErrorModal from "../ErrorModal/ErrorModal"; // Importa el nuevo modal
import "./SubdiariosTable.css";

const SubdiariosTable = () => {
  const [subdiarios, setSubdiarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);  // Estado para el modal de error
  const [errorMessage, setErrorMessage] = useState("");  // Estado para el mensaje de error
  const [subdiarioEditar, setSubdiarioEditar] = useState(null);

  useEffect(() => {
    const fetchSubdiariosData = async () => {
      try {
        const data = await getSubdiarios();
        setSubdiarios(data);
      } catch (error) {
        console.error("Error fetching subdiarios:", error);
      }
    };

    fetchSubdiariosData();
  }, []);

  const handleAgregarSubdiario = () => {
    setShowModal(true);
    setSubdiarioEditar(null);
  };

  const handleEditarSubdiario = (id) => {
    const subdiario = subdiarios.find((s) => s.id === id);
    if (subdiario) {
      setSubdiarioEditar(subdiario);
      setShowModal(true);
    }
  };

  const handleGuardarSubdiario = async (subdiario) => {
    try {
      if (subdiarioEditar) {
        await updateSubdiario(subdiarioEditar.id, subdiario);
        const subdiariosActualizados = subdiarios.map((s) =>
          s.id === subdiarioEditar.id ? { ...s, ...subdiario } : s
        );
        setSubdiarios(subdiariosActualizados);
      } else {
        subdiario.estado = 1; // Asegurando que el estado por defecto es 1 al agregar
        const subdiarioNuevo = await createSubdiario(subdiario);
        setSubdiarios([...subdiarios, subdiarioNuevo]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving subdiario:", error);
    }
  };

  const handleEliminarSubdiario = async (id) => {
    try {
      await deleteSubdiario(id);
      const subdiariosFiltrados = subdiarios.filter((s) => s.id !== id);
      setSubdiarios(subdiariosFiltrados);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("No se puede eliminar el subdiario porque tiene asientos asignados a este");
        setShowErrorModal(true);
      } else {
        console.error("Error deleting subdiario:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubdiarioEditar(null);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const formatEstado = (estado) => {
    return estado === 1 ? "Activo" : "Inactivo";
  };

  return (
    <div className="container mt-3">
      <Button onClick={handleAgregarSubdiario} className="mb-3">
        Agregar subdiario
      </Button>
      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha Creación</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {subdiarios.map((subdiario) => (
              <tr key={subdiario.id}>
                <td>{subdiario.nombre}</td>
                <td>{new Date(subdiario.fecha_creacion).toLocaleDateString()}</td>
                <td>{subdiario.descripcion}</td>
                <td>{formatEstado(subdiario.estado)}</td>
                <td className="options-column">
                  <Button
                    variant="warning"
                    className="mr-2"
                    onClick={() => handleEditarSubdiario(subdiario.id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleEliminarSubdiario(subdiario.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <SubdiariosModal
        show={showModal}
        handleClose={handleCloseModal}
        handleGuardarSubdiario={handleGuardarSubdiario}
        subdiario={subdiarioEditar}
      />
      <ErrorModal
        show={showErrorModal}
        handleClose={handleCloseErrorModal}
        message={errorMessage}
      />
    </div>
  );
};

export default SubdiariosTable;
