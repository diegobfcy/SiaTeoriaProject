import axios from 'axios';

const API_URL = "http://localhost:3003"; // Cambia esto según tu configuración

// Funciones CRUD para la tabla mae_cuenta

export const getCuentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/cuentas`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCuenta = async (cuenta) => {
  try {
    const response = await axios.post(`${API_URL}/cuentas`, cuenta);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCuenta = async (id, cuenta) => {
  try {
    const response = await axios.put(`${API_URL}/cuentas/${id}`, cuenta);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCuenta = async (id) => {
  try {
    await axios.delete(`${API_URL}/cuentas/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
