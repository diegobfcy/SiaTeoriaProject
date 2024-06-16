import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UserContext } from '../../../context/UserContext';

const SubdiariosModal = ({ show, handleClose, handleGuardarSubdiario, subdiario }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { user } = useContext(UserContext);
  
  useEffect(() => {
    if (subdiario) {
      setNombre(subdiario.nombre);
      setDescripcion(subdiario.descripcion);
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [subdiario]);

  const handleGuardar = () => {

    const fechaHoraActual = new Date().toISOString().slice(0, 19).replace('T', ' '); // Obtener fecha y hora actual en formato ISO 8601
    const nuevoSubdiario = {
      nombre,
      fecha_creacion: fechaHoraActual,
      descripcion,
      id_usuario: user.id
    };
    if (subdiario) {
      handleGuardarSubdiario(subdiario.id, nuevoSubdiario);
    } else {
      handleGuardarSubdiario(nuevoSubdiario);
    }
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{subdiario ? 'Editar Subdiario' : 'Agregar Subdiario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          {subdiario ? 'Guardar Cambios' : 'Agregar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubdiariosModal;
