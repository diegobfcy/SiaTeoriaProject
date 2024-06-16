import React, { useState, useEffect } from "react";
import { createAsiento, getAsientos } from "../../services/AsientoService"; // Ajusta la ruta según tu estructura de archivos
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos
import AsientoModal from "../Modals/AsientoModal/AsientoModal";
import "./LibroDiarioTable.css"; // Asegúrate de crear e importar este archivo de estilos

const LibroDiarioTable = () => {
  const [asientos, setAsientos] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [asientoEditar, setAsientoEditar] = useState(null); // Estado para almacenar el asiento que se está editando

  useEffect(() => {


    fetchAsientosData(); // Llama a la función para obtener los asientos al cargar el componente
  }, []); // Ejecuta el efecto solo una vez al renderizar inicialmente
  const fetchAsientosData = async () => {
    try {
      const data = await getAsientos(); // Obtiene los asientos desde el servicio
      console.log(data);
      setAsientos(data); // Actualiza el estado con los asientos obtenidos
    } catch (error) {
      console.error("Error fetching asientos:", error);
    }
  };
  const handleAddAsiento = () => {
    // Función para manejar la apertura del modal para agregar asiento contable
    setShowModal(true); // Abre el modal de asientos
    setAsientoEditar(null); // Reinicia el estado de edición (no se está editando, sino creando uno nuevo)
  };

  const handleEditAsiento = (id) => {
    // Función para manejar la edición de un asiento contable
    const asiento = asientos.find((a) => a.id === id); // Encuentra el asiento por su ID
    if (asiento) {
      setAsientoEditar(asiento); // Establece el asiento a editar en el estado
      setShowModal(true); // Abre el modal de asientos
    }
  };

  const handleDeleteAsiento = async (id) => {
    // Función para manejar la eliminación de un asiento contable
    try {
      // Llama a la función de eliminación del servicio aquí (deleteAsiento(id))
      // Actualiza el estado de asientos después de la eliminación
      const asientosFiltrados = asientos.filter((a) => a.id !== id);
      setAsientos(asientosFiltrados);
    } catch (error) {
      console.error("Error deleting asiento:", error);
    }
  };

  const handleCloseModal = () => {
    // Función para manejar el cierre del modal
    setShowModal(false); // Cierra el modal
    setAsientoEditar(null); // Reinicia el estado de edición
  };

  const handleGuardarAsiento = async (asiento) => {
    try {
      const nuevoAsiento = await createAsiento(asiento); // Crea el nuevo asiento
      setTimeout(() => {
        fetchAsientosData(); // Cierra el modal después de guardar
      }, 1500); // Retraso de 1.5 segundos
    } catch (error) {
      console.error("Error creating asiento:", error);
    }
  };

  return (
    <div className="container mt-3">
      <Button onClick={handleAddAsiento} className="mb-3">
        Agregar asiento contable
      </Button>
      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Subdiario</th>
              <th>Descripción</th>
              <th>Código de Cuenta</th>
              <th>Cuenta</th>
              <th>Monto Crédito</th>
              <th>Monto Débito</th>
              <th>Usuario</th>
              <th className="options-column">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {asientos.map((asiento) => (
              <tr key={asiento.id}>
                <td>{new Date(asiento.fecha_asiento).toLocaleDateString()}</td>
                <td>{asiento.subdiario}</td>
                <td>{asiento.descripcion_asiento}</td>
                <td>{asiento.numero_cuenta}</td>
                <td>{asiento.nombre_cuenta}</td>
                <td>{asiento.monto_credito}</td>
                <td>{asiento.monto_debito}</td>
                <td>{asiento.usuario}</td>
                <td className="options-column">
                  <Button
                    variant="warning"
                    className="mr-2"
                    onClick={() => handleEditAsiento(asiento.id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteAsiento(asiento.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AsientoModal
        show={showModal}
        handleClose={handleCloseModal}
        asiento={asientoEditar}
        handleGuardarAsiento={handleGuardarAsiento}
      />
    </div>
  );
};

export default LibroDiarioTable;
