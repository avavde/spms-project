// frontend/src/services/cancelSosService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const sendCancelSosMessage = () => {
  return axios.post(`${API_URL}/cancel-sos/cancel-sos`);
};

export default {
  sendCancelSosMessage,
};
