
import React, { useEffect, useState } from 'react';
import { getAllZones, createZone, updateZone, deleteZone } from 'src/services/zonesService';
import { getAvailableBeacons, updateBeaconCoordinates } from 'src/services/beaconService';
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

  const handleEditBeacon = async (coords, beaconMac) => {
    try {
      await updateBeaconCoordinates(beaconMac, coords);
      fetchBeacons(); // обновляем список маяков после изменения координат
    } catch (error) {
      console.error('Ошибка при обновлении координат маяка:', error);
    }
  };

  const handleSaveBeacon = async (beaconId) => {
    if (currentBeaconCoords) {
      const { lat, lng } = currentBeaconCoords;
      try {
        await updateBeaconCoordinates(beaconId, [lat, lng]); // Corrected format
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
