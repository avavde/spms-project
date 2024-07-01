import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAvailableBeacons = () => {
  return axios.get(`${API_URL}/beacons/available`);
};

export default {
  getAvailableBeacons,
};
