import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const generateReport = async (employeeId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/reports/generate`, {
      params: { employeeId, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    throw error;
  }
};

const generateEnterpriseSummary = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/reports/generate-enterprise-summary`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при формировании сводного отчета:', error);
    throw error;
  }
};

export default { generateReport, generateEnterpriseSummary };
