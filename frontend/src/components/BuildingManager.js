import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CButton, CContainer, CRow, CCol,
  CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter, CListGroup, CListGroupItem, CFormSelect, CModalTitle
} from '@coreui/react';
import buildingsAndPlansService from '../services/buildingsAndPlansService';
import LeafletMap from './LeafletMap';

const BuildingManager = () => {
  const [buildings, setBuildings] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [newBuilding, setNewBuilding] = useState({ name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' }, floorPlans: [] });
  const [newFloorPlan, setNewFloorPlan] = useState({ name: '', file: null, building_id: '' });
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);

  useEffect(() => {
    loadBuildings();
    loadUnassignedFloorPlans();
  }, []);

  const loadBuildings = async () => {
    try {
      const response = await buildingsAndPlansService.getBuildings();
      console.log('Buildings loaded:', response.data);
      setBuildings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки зданий:', error);
    }
  };

  const loadUnassignedFloorPlans = async () => {
    try {
      const response = await buildingsAndPlansService.getUnassignedFloorPlans();
      console.log('Unassigned floor plans loaded:', response.data);
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Ошибка загрузки планов этажей:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuilding({ ...newBuilding, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (const option of options) {
      if (option.selected) {
        value.push(option.value);
      }
    }
    setNewBuilding({ ...newBuilding, floorPlans: value });
  };

  const handleFloorPlanInputChange = (e) => {
    const { name, value } = e.target;
    setNewFloorPlan({ ...newFloorPlan, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewFloorPlan({ ...newFloorPlan, file: e.target.files[0] });
  };

  const handleCreateBuilding = async () => {
    try {
      await buildingsAndPlansService.createBuilding(newBuilding);
      loadBuildings();
      setIsBuildingModalOpen(false);
    } catch (error) {
      console.error('Ошибка создания здания:', error);
    }
  };

  const handleEditBuilding = (building) => {
    setCurrentBuilding(building);
    setNewBuilding(building);
    setIsBuildingModalOpen(true);
  };

  const handleUpdateBuilding = async () => {
    try {
      await buildingsAndPlansService.updateBuilding(currentBuilding.id, newBuilding);
      loadBuildings();
      setIsBuildingModalOpen(false);
      setCurrentBuilding(null);
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

  const handleCreateFloorPlan = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newFloorPlan.name);
      formData.append('file', newFloorPlan.file, newFloorPlan.file.name); // Явно указываем имя файла
      formData.append('building_id', newFloorPlan.building_id);
  
      console.log('Form data before sending:', {
        name: newFloorPlan.name,
        file: newFloorPlan.file,
        building_id: newFloorPlan.building_id
      });
  
      const response = await buildingsAndPlansService.createFloorPlan(formData);
      console.log('Floor plan created:', response.data);
      loadUnassignedFloorPlans();
      setIsFloorPlanModalOpen(false);
    } catch (error) {
      console.error('Ошибка создания плана этажа:', error);
    }
  };
  

  const handleViewFloorPlan = (plans) => {
    if (plans && plans.length > 0) {
      setSelectedFloorPlan(plans[0]);
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
              <div>
                <CButton color="primary" onClick={() => setIsBuildingModalOpen(true)}>Добавить здание</CButton>
                <CButton color="primary" onClick={() => setIsFloorPlanModalOpen(true)} className="ms-2">Создать план этажа</CButton>
              </div>
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

      <CModal alignment="center" backdrop="static" keyboard={false} visible={isBuildingModalOpen} onClose={() => setIsBuildingModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>{currentBuilding ? 'Редактировать здание' : 'Добавить здание'}</CModalTitle>
        </CModalHeader>
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
                <CFormLabel htmlFor="floorPlans">Прикрепить существующий план</CFormLabel>
                <CFormSelect multiple id="floorPlans" name="floorPlans" value={newBuilding.floorPlans} onChange={handleSelectChange}>
                  {floorPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsBuildingModalOpen(false)}>Отмена</CButton>
          <CButton color="primary" onClick={currentBuilding ? handleUpdateBuilding : handleCreateBuilding}>
           ```javascript
            {currentBuilding ? 'Сохранить изменения' : 'Добавить'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal alignment="center" backdrop="static" keyboard={false} visible={isFloorPlanModalOpen} onClose={() => setIsFloorPlanModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>{'Создать план этажа'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="planName">Название плана</CFormLabel>
                <CFormInput id="planName" name="name" value={newFloorPlan.name} onChange={handleFloorPlanInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="planFile">Загрузить файл плана (JSON или SVG)</CFormLabel>
                <input type="file" id="planFile" onChange={handleFileChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="buildingSelect">Связать с существующим зданием</CFormLabel>
                <CFormSelect id="buildingSelect" name="building_id" value={newFloorPlan.building_id} onChange={handleFloorPlanInputChange}>
                  <option value="">Выберите здание</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>{building.name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsFloorPlanModalOpen(false)}>Отмена</CButton>
          <CButton color="primary" onClick={handleCreateFloorPlan}>Добавить</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={!!selectedFloorPlan} onClose={() => setSelectedFloorPlan(null)}>
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
