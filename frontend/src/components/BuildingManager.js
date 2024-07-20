import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CButton, CContainer, CRow, CCol, 
  CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter, 
  CListGroup, CListGroupItem, CFormCheck, CFormSelect 
} from '@coreui/react';
import buildingsAndPlansService from '../services/buildingsAndPlansService';
import LeafletMap from './LeafletMap';

const BuildingManager = () => {
  const [buildings, setBuildings] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [isBuildingFloorPlanModalOpen, setIsBuildingFloorPlanModalOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ 
    name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } 
  });
  const [newFloorPlan, setNewFloorPlan] = useState({ name: '', building_id: '' });
  const [zones, setZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedFloorPlans, setSelectedFloorPlans] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [unassignedFloorPlans, setUnassignedFloorPlans] = useState([]);

  useEffect(() => {
    loadBuildings();
    loadZones();
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

  const loadZones = async () => {
    try {
      const response = await buildingsAndPlansService.getZones();
      console.log('Zones loaded:', response.data);
      setZones(response.data);
    } catch (error) {
      console.error('Ошибка загрузки зон:', error);
    }
  };

  const loadUnassignedFloorPlans = async () => {
    try {
      const response = await buildingsAndPlansService.getUnassignedFloorPlans();
      console.log('Unassigned Floor Plans loaded:', response.data);
      setUnassignedFloorPlans(response.data);
    } catch (error) {
      console.error('Ошибка загрузки независящих планов этажей:', error);
    }
  };

  const handleInputChange = (e, setStateFunction) => {
    const { name, value } = e.target;
    setStateFunction((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    setUploadedFile(e.target.files[0]);
  };

  const handleCreateBuilding = async () => {
    try {
      const response = await buildingsAndPlansService.createBuilding(newBuilding);
      if (selectedFloorPlans.length > 0) {
        for (const planId of selectedFloorPlans) {
          await buildingsAndPlansService.updateFloorPlan(planId, { building_id: response.data.id });
        }
      }
      loadBuildings();
      setIsBuildingModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания здания:', error);
    }
  };

  const handleEditBuilding = (building) => {
    console.log('Editing building:', building);
    setCurrentBuilding(building);
    setNewBuilding(building);
    setSelectedZones(building.zones || []);
    setSelectedFloorPlans(building.floorPlans ? building.floorPlans.map(plan => plan.id) : []);
    setIsBuildingModalOpen(true);
  };

  const handleUpdateBuilding = async () => {
    try {
      await buildingsAndPlansService.updateBuilding(currentBuilding.id, newBuilding);
      if (selectedFloorPlans.length > 0) {
        for (const planId of selectedFloorPlans) {
          await buildingsAndPlansService.updateFloorPlan(planId, { building_id: currentBuilding.id });
        }
      }
      loadBuildings();
      setIsBuildingModalOpen(false);
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

  const handleCreateFloorPlan = async () => {
    try {
      const formData = new FormData();
      for (const key in newFloorPlan) {
        formData.append(key, newFloorPlan[key]);
      }
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }
      await buildingsAndPlansService.createFloorPlan(formData);
      loadUnassignedFloorPlans();
      setIsFloorPlanModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания плана этажа:', error);
    }
  };

  const handleUpdateFloorPlan = async () => {
    try {
      const formData = new FormData();
      for (const key in newFloorPlan) {
        formData.append(key, newFloorPlan[key]);
      }
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }
      await buildingsAndPlansService.updateFloorPlan(newFloorPlan.id, formData);
      loadUnassignedFloorPlans();
      setIsFloorPlanModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка обновления плана этажа:', error);
    }
  };

  const handleDeleteFloorPlan = async (id) => {
    try {
      await buildingsAndPlansService.deleteFloorPlan(id);
      loadUnassignedFloorPlans();
    } catch (error) {
      console.error('Ошибка удаления плана этажа:', error);
    }
  };

  const resetForm = () => {
    setNewBuilding({ name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } });
    setNewFloorPlan({ name: '', building_id: '' });
    setSelectedZones([]);
    setSelectedFloorPlans([]);
    setUploadedFile(null);
  };

  const toggleBuildingModal = () => {
    setIsBuildingModalOpen(!isBuildingModalOpen);
    if (isBuildingModalOpen) resetForm();
  };

  const toggleFloorPlanModal = () => {
    setIsFloorPlanModalOpen(!isFloorPlanModalOpen);
    if (isFloorPlanModalOpen) resetForm();
  };

  const handleZoneChange = (e) => {
    const { value, checked } = e.target;
    setSelectedZones((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((id) => id !== parseInt(value))
    );
  };

  const handleFloorPlanSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedFloorPlans((prev) => 
      checked ? [...prev, parseInt(value)] : prev.filter((id) => id !== parseInt(value))
    );
  };

  const handleViewFloorPlan = (plans) => {
    if (plans && plans.length > 0) {
      setSelectedFloorPlan(plans[0]);
      setIsBuildingFloorPlanModalOpen(true);
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
                <CButton color="primary" className="me-2" onClick={toggleBuildingModal}>Добавить здание</CButton>
                <CButton color="secondary" onClick={toggleFloorPlanModal}>Добавить план этажа</CButton>
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

      <CModal visible={isBuildingModalOpen} onClose={toggleBuildingModal}>
        <CModalHeader>{currentBuilding ? 'Редактировать здание' : 'Добавить здание'}</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="name">Название</CFormLabel>
                <CFormInput id="name" name="name" value={newBuilding.name} onChange={(e) => handleInputChange(e, setNewBuilding)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel htmlFor="gps_coordinates.lat">GPS широта</CFormLabel>
                <CFormInput id="gps_coordinates.lat" name="gps_coordinates.lat" value={newBuilding.gps_coordinates.lat} onChange={(e) => handleInputChange(e, setNewBuilding)} />
              </CCol>
              <CCol md="6">
                <CFormLabel htmlFor="gps_coordinates.lng">GPS долгота</CFormLabel>
                <CFormInput id="gps_coordinates.lng" name="gps_coordinates.lng" value={newBuilding.gps_coordinates.lng} onChange={(e) => handleInputChange(e, setNewBuilding)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel htmlFor="dimensions.width">Ширина</CFormLabel>
                <CFormInput id="dimensions.width" name="dimensions.width" value={newBuilding.dimensions.width} onChange={(e) => handleInputChange(e, setNewBuilding)} />
              </CCol>
              <CCol md="6">
                <CFormLabel htmlFor="dimensions.height">Высота</CFormLabel>
                <CFormInput id="dimensions.height" name="dimensions.height" value={newBuilding.dimensions.height} onChange={(e) => handleInputChange(e, setNewBuilding)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="floorPlans">Привязать план этажа</CFormLabel>
                {unassignedFloorPlans.map((plan) => (
                  <CFormCheck 
                    key={plan.id} 
                    id={`plan-${plan.id}`} 
                    value={plan.id} 
                    label={plan.name} 
                    checked={selectedFloorPlans.includes(plan.id)}
                    onChange={handleFloorPlanSelection}
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
          <CButton color="secondary" onClick={toggleBuildingModal}>Отмена</CButton>
          <CButton color="primary" onClick={currentBuilding ? handleUpdateBuilding : handleCreateBuilding}>
            {currentBuilding ? 'Сохранить изменения' : 'Добавить'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={isFloorPlanModalOpen} onClose={toggleFloorPlanModal}>
        <CModalHeader>{selectedFloorPlan ? 'Редактировать план этажа' : 'Добавить план этажа'}</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="name">Название</CFormLabel>
                <CFormInput id="name" name="name" value={newFloorPlan.name} onChange={(e) => handleInputChange(e, setNewFloorPlan)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="file">Загрузить файл плана этажа (SVG, PNG, JPG)</CFormLabel>
                <input type="file" id="file" onChange={handleFileChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="building">Привязать к зданию</CFormLabel>
                {buildings.map((building) => (
                  <CFormCheck 
                    key={building.id} 
                    id={`building-${building.id}`} 
                    value={building.id} 
                    label={building.name} 
                    checked={newFloorPlan.building_id == building.id}
                    onChange={(e) => setNewFloorPlan((prev) => ({ ...prev, building_id: e.target.value }))}
                  />
                ))}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleFloorPlanModal}>Отмена</CButton>
          <CButton color="primary" onClick={selectedFloorPlan ? handleUpdateFloorPlan : handleCreateFloorPlan}>
            {selectedFloorPlan ? 'Сохранить изменения' : 'Добавить'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={isBuildingFloorPlanModalOpen} onClose={() => setIsBuildingFloorPlanModalOpen(false)}>
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
