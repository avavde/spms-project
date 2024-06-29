import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CModal, CModalHeader, CModalBody, CProgress, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const DispatchControl = () => {
  const [modal, setModal] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);

  const tasks = [
    { id: 1, name: 'Сборка объекта 1', status: 'Выполняется', progress: 50 },
    { id: 2, name: 'Сборка объекта 2', status: 'Не начато', progress: 0 },
    // дополнительные задания...
  ];

  const openModal = (task) => {
    setSelectedTask(task);
    setModal(true);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Отчет по зидачам для участка 2</CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Название задания</CTableHeaderCell>
                  <CTableHeaderCell>Статус</CTableHeaderCell>
                  <CTableHeaderCell>Прогресс</CTableHeaderCell>
                  <CTableHeaderCell>Действия</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {tasks.map((task) => (
                  <CTableRow key={task.id}>
                    <CTableDataCell>{task.name}</CTableDataCell>
                    <CTableDataCell>{task.status}</CTableDataCell>
                    <CTableDataCell><CProgress value={task.progress} /></CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => openModal(task)}>Детали</CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader>Детали задания</CModalHeader>
        <CModalBody>
          {selectedTask && (
            <div>
              <h5>{selectedTask.name}</h5>
              <p>Статус: {selectedTask.status}</p>
              <p>Прогресс: {selectedTask.progress}%</p>
            </div>
          )}
        </CModalBody>
      </CModal>
    </CRow>
  );
};

export default DispatchControl;
