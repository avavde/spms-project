import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const buildingsAndPlansService = {
  getBuildings: () => axios.get(`${API_URL}/buildings`),
  getBuildingById: (id) => axios.get(`${API_URL}/buildings/${id}`),
  createBuilding: (data) => axios.post(`${API_URL}/buildings`, data),
  updateBuilding: (id, data) => axios.put(`${API_URL}/buildings/${id}`, data),
  deleteBuilding: (id) => axios.delete(`${API_URL}/buildings/${id}`),

  getFloorPlans: () => axios.get(`${API_URL}/floor-plans`),
  getFloorPlanById: (id) => axios.get(`${API_URL}/floor-plans/${id}`),
  createFloorPlan: (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Логирование данных перед отправкой
    console.log('Data object:', data);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return axios.post(`${API_URL}/floor-plans`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateFloorPlan: (id, data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Логирование данных перед отправкой
    console.log('Data object:', data);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return axios.put(`${API_URL}/floor-plans/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteFloorPlan: (id) => axios.delete(`${API_URL}/floor-plans/${id}`),

  getUnassignedFloorPlans: () => axios.get(`${API_URL}/floor-plans/unassigned`),
};

export default buildingsAndPlansService;
