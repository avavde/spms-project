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
    return axios.put(`${API_URL}/floor-plans/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteFloorPlan: (id) => axios.delete(`${API_URL}/floor-plans/${id}`),

  getUnassignedFloorPlans: () => axios.get(`${API_URL}/floor-plans/unassigned`),
  getBeaconFloorPlans: () => axios.get(`${API_URL}/beacon-floor-plans`),
  getBeaconFloorPlanById: (id) => axios.get(`${API_URL}/beacon-floor-plans/${id}`),
  createBeaconFloorPlan: (data) => axios.post(`${API_URL}/beacon-floor-plans`, data),
  updateBeaconFloorPlan: (id, data) => axios.put(`${API_URL}/beacon-floor-plans/${id}`),
  deleteBeaconFloorPlan: (id) => axios.delete(`${API_URL}/beacon-floor-plans/${id}`)
};

export default buildingsAndPlansService;
