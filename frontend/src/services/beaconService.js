import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllBeacons = async () => {
  try {
    const response = await axios.get(`${API_URL}/beacons`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении маяков:', error);
    throw error;
  }
};

const getBeaconByMacs = async (beaconMacs) => {
  try {
    const response = await axios.get(`${API_URL}/beacons`, {
      params: { beacon_macs: beaconMacs }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении маяков по MAC адресам:', error);
    throw error;
  }
};

const getAvailableBeacons = async () => {
  try {
    const response = await axios.get(`${API_URL}/beacons/available/beacons`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении доступных маяков:', error);
    throw error;
  }
};

const createBeacon = async (beacon) => {
  try {
    const response = await axios.post(`${API_URL}/beacons`, beacon);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании маяка:', error);
    throw error;
  }
};

const updateBeaconCoordinates = async (beacon_mac, map_coordinates) => {
  try {
    const response = await axios.put(`${API_URL}/beacons/${beacon_mac}`, { map_coordinates });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении координат маяка с MAC: ${beacon_mac}`, error);
    throw error;
  }
};

const deleteBeacon = async (beacon_mac) => {
  try {
    await axios.delete(`${API_URL}/beacons/${beacon_mac}`);
  } catch (error) {
    console.error(`Ошибка при удалении маяка с MAC: ${beacon_mac}`, error);
    throw error;
  }
};

export default {
  getAllBeacons,
  getBeaconByMacs,
  getAvailableBeacons,
  createBeacon,
  updateBeaconCoordinates,
  deleteBeacon,
};
