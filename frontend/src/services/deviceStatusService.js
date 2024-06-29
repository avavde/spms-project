import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDeviceStatuses = () => {
  return axios.get(`${API_URL}/device-statuses`);
};

const getDeviceStatusById = (id) => {
  return axios.get(`${API_URL}/device-statuses/${id}`);
};

export default {
  getAllDeviceStatuses,
  getDeviceStatusById,
};
