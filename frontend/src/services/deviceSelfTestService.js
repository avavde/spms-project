import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDeviceSelfTests = () => {
  return axios.get(`${API_URL}/device-self-tests`);
};

const getDeviceSelfTestById = (id) => {
  return axios.get(`${API_URL}/device-self-tests/${id}`);
};

export default {
  getAllDeviceSelfTests,
  getDeviceSelfTestById,
};
