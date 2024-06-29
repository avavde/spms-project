import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDepartments = () => {
  return axios.get(`${API_URL}/departments`);
};

const getDepartmentById = (id) => {
  return axios.get(`${API_URL}/departments/${id}`);
};

const createDepartment = (departmentData) => {
  return axios.post(`${API_URL}/departments`, departmentData);
};

const updateDepartment = (id, departmentData) => {
  return axios.put(`${API_URL}/departments/${id}`, departmentData);
};

const deleteDepartment = (id) => {
  return axios.delete(`${API_URL}/departments/${id}`);
};

export default {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
