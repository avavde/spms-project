import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllEmployees = () => {
  return axios.get(`${API_URL}/employees`);
};

const getEmployeeById = (id) => {
  return axios.get(`${API_URL}/employees/${id}`);
};

const createEmployee = (employeeData) => {
  return axios.post(`${API_URL}/employees`, employeeData);
};

const updateEmployee = (id, employeeData) => {
  return axios.put(`${API_URL}/employees/${id}`, employeeData);
};

const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/employees/${id}`);
};

const assignBeacon = (employeeId, beaconid) => {
  return axios.put(`${API_URL}/employees/${employeeId}/assign-beacon`, { beaconid });
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignBeacon,
};
