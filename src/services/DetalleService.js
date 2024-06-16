import axios from 'axios';

const API_URL = "http://localhost:3003"; // Cambia esto según tu configuración

// Funciones CRUD para la tabla trs_detalle

export const getDetalles = async () => {
  try {
    const response = await axios.get(`${API_URL}/detalles`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createDetalle = async (detalle) => {
  try {
    const response = await axios.post(`${API_URL}/detalles`, detalle);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateDetalle = async (id, detalle) => {
  try {
    const response = await axios.put(`${API_URL}/detalles/${id}`, detalle);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteDetalle = async (id) => {
  try {
    await axios.delete(`${API_URL}/detalles/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
