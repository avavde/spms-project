import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch all zones
const getAllZones = async () => {
  try {
    const response = await axios.get(`${API_URL}/zones`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    throw error;
  }
};

// Create a new zone
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

// Update an existing zone
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

// Delete a zone
const deleteZone = async (id) => {
  try {
    await axios.delete(`${API_URL}/zones/${id}`);
  } catch (error) {
    console.error(`Ошибка при удалении зоны с ID: ${id}`, error);
    throw error;
  }
};

// Get the current zone for a specific employee
const getCurrentZone = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/zones/current/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении текущей зоны для employeeId: ${employeeId}`, error);
    throw error;
  }
};

// New function to get beacon IDs by their MAC addresses
const getBeaconIdsByMacs = async (beaconMacs) => {
  try {
    const response = await axios.get(`${API_URL}/beacons`, {
      params: { beacon_macs: beaconMacs }
    });
    return response.data.map(beacon => beacon.id);
  } catch (error) {
    console.error('Ошибка при получении beacon IDs по MAC адресам:', error);
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
