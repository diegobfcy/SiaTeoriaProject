import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UserContext } from '../../../context/UserContext';

const SubdiariosModal = ({ show, handleClose, handleGuardarSubdiario, subdiario }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { user } = useContext(UserContext);
  const [estado, setEstado] = useState(1); // Estado por defecto es 1

  useEffect(() => {
    if (subdiario) {
      setNombre(subdiario.nombre);
      setDescripcion(subdiario.descripcion);
      setEstado(subdiario.estado); // Establecer el estado actual del subdiario en el estado local
    } else {
      setNombre('');
      setDescripcion('');
      setEstado(1); // Por defecto, nuevo subdiario comienza activo
    }
  }, [subdiario]);

  const handleGuardar = () => {
    const fechaHoraActual = new Date().toISOString().slice(0, 19).replace('T', ' '); // Obtener fecha y hora actual en formato ISO 8601
    const nuevoSubdiario = {
      nombre,
      fecha_creacion: fechaHoraActual,
      descripcion,
      id_usuario: user.id,
      estado
    };
    if (subdiario) {
      console.log(subdiario);
      handleGuardarSubdiario(nuevoSubdiario);
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
          {subdiario && ( // Solo muestra el campo de selección de estado si es un subdiario existente (es decir, al editarlo)
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={estado}
                onChange={(e) => setEstado(parseInt(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Control>
            </Form.Group>
          )}
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
