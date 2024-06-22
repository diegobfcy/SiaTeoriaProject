import React, { useState, useEffect } from "react";
import { getCuentas, createCuenta, updateCuenta, deleteCuenta } from "../../services/CuentasService";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import CuentaModal from "../Modals/CuentaModal/CuentaModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import "./CuentasTable.css";

const CuentasTable = () => {
  const [cuentas, setCuentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cuentaEditar, setCuentaEditar] = useState(null);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const data = await getCuentas();
        setCuentas(data);
      } catch (error) {
        console.error("Error fetching cuentas:", error);
      }
    };

    fetchCuentas();
  }, []);

  const handleAddCuenta = async (nuevaCuenta) => {
    try {
      nuevaCuenta.estado = 1; // Asegurando que el estado por defecto es 1 al agregar
      const cuentaNueva = await createCuenta(nuevaCuenta);
      setCuentas([...cuentas, cuentaNueva]);
    } catch (error) {
      console.error("Error creating cuenta:", error);
    }
  };

  const handleEditCuenta = (cuenta) => {
    setCuentaEditar(cuenta);
    setShowModal(true);
  };

  const handleUpdateCuenta = async (cuentaActualizada) => {
    try {
      const cuentaActualizadaResponse = await updateCuenta(cuentaActualizada.id, cuentaActualizada);
      const cuentasActualizadas = cuentas.map((cuenta) =>
        cuenta.id === cuentaActualizadaResponse.id ? cuentaActualizadaResponse : cuenta
      );
      setCuentas(cuentasActualizadas);
    } catch (error) {
      console.error("Error updating cuenta:", error);
    }
  };

  const handleDeleteCuenta = async (id) => {
    try {
      await deleteCuenta(id);
      const cuentasActualizadas = cuentas.filter((cuenta) => cuenta.id !== id);
      setCuentas(cuentasActualizadas);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("No se puede eliminar la cuenta porque tiene asientos asignados a esta.");
        setShowErrorModal(true);
      } else {
        console.error("Error deleting cuenta:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCuentaEditar(null);
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
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Agregar cuenta
      </Button>
      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th className="options-column">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id}>
                <td>{cuenta.codigo_cuenta}</td>
                <td>{cuenta.nombre_cuenta}</td>
                <td>{cuenta.tipo_cuenta}</td>
                <td>{formatEstado(cuenta.estado)}</td>
                <td className="options-column">
                  <Button
                    variant="warning"
                    className="mr-2"
                    onClick={() => handleEditCuenta(cuenta)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCuenta(cuenta.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <CuentaModal
        show={showModal}
        handleClose={handleCloseModal}
        handleGuardarCuenta={cuentaEditar ? handleUpdateCuenta : handleAddCuenta}
        cuenta={cuentaEditar}
      />
      <ErrorModal
        show={showErrorModal}
        handleClose={handleCloseErrorModal}
        message={errorMessage}
      />
    </div>
  );
};

export default CuentasTable;
