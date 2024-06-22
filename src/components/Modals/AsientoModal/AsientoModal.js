import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Table, Alert, InputGroup } from "react-bootstrap";
import { getCuentas } from "../../../services/CuentasService";
import { getSubdiarios } from "../../../services/SubdiariosService";
import { FaTrash } from "react-icons/fa";
import "./AsientoModal.css";
import { UserContext } from "../../../context/UserContext";

const initialState = {
  descripcion: "",
  subdiario: "",
  detalles: [],
  sumaDebe: 0,
  sumaHaber: 0,
  error: "",
};

const AsientoModal = ({ show, handleClose, handleGuardarAsiento }) => {
  const [descripcion, setDescripcion] = useState(initialState.descripcion);
  const [fecha] = useState(new Date().toISOString().split("T")[0]);
  const [subdiario, setSubdiario] = useState(initialState.subdiario);
  const [detalles, setDetalles] = useState(initialState.detalles);
  const [cuentas, setCuentas] = useState([]);
  const [subdiarios, setSubdiarios] = useState([]);
  const [sumaDebe, setSumaDebe] = useState(initialState.sumaDebe);
  const [sumaHaber, setSumaHaber] = useState(initialState.sumaHaber);
  const [error, setError] = useState(initialState.error);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const data = await getCuentas();
        const cuentasActivas = data.filter(cuenta => cuenta.estado === 1);
        setCuentas(cuentasActivas);
      } catch (error) {
        console.error("Error fetching cuentas:", error);
      }
    };

    const fetchSubdiarios = async () => {
      try {
        const data = await getSubdiarios();
        const subdiariosActivos = data.filter(subdiario => subdiario.estado === 1);
        setSubdiarios(subdiariosActivos);
      } catch (error) {
        console.error("Error fetching subdiarios:", error);
      }
    };

    fetchCuentas();
    fetchSubdiarios();
  }, []);

  useEffect(() => {
    const calcularSumaDebe = () =>
      detalles.reduce(
        (acc, detalle) => acc + (parseFloat(detalle.debe) || 0),
        0
      );
    const calcularSumaHaber = () =>
      detalles.reduce(
        (acc, detalle) => acc + (parseFloat(detalle.haber) || 0),
        0
      );

    setSumaDebe(calcularSumaDebe());
    setSumaHaber(calcularSumaHaber());
  }, [detalles]);

  useEffect(() => {
    // Reset modal state when 'show' changes
    if (!show) {
      resetModal();
    }
  }, [show]);

  const resetModal = () => {
    setDescripcion(initialState.descripcion);
    setSubdiario(initialState.subdiario);
    setDetalles(initialState.detalles);
    setSumaDebe(initialState.sumaDebe);
    setSumaHaber(initialState.sumaHaber);
    setError(initialState.error);
  };

  const handleAgregarDetalle = () => {
    setDetalles([...detalles, { id_cuenta: "", debe: "", haber: "" }]);
  };

  const handleGuardar = () => {
    if (sumaDebe !== sumaHaber) {
      setError("El Debe y el Haber deben ser iguales para generar un asiento.");
      return;
    }

    const nuevoAsiento = {
      id_usuario: user.id,
      descripcion,
      fecha,
      id_subdiario: subdiario || null,
      detalles: detalles.map((detalle) => ({
        ...detalle,
        debe: detalle.debe === "" ? "0" : detalle.debe,
        haber: detalle.haber === "" ? "0" : detalle.haber,
      })),
    };
    console.log(nuevoAsiento);
    handleGuardarAsiento(nuevoAsiento);
    handleClose();
  };

  const handleGuardarDetalle = (index, detalle) => {
    const updatedDetalles = [...detalles];
    updatedDetalles[index] = detalle;
    setDetalles(updatedDetalles);
  };

  const handleEliminarDetalle = (index) => {
    const updatedDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(updatedDetalles);
  };

  const handleDebeChange = (index, event) => {
    const { value } = event.target;
    const updatedDetalles = [...detalles];
    updatedDetalles[index].debe = value;
    if (!value) updatedDetalles[index].haber = ""; // Clear 'haber' if 'debe' is set to empty
    setDetalles(updatedDetalles);
  };

  const handleHaberChange = (index, event) => {
    const { value } = event.target;
    const updatedDetalles = [...detalles];
    updatedDetalles[index].haber = value;
    if (!value) updatedDetalles[index].debe = ""; // Clear 'debe' if 'haber' is set to empty
    setDetalles(updatedDetalles);
  };

  const formatCurrency = (value) => {
    return `S/. ${parseFloat(value).toFixed(2)}`;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
      onEntered={() => resetModal()} // Reset modal state on enter
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Asiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="subdiario">
            <Form.Label>Subdiario</Form.Label>
            <Form.Control
              as="select"
              value={subdiario}
              onChange={(e) => setSubdiario(e.target.value)}
            >
              <option value="">Seleccionar Subdiario</option>
              {subdiarios.map((subdiario) => (
                <option key={subdiario.id} value={subdiario.id}>
                  {subdiario.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <hr />
          <h5>Detalles del Asiento</h5>
          <Button variant="primary" onClick={handleAgregarDetalle}>
            Agregar Detalle
          </Button>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Debe</th>
                <th>Haber</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      as="select"
                      value={detalle.id_cuenta}
                      onChange={(e) =>
                        handleGuardarDetalle(index, {
                          ...detalle,
                          id_cuenta: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccionar Cuenta</option>
                      {cuentas.map((cuenta) => (
                        <option key={cuenta.id} value={cuenta.id}>
                          {cuenta.codigo_cuenta} - {cuenta.nombre_cuenta}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>
                  <InputGroup>
                      <InputGroup.Text>S/.</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={detalle.debe}
                        onChange={(e) => handleDebeChange(index, e)}
                        disabled={detalle.haber}
                        placeholder="0.00"
                      />
                    </InputGroup>

                  </td>
                  <td>
                  <InputGroup>
                      <InputGroup.Text>S/.</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={detalle.haber}
                        onChange={(e) => handleHaberChange(index, e)}
                        disabled={detalle.debe}
                        placeholder="0.00"
                      />
                    </InputGroup>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleEliminarDetalle(index)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{formatCurrency(sumaDebe)}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(sumaHaber)}</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar Asiento
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AsientoModal;
