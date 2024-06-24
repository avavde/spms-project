import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';  // Импортируем изображение плана помещения
import 'leaflet-draw';
import drawLocales from 'leaflet-draw-locales';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
} from '@coreui/react';

const imageBounds = [[0, 0], [1000, 1000]]; // Пример координат для изображения

// Устанавливаем язык для leaflet-draw
drawLocales('ru');

const AdminZoneEditor = () => {
  const [modal, setModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [zoneBeacons, setZoneBeacons] = useState('');
  const [currentLayer, setCurrentLayer] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);
  const [zones, setZones] = useState([]); // Добавляем состояние для зон

  useEffect(() => {
    const map = L.map('map', {
      crs: L.CRS.Simple, // Используем простую систему координат
    }).setView([500, 500], 2);

    L.imageOverlay(plan, imageBounds).addTo(map);

    const items = new L.FeatureGroup();
    map.addLayer(items);
    setDrawnItems(items);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: items,
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      setCurrentLayer(layer);
      setModal(true);
    });
  }, []);

  const getColorByZoneType = (type) => {
    switch (type) {
      case 'Обычная':
        return 'blue';
      case 'Контроль':
        return 'green';
      case 'Предупреждение':
        return 'orange';
      case 'Опасная':
        return 'red';
      default:
        return 'black';
    }
  };

  const handleSaveZone = () => {
    if (currentLayer) {
      const color = getColorByZoneType(zoneType);
      currentLayer.setStyle({ color, fillColor: color, fillOpacity: 0.5 });
      currentLayer.bindPopup(`<b>${zoneName}</b><br>${zoneType}`).openPopup();
      if (drawnItems) {
        drawnItems.addLayer(currentLayer); // Добавляем слой обратно в группу drawnItems
      }

      // Сохраняем данные о зоне
      const newZone = {
        id: Date.now(),
        name: zoneName,
        type: zoneType,
        coordinates: currentLayer.getLatLngs(),
        beacons: zoneBeacons.split(',').map(beacon => beacon.trim()),
      };
      setZones([...zones, newZone]); // Обновляем состояние зон
      console.log({ zones });

      // Здесь можно сохранить данные о зоне в состояние или отправить на сервер
      console.log({ zoneName, zoneType, zoneBeacons });
    }
    setModal(false);
    setZoneName('');
    setZoneType('');
    setZoneBeacons('');
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Редактор зон
        </CCardHeader>
        <CCardBody>
          <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </CCardBody>
      </CCard>

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>
          <CModalTitle>Добавить зону</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="zoneName">Название зоны</CFormLabel>
              <CFormInput id="zoneName" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="zoneType">Тип зоны</CFormLabel>
              <CFormSelect id="zoneType" value={zoneType} onChange={(e) => setZoneType(e.target.value)}>
                <option value="Обычная">Обычная</option>
                <option value="Контроль">Зона контроля</option>
                <option value="Предупреждение">Зона предупреждения</option>
                <option value="Опасная">Опасная зона</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="zoneBeacons">Маяки (через запятую)</CFormLabel>
              <CFormInput id="zoneBeacons" value={zoneBeacons} onChange={(e) => setZoneBeacons(e.target.value)} />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveZone}>Сохранить</CButton>
          <CButton color="secondary" onClick={() => setModal(false)}>Отмена</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AdminZoneEditor;
