import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllReports = () => {
  return axios.get(`${API_URL}/reports`);
};

const getReportById = (id) => {
  return axios.get(`${API_URL}/reports/${id}`);
};

const createReport = (reportData) => {
  return axios.post(`${API_URL}/reports`, reportData);
};

const deleteReport = (id) => {
  return axios.delete(`${API_URL}/reports/${id}`);
};

export default {
  getAllReports,
  getReportById,
  createReport,
  deleteReport,
};
