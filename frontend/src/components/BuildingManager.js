import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CButton, CContainer, CRow, CCol, 
  CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter, 
  CListGroup, CListGroupItem, CFormCheck 
} from '@coreui/react';
import buildingsAndPlansService from '../services/buildingsAndPlansService';

const BuildingManager = () => {
  const [buildings, setBuildings] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ 
    name: '', address: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } 
  });
  const [floorPlans, setFloorPlans] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedFloorPlans, setSelectedFloorPlans] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);

  useEffect(() => {
    loadBuildings();
    loadFloorPlans();
    loadZones();
  }, []);

  const loadBuildings = async () => {
    try {
      const response = await buildingsAndPlansService.getBuildings();
      setBuildings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки зданий:', error);
    }
  };

  const loadFloorPlans = async () => {
    try {
      const response = await buildingsAndPlansService.getFloorPlans();
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Ошибка загрузки планов этажей:', error);
    }
  };

  const loadZones = async () => {
    try {
      const response = await buildingsAndPlansService.getZones();
      setZones(response.data);
    } catch (error) {
      console.error('Ошибка загрузки зон:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    if (nameParts.length === 2) {
      setNewBuilding((prevState) => ({
        ...prevState,
        [nameParts[0]]: {
          ...prevState[nameParts[0]],
          [nameParts[1]]: value
        }
      }));
    } else {
      setNewBuilding({ ...newBuilding, [name]: value });
    }
  };

  const handleCreateBuilding = async () => {
    try {
      await buildingsAndPlansService.createBuilding({ ...newBuilding, floorPlans: selectedFloorPlans, zones: selectedZones });
      loadBuildings();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания здания:', error);
    }
  };

  const handleEditBuilding = (building) => {
    setCurrentBuilding(building);
    setNewBuilding(building);
    setSelectedFloorPlans(building.floorPlans || []);
    setSelectedZones(building.zones || []);
    setIsModalOpen(true);
  };

  const handleUpdateBuilding = async () => {
    try {
      await buildingsAndPlansService.updateBuilding(currentBuilding.id, { ...newBuilding, floorPlans: selectedFloorPlans, zones: selectedZones });
      loadBuildings();
      setIsModalOpen(false);
      setCurrentBuilding(null);
      resetForm();
    } catch (error) {
      console.error('Ошибка обновления здания:', error);
    }
  };

  const handleDeleteBuilding = async (id) => {
    try {
      await buildingsAndPlansService.deleteBuilding(id);
      loadBuildings();
    } catch (error) {
      console.error('Ошибка удаления здания:', error);
    }
  };

  const resetForm = () => {
    setNewBuilding({ name: '', address: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } });
    setSelectedFloorPlans([]);
    setSelectedZones([]);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) resetForm();
  };

  const handleFloorPlanChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFloorPlans((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((id) => id !== parseInt(value))
    );
  };

  const handleZoneChange = (e) => {
    const { value, checked } = e.target;
    setSelectedZones((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((id) => id !== parseInt(value))
    );
  };

  return (
    <CContainer>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <span>Управление зданиями</span>
              <CButton color="primary" onClick={toggleModal}>Добавить здание</CButton>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                {buildings.map((building) => (
                  <CListGroupItem key={building.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{building.name}</h5>
                      <p>{building.address}</p>
                    </div>
                    <div>
                      <CButton color="info" className="me-2" onClick={() => handleEditBuilding(building)}>Редактировать</CButton>
                      <CButton color="danger" onClick={() => handleDeleteBuilding(building.id)}>Удалить</CButton>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={isModalOpen} onClose={toggleModal}>
        <CModalHeader>{currentBuilding ? 'Редактировать здание' : 'Добавить здание'}</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="name">Название</CFormLabel>
                <CFormInput id="name" name="name" value={newBuilding.name} onChange={handleInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="address">Адрес</CFormLabel>
                <CFormInput id="address" name="address" value={newBuilding.address} onChange={handleInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel htmlFor="gps_coordinates.lat">GPS широта</CFormLabel>
                <CFormInput id="gps_coordinates.lat" name="gps_coordinates.lat" value={newBuilding.gps_coordinates.lat} onChange={handleInputChange} />
              </CCol>
              <CCol md="6">
                <CFormLabel htmlFor="gps_coordinates.lng">GPS долгота</CFormLabel>
                <CFormInput id="gps_coordinates.lng" name="gps_coordinates.lng" value={newBuilding.gps_coordinates.lng} onChange={handleInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel htmlFor="dimensions.width">Ширина</CFormLabel>
                <CFormInput id="dimensions.width" name="dimensions.width" value={newBuilding.dimensions.width} onChange={handleInputChange} />
              </CCol>
              <CCol md="6">
                <CFormLabel htmlFor="dimensions.height">Высота</CFormLabel>
                <CFormInput id="dimensions.height" name="dimensions.height" value={newBuilding.dimensions.height} onChange={handleInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="floorPlans">Планы этажей</CFormLabel>
                {floorPlans.map((plan) => (
                  <CFormCheck 
                    key={plan.id} 
                    id={`floorPlan-${plan.id}`} 
                    value={plan.id} 
                    label={plan.name} 
                    checked={selectedFloorPlans.includes(plan.id)}
                    onChange={handleFloorPlanChange}
                  />
                ))}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="zones">Зоны</CFormLabel>
                {zones.map((zone) => (
                  <CFormCheck 
                    key={zone.id} 
                    id={`zone-${zone.id}`} 
                    value={zone.id} 
                    label={zone.name} 
                    checked={selectedZones.includes(zone.id)}
                    onChange={handleZoneChange}
                  />
                ))}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleModal}>Отмена</CButton>
          <CButton color="primary" onClick={currentBuilding ? handleUpdateBuilding : handleCreateBuilding}>
            {currentBuilding ? 'Сохранить изменения' : 'Добавить'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default BuildingManager;
