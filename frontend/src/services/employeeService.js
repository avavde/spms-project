import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllEmployees = () => {
  return axios.get(`${API_URL}/employees`);
};

const getDeviceStatus = async (beaconId) => {
  const response = await axios.get(`${API_URL}/device-statuses/${beaconId}`);
  return response.data;
};

const getZoneAssignments = async (employeeId) => {
  const response = await axios.get(`${API_URL}/employee-zone-assignments/employee/${employeeId}`);
  return response.data;
};

const getEmployeeById = (id) => {
  return axios.get(`${API_URL}/employees/${id}`);
};

const createEmployee = (employeeData) => {
  console.log('Creating employee with data:', employeeData); // Добавлено для отладки
  return axios.post(`${API_URL}/employees`, employeeData);
};

const updateEmployee = (id, employeeData) => {
  console.log('Updating employee with id:', id, 'and data:', employeeData); // Добавлено для отладки
  return axios.put(`${API_URL}/employees/${id}`, employeeData);
};

const deleteEmployee = (id) => {
  return axios.delete(`${API_URL}/employees/${id}`);
};

const assignBeacon = (employeeId, beaconid) => {
  return axios.put(`${API_URL}/employees/${employeeId}/assign-beacon`, { beaconid });
};

const getEmployeeMovements = async (employeeId, startDate, endDate) => {
  const response = await axios.get(`${API_URL}/employees/${employeeId}/movements`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignBeacon,
  getDeviceStatus,
  getZoneAssignments,
  getEmployeeMovements,
};
