import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getBeaconIdsByMacs = async (beaconMacs) => {
  try {
    const response = await axios.get(`${API_URL}/beacons/ids`, {
      params: { beacon_macs: beaconMacs }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении beacon IDs по MAC адресам:', error);
    throw error;
  }
};

const getAllZones = async () => {
  try {
    const response = await axios.get(`${API_URL}/zones`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    throw error;
  }
};

const createZone = async (zone) => {
  try {
    const beaconIds = await getBeaconIdsByMacs(zone.beacons);
    const newZone = { ...zone, beacons: beaconIds };
    const response = await axios.post(`${API_URL}/zones`, newZone);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании зоны:', error);
    throw error;
  }
};

const updateZone = async (id, zone) => {
  try {
    const beaconIds = await getBeaconIdsByMacs(zone.beacons);
    const updatedZone = { ...zone, beacons: beaconIds };
    const response = await axios.put(`${API_URL}/zones/${id}`, updatedZone);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении зоны с ID: ${id}`, error);
    throw error;
  }
};

const deleteZone = async (id) => {
  try {
    await axios.delete(`${API_URL}/zones/${id}`);
  } catch (error) {
    console.error(`Ошибка при удалении зоны с ID: ${id}`, error);
    throw error;
  }
};

const getCurrentZone = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/zones/current/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении текущей зоны для employeeId: ${employeeId}`, error);
    throw error;
  }
};

export default {
  getAllZones,
  getCurrentZone,
  createZone,
  updateZone,
  deleteZone,
  getBeaconIdsByMacs
};