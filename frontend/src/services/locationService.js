// services/locationService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getLocationData = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${employeeId}/location`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

export default {
  getLocationData,
};
