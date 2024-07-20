import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CButton, CContainer, CRow, CCol, 
  CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter, 
  CListGroup, CListGroupItem, CFormCheck 
} from '@coreui/react';
import buildingsAndPlansService from '../services/buildingsAndPlansService';
import LeafletMap from './LeafletMap'; // Assuming LeafletMap is a component to display the map

const BuildingManager = () => {
  const [buildings, setBuildings] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ 
    name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } 
  });
  const [zones, setZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    loadBuildings();
    loadZones();
  }, []);

  const loadBuildings = async () => {
    try {
      const response = await buildingsAndPlansService.getBuildings();
      setBuildings(response.data);
      console.log('Buildings loaded:', response.data); // Debug log
    } catch (error) {
      console.error('Ошибка загрузки зданий:', error);
    }
  };

  const loadZones = async () => {
    try {
      const response = await buildingsAndPlansService.getZones();
      setZones(response.data);
      console.log('Zones loaded:', response.data); // Debug log
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

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
    console.log('File selected:', e.target.files[0]); // Debug log
  };

  const handleCreateBuilding = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newBuilding.name);
      formData.append('gps_coordinates.lat', newBuilding.gps_coordinates.lat);
      formData.append('gps_coordinates.lng', newBuilding.gps_coordinates.lng);
      formData.append('dimensions.width', newBuilding.dimensions.width);
      formData.append('dimensions.height', newBuilding.dimensions.height);
      formData.append('zones', JSON.stringify(selectedZones));
      if (uploadedFile) {
        formData.append('file', uploadedFile);
        console.log('Form data with file:', formData); // Debug log
      }

      await buildingsAndPlansService.createBuilding(formData);
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
    setSelectedZones(building.zones || []);
    setIsModalOpen(true);
    console.log('Editing building:', building); // Debug log
  };

  const handleUpdateBuilding = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newBuilding.name);
      formData.append('gps_coordinates.lat', newBuilding.gps_coordinates.lat);
      formData.append('gps_coordinates.lng', newBuilding.gps_coordinates.lng);
      formData.append('dimensions.width', newBuilding.dimensions.width);
      formData.append('dimensions.height', newBuilding.dimensions.height);
      formData.append('zones', JSON.stringify(selectedZones));
      if (uploadedFile) {
        formData.append('file', uploadedFile);
        console.log('Form data with file:', formData); // Debug log
      }

      await buildingsAndPlansService.updateBuilding(currentBuilding.id, formData);
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
      console.log('Building deleted:', id); // Debug log
    } catch (error) {
      console.error('Ошибка удаления здания:', error);
    }
  };

  const resetForm = () => {
    setNewBuilding({ name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } });
    setSelectedZones([]);
    setUploadedFile(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) resetForm();
  };

  const handleZoneChange = (e) => {
    const { value, checked } = e.target;
    setSelectedZones((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((id) => id !== parseInt(value))
    );
    console.log('Zones selected:', selectedZones); // Debug log
  };

  const handleViewFloorPlan = (plans) => {
    if (plans && plans.length > 0) {
      setSelectedFloorPlan(plans[0]);
      setIsFloorPlanModalOpen(true);
      console.log('Floor plan selected:', plans[0]); // Debug log
    } else {
      alert('Планы этажей не прикреплены к этому зданию.');
    }
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
                    </div>
                    <div>
                      <CButton color="info" className="me-2" onClick={() => handleEditBuilding(building)}>Редактировать</CButton>
                      <CButton color="danger" onClick={() => handleDeleteBuilding(building.id)}>Удалить</CButton>
                      <CButton color="primary" onClick={() => handleViewFloorPlan(building.floorPlans)}>Просмотр плана</CButton>
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
                <CFormLabel htmlFor="floorPlans">Загрузить план этажа (JSON или SVG)</CFormLabel>
                <input type="file" id="floorPlans" onChange={handleFileChange} />
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

      <CModal visible={isFloorPlanModalOpen} onClose={() => setIsFloorPlanModalOpen(false)}>
        <CModalHeader>Просмотр плана этажа</CModalHeader>
        <CModalBody>
          {selectedFloorPlan ? (
            <LeafletMap floorPlan={selectedFloorPlan} />
          ) : (
            <p>План этажа не загружен.</p>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default BuildingManager;
