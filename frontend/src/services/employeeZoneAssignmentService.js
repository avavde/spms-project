import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllAssignments = async () => {
  const response = await axios.get(`${API_URL}/employee-zone-assignments`);
  return response.data;
};

const getAssignmentById = async (id) => {
  const response = await axios.get(`${API_URL}/employee-zone-assignments/${id}`);
  return response.data;
};

const getAssignmentByEmployeeId = async (employeeId) => {
  const response = await axios.get(`${API_URL}/employee-zone-assignments/employee/${employeeId}`);
  return response.data;
};

const createAssignment = async (assignment) => {
  const response = await axios.post(`${API_URL}/employee-zone-assignments`, assignment);
  return response.data;
};

const updateAssignment = async (id, assignment) => {
  const response = await axios.put(`${API_URL}/employee-zone-assignments/${id}`, assignment);
  return response.data;
};

const deleteAssignment = async (id) => {
  const response = await axios.delete(`${API_URL}/employee-zone-assignments/${id}`);
  return response.data;
};

export default {
  getAllAssignments,
  getAssignmentById,
  getAssignmentByEmployeeId,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
