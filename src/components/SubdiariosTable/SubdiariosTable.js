import React, { useState, useEffect } from "react";
import { getSubdiarios, createSubdiario, updateSubdiario, deleteSubdiario } from "../../services/SubdiariosService"; // Importa las funciones CRUD del servicio
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos
import SubdiariosModal from "../Modals/SubdiariosModal/SubdiariosModal";
import "./SubdiariosTable.css"; // Asegúrate de crear e importar este archivo de estilos

const SubdiariosTable = () => {
  const [subdiarios, setSubdiarios] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [subdiarioEditar, setSubdiarioEditar] = useState(null); // Estado para almacenar el subdiario que se está editando

  useEffect(() => {
    const fetchSubdiariosData = async () => {
      try {
        const data = await getSubdiarios(); // Obtiene los subdiarios desde el servicio
        setSubdiarios(data); // Actualiza el estado con los subdiarios obtenidos
      } catch (error) {
        console.error("Error fetching subdiarios:", error);
      }
    };

    fetchSubdiariosData(); // Llama a la función para obtener los subdiarios al cargar el componente
  }, []); // Ejecuta el efecto solo una vez al renderizar inicialmente

  const handleAgregarSubdiario = () => {
    // Función para manejar la apertura del modal para agregar subdiario
    setShowModal(true); // Abre el modal de subdiarios
    setSubdiarioEditar(null); // Reinicia el estado de edición (no se está editando, sino creando uno nuevo)
  };

  const handleEditarSubdiario = (id) => {
    // Función para manejar la edición de un subdiario
    const subdiario = subdiarios.find((s) => s.id === id); // Encuentra el subdiario por su ID
    if (subdiario) {
      setSubdiarioEditar(subdiario); // Establece el subdiario a editar en el estado
      setShowModal(true); // Abre el modal de subdiarios
    }
  };

  const handleGuardarSubdiario = async (subdiario) => {
    // Función para manejar el guardado de un subdiario (tanto creación como actualización)
    try {
      if (subdiarioEditar) {
        // Si existe subdiarioEditar, significa que estamos actualizando
        await updateSubdiario(subdiarioEditar.id, subdiario); // Llama a la función de actualización del servicio
        const subdiariosActualizados = subdiarios.map((s) =>
          s.id === subdiarioEditar.id ? { ...s, ...subdiario } : s
        );
        setSubdiarios(subdiariosActualizados); // Actualiza el estado con los subdiarios actualizados
      } else {
        // Si no existe subdiarioEditar, significa que estamos creando uno nuevo
        const subdiarioNuevo = await createSubdiario(subdiario); // Llama a la función de creación del servicio
        setSubdiarios([...subdiarios, subdiarioNuevo]); // Agrega el nuevo subdiario al estado
      }
      setShowModal(false); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error saving subdiario:", error);
    }
  };

  const handleEliminarSubdiario = async (id) => {
    // Función para manejar la eliminación de un subdiario
    try {
      await deleteSubdiario(id); // Llama a la función de eliminación del servicio
      const subdiariosFiltrados = subdiarios.filter((s) => s.id !== id); // Filtra los subdiarios excluyendo el eliminado
      setSubdiarios(subdiariosFiltrados); // Actualiza el estado con los subdiarios filtrados
    } catch (error) {
      console.error("Error deleting subdiario:", error);
    }
  };

  const handleCloseModal = () => {
    // Función para manejar el cierre del modal
    setShowModal(false); // Cierra el modal
    setSubdiarioEditar(null); // Reinicia el estado de edición
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
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {subdiarios.map((subdiario) => (
              <tr key={subdiario.id}>
                <td>{subdiario.nombre}</td>
                <td>{new Date(subdiario.fecha_creacion).toLocaleDateString()}</td>
                <td>{subdiario.descripcion}</td>
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
    </div>
  );
};

export default SubdiariosTable;
