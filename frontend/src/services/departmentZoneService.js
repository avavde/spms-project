import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDepartmentZones = () => {
  return axios.get(`${API_URL}/department-zones`);
};

const getDepartmentZoneById = (id) => {
  return axios.get(`${API_URL}/department-zones/${id}`);
};

const createDepartmentZone = (departmentZoneData) => {
  return axios.post(`${API_URL}/department-zones`, departmentZoneData);
};

const updateDepartmentZone = (id, departmentZoneData) => {
  return axios.put(`${API_URL}/department-zones/${id}`, departmentZoneData);
};

const deleteDepartmentZone = (id) => {
  return axios.delete(`${API_URL}/department-zones/${id}`);
};

export default {
  getAllDepartmentZones,
  getDepartmentZoneById,
  createDepartmentZone,
  updateDepartmentZone,
  deleteDepartmentZone,
};
