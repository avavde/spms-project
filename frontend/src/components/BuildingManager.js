import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CButton, CContainer, CRow, CCol, 
  CForm, CFormInput, CFormLabel, CModal, CModalHeader, CModalBody, CModalFooter, 
  CListGroup, CListGroupItem, CFormCheck 
} from '@coreui/react';
import buildingsAndPlansService from '../services/buildingsAndPlansService';
import LeafletMap from './LeafletMap';

const BuildingManager = () => {
  const [buildings, setBuildings] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ 
    name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } 
  });
  const [newFloorPlan, setNewFloorPlan] = useState({
    name: '', building_id: '', file: null
  });
  const [zones, setZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

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
      console.log('Unassigned floor plans loaded:', response.data);
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Ошибка загрузки незакрепленных планов:', error);
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
    console.log('File selected:', e.target.files[0]);
    setUploadedFile(e.target.files[0]);
  };

  const handleCreateBuilding = async () => {
    try {
      const response = await buildingsAndPlansService.createBuilding(newBuilding);
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('building_id', response.data.id);
        formData.append('name', 'Default Plan'); // or another logic to set the name
        formData.append('file', uploadedFile);
        console.log('Form data with file:', formData);
        await buildingsAndPlansService.createFloorPlan(formData);
      }
      loadBuildings();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания здания:', error);
    }
  };

  const handleCreateFloorPlan = async () => {
    try {
      const formData = new FormData();
      formData.append('building_id', newFloorPlan.building_id);
      formData.append('name', newFloorPlan.name);
      formData.append('file', newFloorPlan.file);
      console.log('Form data with file:', formData);
      await buildingsAndPlansService.createFloorPlan(formData);
      loadUnassignedFloorPlans();
      setIsFloorPlanModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания плана этажа:', error);
    }
  };

  const handleEditBuilding = (building) => {
    console.log('Editing building:', building);
    setCurrentBuilding(building);
    setNewBuilding(building);
    setSelectedZones(building.zones || []);
    setIsModalOpen(true);
  };

  const handleUpdateBuilding = async () => {
    try {
      await buildingsAndPlansService.updateBuilding(currentBuilding.id, newBuilding);
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('building_id', currentBuilding.id);
        formData.append('name', 'Updated Plan'); // or another logic to set the name
        formData.append('file', uploadedFile);
        console.log('Form data with file:', formData);

        if (currentBuilding.floorPlans && currentBuilding.floorPlans.length > 0) {
          const floorPlanId = currentBuilding.floorPlans[0].id;
          await buildingsAndPlansService.updateFloorPlan(floorPlanId, formData);
        } else {
          await buildingsAndPlansService.createFloorPlan(formData);
        }
      }
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

  const handleDeleteFloorPlan = async (id) => {
    try {
      await buildingsAndPlansService.deleteFloorPlan(id);
      loadUnassignedFloorPlans();
    } catch (error) {
      console.error('Ошибка удаления плана этажа:', error);
    }
  };

  const handleBuildingFloorPlanChange = (buildingId, floorPlanId, checked) => {
    if (checked) {
      buildingsAndPlansService.updateFloorPlan(floorPlanId, { building_id: buildingId });
    } else {
      buildingsAndPlansService.updateFloorPlan(floorPlanId, { building_id: null });
    }
    loadBuildings();
    loadUnassignedFloorPlans();
  };

  const resetForm = () => {
    setNewBuilding({ name: '', gps_coordinates: { lat: '', lng: '' }, dimensions: { width: '', height: '' } });
    setNewFloorPlan({ name: '', building_id: '', file: null });
    setSelectedZones([]);
    setUploadedFile(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) resetForm();
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

  const handleViewFloorPlan = (plans) => {
    if (plans && plans.length > 0) {
      setSelectedFloorPlan(plans[0]);
      setIsFloorPlanModalOpen(true);
    } else {
      alert('Планы этажей не прикреплены к этому зданию.');
    }
  };

  const handleFloorPlanInputChange = (e) => {
    const { name, value } = e.target;
    setNewFloorPlan((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFloorPlanFileChange = (e) => {
    setNewFloorPlan((prevState) => ({
      ...prevState,
      file: e.target.files[0]
    }));
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
                      <div>
                        {building.floorPlans.map(plan => (
                          <div key={plan.id}>
                            <CFormCheck 
                              type="checkbox"
                              id={`floorPlan-${plan.id}`}
                              label={plan.name}
                              checked={plan.building_id === building.id}
                              onChange={(e) => handleBuildingFloorPlanChange(building.id, plan.id, e.target.checked)}
                            />
                          </div>
                        ))}
                      </div>
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

      <CModal visible={isFloorPlanModalOpen} onClose={toggleFloorPlanModal}>
        <CModalHeader>Просмотр плана этажа</CModalHeader>
        <CModalBody>
          {selectedFloorPlan ? (
            <LeafletMap floorPlan={selectedFloorPlan} />
          ) : (
            <p>План этажа не загружен.</p>
          )}
        </CModalBody>
      </CModal>

      <CModal visible={isFloorPlanModalOpen} onClose={toggleFloorPlanModal}>
        <CModalHeader>Добавить/Редактировать план этажа</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="name">Название</CFormLabel>
                <CFormInput id="name" name="name" value={newFloorPlan.name} onChange={handleFloorPlanInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="building_id">Здание</CFormLabel>
                <CFormInput id="building_id" name="building_id" value={newFloorPlan.building_id} onChange={handleFloorPlanInputChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="file">Загрузить файл плана (JSON или SVG)</CFormLabel>
                <input type="file" id="file" onChange={handleFloorPlanFileChange} />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={toggleFloorPlanModal}>Отмена</CButton>
          <CButton color="primary" onClick={handleCreateFloorPlan}>
            {newFloorPlan.id ? 'Сохранить изменения' : 'Добавить'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default BuildingManager;
