// src/services/beaconService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAvailableBeacons = async () => {
  try {
    const response = await axios.get(`${API_URL}/beacons/available/beacons`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении доступных маяков');
  }
};

export const createBeacon = async (beacon_mac) => {
  try {
    const response = await axios.post(`${API_URL}/beacons`, { beacon_mac });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при создании маяка');
  }
};

export const updateBeaconCoordinates = async (beacon_mac, coordinates) => {
  try {
    const response = await axios.put(`${API_URL}/beacons/${beacon_mac}`, { map_coordinates: coordinates });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при обновлении координат маяка');
  }
};

export const deleteBeacon = async (beaconId) => {
  try {
    await axios.delete(`${API_URL}/beacons/${beaconId}`);
  } catch (error) {
    throw new Error('Ошибка при удалении маяка');
  }
};
