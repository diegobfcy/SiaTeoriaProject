import axios from 'axios';

const API_URL = "http://localhost:3003"; // Cambia esto según tu configuración

// Funciones CRUD para la tabla trs_asiento

export const getAsientos = async () => {
  try {
    const response = await axios.get(`${API_URL}/asientos`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAsiento = async (asiento) => {
  try {
    const response = await axios.post(`${API_URL}/asientos`, asiento);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAsiento = async (id, asiento) => {
  try {
    const response = await axios.put(`${API_URL}/asientos/${id}`, asiento);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAsiento = async (id) => {
  try {
    await axios.delete(`${API_URL}/asientos/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
