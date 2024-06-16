import React, { useState, useEffect } from "react";
import { getCuentas, createCuenta, updateCuenta, deleteCuenta } from "../../services/CuentasService"; // Ajusta la ruta según tu estructura de archivos
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importa los iconos
import CuentaModal from "../Modals/CuentaModal/CuentaModal";
import "./CuentasTable.css"; // Asegúrate de crear e importar este archivo de estilos

const CuentasTable = () => {
  const [cuentas, setCuentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
  }, []); // Empty dependency array means this effect runs only once after initial render

  const handleAddCuenta = async (nuevaCuenta) => {
    try {
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
      console.error("Error deleting cuenta:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCuentaEditar(null);
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
              <th className="options-column">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id}>
                <td>{cuenta.codigo_cuenta}</td>
                <td>{cuenta.nombre_cuenta}</td>
                <td>{cuenta.tipo_cuenta}</td>
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
    </div>
  );
};

export default CuentasTable;
