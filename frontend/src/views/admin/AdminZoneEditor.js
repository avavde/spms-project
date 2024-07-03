import React, { useEffect, useState } from 'react';
import { getAllZones, createZone, updateZone, deleteZone } from 'src/services/zonesService';
import { getAvailableBeacons, updateBeaconCoordinates, deleteBeacon } from 'src/services/beaconService';
import MapComponent from './components/MapComponent';
import ZoneFormModal from './components/ZoneFormModal';
import BeaconFormModal from './components/BeaconFormModal';
import {
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';

const AdminZoneEditor = () => {
  const [zones, setZones] = useState([]);
  const [availableBeacons, setAvailableBeacons] = useState([]);
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [beaconModalVisible, setBeaconModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [currentBeaconCoords, setCurrentBeaconCoords] = useState(null);

  useEffect(() => {
    fetchZones();
    fetchBeacons();
  }, []);

  const fetchZones = async () => {
    try {
      const data = await getAllZones();
      setZones(data);
    } catch (error) {
      console.error('Ошибка при получении зон:', error);
    }
  };

  const fetchBeacons = async () => {
    try {
      const data = await getAvailableBeacons();
      setAvailableBeacons(data);
    } catch (error) {
      console.error('Ошибка при получении маяков:', error);
    }
  };

  const handleCreateZone = (layer) => {
    setCurrentZone({
      id: null,
      name: '',
      type: '',
      coordinates: layer.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]),
      beacons: [],
    });
    setZoneModalVisible(true);
  };

  const handleEditZone = (layer, zone) => {
    setCurrentZone({
      id: zone.id,
      name: zone.name,
      type: zone.type,
      coordinates: layer.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]),
      beacons: zone.beacons,
    });
    setZoneModalVisible(true);
  };

  const handleDeleteZone = async (layers) => {
    layers.eachLayer(async (layer) => {
      const zoneId = layer.options.id;
      try {
        await deleteZone(zoneId);
        setZones((prevZones) => prevZones.filter((zone) => zone.id !== zoneId));
      } catch (error) {
        console.error('Ошибка при удалении зоны:', error);
      }
    });
  };

  const handleSaveZone = async (zone) => {
    try {
      if (zone.id) {
        const updatedZone = await updateZone(zone.id, zone);
        setZones((prevZones) => prevZones.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
      } else {
        const newZone = await createZone(zone);
        setZones((prevZones) => [...prevZones, newZone]);
      }
    } catch (error) {
      console.error('Ошибка при сохранении зоны:', error);
    }
    setZoneModalVisible(false);
    setCurrentZone(null);
  };

  const handleCreateBeacon = (coords) => {
    setCurrentBeaconCoords(coords);
    setBeaconModalVisible(true);
  };

  const handleEditBeacon = async (coords, beacon_mac) => {
    try {
      const formattedCoords = [coords.lat, coords.lng];
      console.log(`Updating beacon coordinates for beacon_mac: ${beacon_mac} with coordinates: ${JSON.stringify(formattedCoords)}`);
      await updateBeaconCoordinates(beacon_mac, formattedCoords);
      fetchBeacons(); // обновляем список маяков после изменения координат
    } catch (error) {
      console.error('Ошибка при обновлении координат маяка:', error);
    }
  };

  const handleDeleteBeacon = async (beacon_mac) => {
    try {
      console.log(`Deleting beacon with beacon_mac: ${beacon_mac}`);
      await deleteBeacon(beacon_mac);
      fetchBeacons(); // обновляем список маяков после удаления
    } catch (error) {
      console.error('Ошибка при удалении маяка:', error);
    }
  };

  const handleSaveBeacon = async (beacon_mac) => {
    if (currentBeaconCoords) {
      const { lat, lng } = currentBeaconCoords;
      const formattedCoords = [lat, lng];
      try {
        console.log(`Updating beacon coordinates for beacon_mac: ${beacon_mac} with coordinates: ${JSON.stringify(formattedCoords)}`);
        await updateBeaconCoordinates(beacon_mac, formattedCoords); // Corrected format
        fetchBeacons(); // обновляем список маяков после изменения координат
      } catch (error) {
        console.error('Ошибка при обновлении координат маяка:', error);
      }
    }
    setBeaconModalVisible(false);
    setCurrentBeaconCoords(null);
  };

  return (
    <>
      <CCard>
        <CCardHeader>Редактор зон</CCardHeader>
        <CCardBody>
          <MapComponent
            zones={zones}
            availableBeacons={availableBeacons}
            onCreateZone={handleCreateZone}
            onEditZone={handleEditZone}
            onDeleteZone={handleDeleteZone}
            onCreateBeacon={handleCreateBeacon}
            onEditBeacon={handleEditBeacon} // Передача функции редактирования маяка
            onDeleteBeacon={handleDeleteBeacon} // Передача функции удаления маяка
          />
        </CCardBody>
      </CCard>
      {currentZone && (
        <ZoneFormModal
          visible={zoneModalVisible}
          zone={currentZone}
          availableBeacons={availableBeacons}
          onSave={handleSaveZone}
          onDelete={(zoneId) => handleDeleteZone(new L.LayerGroup([L.polygon(currentZone.coordinates, { id: zoneId })]))}
          onClose={() => setZoneModalVisible(false)}
        />
      )}
      {beaconModalVisible && (
        <BeaconFormModal
          visible={beaconModalVisible}
          availableBeacons={availableBeacons}
          onSave={handleSaveBeacon}
          onClose={() => setBeaconModalVisible(false)}
        />
      )}
    </>
  );
};

export default AdminZoneEditor;
