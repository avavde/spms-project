// frontend/src/services/sosService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const sendSOSMessage = () => {
  return axios.post(`${API_URL}/send-sos`);
};

export default {
  sendSOSMessage,
};
