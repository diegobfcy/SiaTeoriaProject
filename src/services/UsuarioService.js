import axios from 'axios';

const API_URL = "http://localhost:3003"; // Cambia esto según tu configuración

// Funciones CRUD para la tabla mae_usuario

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUsuario = async (usuario) => {
  const { nombre, contrasena } = usuario;
  try {
    const response = await axios.post(`${API_URL}/usuarios`, { nombre, contrasena });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUsuario = async (id, usuario) => {
  const { nombre, contrasena } = usuario;
  try {
    const response = await axios.put(`${API_URL}/usuarios/${id}`, { nombre, contrasena });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_URL}/usuarios/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
