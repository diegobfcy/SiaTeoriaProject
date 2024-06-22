import React, { useState, useEffect } from "react";
import {
  createAsiento,
  deleteAsiento,
  getAsientos,
  getAsientosDetallesData,
} from "../../services/AsientoService";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa"; // Importamos el icono de PDF
import AsientoModal from "../Modals/AsientoModal/AsientoModal";
import "./LibroDiarioTable.css";
import generatePDF from "../../utilities/generatePDF";// Importa la función generatePDF desde el archivo

const LibroDiarioTable = () => {
  const [asientos, setAsientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [asientoEditar, setAsientoEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [asientoEliminar, setAsientoEliminar] = useState(null);

  useEffect(() => {
    fetchAsientosData();
  }, []);

  const fetchAsientosData = async () => {
    try {
      const data = await getAsientos();
      setAsientos(data);
    } catch (error) {
      console.error("Error fetching asientos:", error);
    }
  };

  const handleAddAsiento = () => {
    setShowModal(true);
    setAsientoEditar(null);
  };

  const handleEditAsiento = (id) => {
    const asiento = asientos.find((a) => a.id === id);
    if (asiento) {
      setAsientoEditar(asiento);
      setShowModal(true);
    }
  };

  const handleDeleteAsiento = (asiento) => {
    console.log(asiento);
    setAsientoEliminar(asiento);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAsiento(asientoEliminar.id_asiento);
      setShowConfirmModal(false);
      fetchAsientosData();
    } catch (error) {
      console.error("Error deleting asiento:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setAsientoEliminar(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAsientoEditar(null);
  };

  const handleGuardarAsiento = async (asiento) => {
    try {
      await createAsiento(asiento);
      setShowModal(false);
      fetchAsientosData();
    } catch (error) {
      console.error("Error creating asiento:", error);
    }
  };

  const handleGenerarPDF = (asiento) => {
    console.log(asiento);
    console.log(getAsientosDetallesData(asiento.id_asiento));
    // Llama a la función generatePDF con los datos del asiento
    generatePDF(asiento.id_asiento, `Asiento_${asiento.id}`);
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
                    className="mr-2"
                    onClick={() => handleDeleteAsiento(asiento)}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleGenerarPDF(asiento)}
                  >
                    <FaFilePdf />
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
      <Modal show={showConfirmModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {asientoEliminar && (
            <p>
              Si elimina el asiento "{asientoEliminar.descripcion_asiento}",
              se eliminará permanentemente. ¿Está seguro?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LibroDiarioTable;
