import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDeviceEvents = () => {
  return axios.get(`${API_URL}/device-events`);
};

const getDeviceEventById = (id) => {
  return axios.get(`${API_URL}/device-events/${id}`);
};

export default {
  getAllDeviceEvents,
  getDeviceEventById,
};
