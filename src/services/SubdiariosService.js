import axios from 'axios';

const API_URL = "http://localhost:3003"; // Cambia esto según tu configuración

// Funciones CRUD para la tabla mae_subdiario

export const getSubdiarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/subdiarios`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSubdiario = async (subdiario) => {
  const { nombre, fecha_creacion, descripcion, id_usuario } = subdiario;
  try {
    const response = await axios.post(`${API_URL}/subdiarios`, { nombre, fecha_creacion, descripcion, id_usuario });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSubdiario = async (id, subdiario) => {
  const { nombre, fecha_creacion, descripcion, id_usuario } = subdiario;
  try {
    const response = await axios.put(`${API_URL}/subdiarios/${id}`, { nombre, fecha_creacion, descripcion, id_usuario });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteSubdiario = async (id) => {
  try {
    await axios.delete(`${API_URL}/subdiarios/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
