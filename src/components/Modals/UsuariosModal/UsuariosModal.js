// UsuariosModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UsuariosModal = ({ show, handleClose, handleGuardarUsuario, usuario }) => {
  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '');
  const [contrasena, setContrasena] = useState(usuario ? usuario.contrasena : '');

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setContrasena(usuario.contrasena);
    } else {
      setNombre('');
      setContrasena('');
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoUsuario = { nombre, contrasena };
    handleGuardarUsuario(nuevoUsuario);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{usuario ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="contrasena">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {usuario ? 'Actualizar' : 'Agregar'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuariosModal;
