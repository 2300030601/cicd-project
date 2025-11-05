import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getTransactionsByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/transactions/user/${userId}`);
  return response.data;
};

export const addTransaction = async (transaction) => {
  const response = await axios.post(`${API_BASE_URL}/transactions`, transaction);
  return response.data;
};

export const deleteTransactionsByUser = async (userId) => {
  await axios.delete(`${API_BASE_URL}/transactions/user/${userId}`);
};
