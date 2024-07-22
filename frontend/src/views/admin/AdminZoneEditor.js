import React, { useEffect, useState } from 'react';
import zonesService from 'src/services/zonesService';
import beaconService from 'src/services/beaconService'; // Импортируем как объект
import MapComponent from './components/MapComponent';
import ZoneFormModal from './components/ZoneFormModal';
import BeaconFormModal from './components/BeaconFormModal';
import {
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import L from 'leaflet'; // Импортируем L из библиотеки leaflet

const AdminZoneEditor = () => {
  const [zones, setZones] = useState([]);
  const [beacons, setBeacons] = useState([]);
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
      const data = await zonesService.getAllZones();
      setZones(data);
      console.log('Зоны загружены:', data); // Лог загруженных зон
    } catch (error) {
      console.error('Ошибка при получении зон:', error);
    }
  };

  const fetchBeacons = async () => {
    try {
      const data = await beaconService.getAllBeacons(); // Используем методы объекта beaconService
      setBeacons(data);
      console.log('Маяки загружены:', data); // Лог загруженных маяков
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
    if (!zone) {
      console.error('Ошибка: зона не найдена');
      return;
    }

    console.log(`Редактирование зоны с ID: ${zone.id}`, zone); // Логирование ID зоны и информации о ней

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
      if (!zoneId) {
        console.error('ID зоны не определен');
        return;
      }
      try {
        console.log(`Удаление зоны с ID: ${zoneId}`);
        await zonesService.deleteZone(zoneId);
        setZones((prevZones) => prevZones.filter((zone) => zone.id !== zoneId));
        fetchBeacons(); // обновляем список маяков после удаления зоны
      } catch (error) {
        console.error('Ошибка при удалении зоны:', error);
      }
    });
  };

  const handleSaveZone = async (zone) => {
    try {
      console.log(`Сохранение зоны с ID: ${zone.id}`, zone); // Логирование ID зоны и информации о ней
      if (zone.id) {
        const updatedZone = await zonesService.updateZone(zone.id, zone);
        console.log(`Обновленная зона: ${JSON.stringify(updatedZone)}`);
        setZones((prevZones) => prevZones.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
      } else {
        const newZone = await zonesService.createZone(zone);
        console.log(`Созданная зона: ${JSON.stringify(newZone)}`);
        setZones((prevZones) => [...prevZones, newZone]);
      }
      fetchBeacons(); // обновляем список маяков после изменения зоны
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
      await beaconService.updateBeaconCoordinates(beacon_mac, formattedCoords); // Используем методы объекта beaconService
      fetchBeacons(); // обновляем список маяков после изменения координат
    } catch (error) {
      console.error('Ошибка при обновлении координат маяка:', error);
    }
  };

  const handleDeleteBeacon = async (beacon_mac) => {
    try {
      console.log(`Deleting beacon with beacon_mac: ${beacon_mac}`);
      await beaconService.deleteBeacon(beacon_mac); // Используем методы объекта beaconService
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
        await beaconService.updateBeaconCoordinates(beacon_mac, formattedCoords); // Corrected format
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
            availableBeacons={beacons}
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
          availableBeacons={beacons}
          onSave={handleSaveZone}
          onDelete={(zoneId) => handleDeleteZone(new L.LayerGroup([L.polygon(currentZone.coordinates, { id: zoneId })]))}
          onClose={() => setZoneModalVisible(false)}
        />
      )}
      {beaconModalVisible && (
        <BeaconFormModal
          visible={beaconModalVisible}
          availableBeacons={beacons}
          onSave={handleSaveBeacon}
          onClose={() => setBeaconModalVisible(false)}
        />
      )}
    </>
  );
};

export default AdminZoneEditor;
