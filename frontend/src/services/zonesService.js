import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
    const response = await axios.post(`${API_URL}/zones`, zone);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании зоны:', error);
    throw error;
  }
};

const updateZone = async (id, zone) => {
  try {
    // Fetch beacons by MAC addresses to get their IDs
    const beaconsResponse = await axios.get(`${API_URL}/beacons`, {
      params: { beacon_macs: zone.beacons }
    });
    const beaconIds = beaconsResponse.data.map(beacon => beacon.id);
    
    // Update the zone with the beacon IDs
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
};
