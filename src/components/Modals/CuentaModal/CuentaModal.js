import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CuentaModal = ({ show, handleClose, handleGuardarCuenta, cuenta }) => {
  const [codigoCuenta, setCodigoCuenta] = useState('');
  const [nombreCuenta, setNombreCuenta] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('');

  // useEffect para actualizar los campos cuando cambia la cuenta (modo edición)
  useEffect(() => {
    if (cuenta) {
      setCodigoCuenta(cuenta.codigo_cuenta || '');
      setNombreCuenta(cuenta.nombre_cuenta || '');
      setTipoCuenta(cuenta.tipo_cuenta || '');
    }
  }, [cuenta]);

  const handleGuardar = () => {
    const cuentaActualizada = {
      ...cuenta,
      codigo_cuenta: codigoCuenta,
      nombre_cuenta: nombreCuenta,
      tipo_cuenta: tipoCuenta
    };
    handleGuardarCuenta(cuentaActualizada);
    handleClose(); // Cierra el modal después de guardar la cuenta
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{cuenta ? 'Editar Cuenta' : 'Agregar Cuenta'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="codigoCuenta">
            <Form.Label>Código de Cuenta</Form.Label>
            <Form.Control
              type="text"
              value={codigoCuenta}
              onChange={(e) => setCodigoCuenta(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="nombreCuenta">
            <Form.Label>Nombre de Cuenta</Form.Label>
            <Form.Control
              type="text"
              value={nombreCuenta}
              onChange={(e) => setNombreCuenta(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="tipoCuenta">
            <Form.Label>Tipo de Cuenta</Form.Label>
            <Form.Control
              type="text"
              value={tipoCuenta}
              onChange={(e) => setTipoCuenta(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          {cuenta ? 'Guardar' : 'Agregar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CuentaModal;
