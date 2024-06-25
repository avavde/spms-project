const DeviceZonePosition = require('../models/DeviceZonePosition');

// Создание новой записи
exports.createDeviceZonePosition = async (req, res) => {
  try {
    const deviceZonePosition = await DeviceZonePosition.create(req.body);
    res.status(201).json(deviceZonePosition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение всех записей
exports.getAllDeviceZonePositions = async (req, res) => {
  try {
    const deviceZonePositions = await DeviceZonePosition.findAll();
    res.status(200).json(deviceZonePositions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение записи по ID
exports.getDeviceZonePositionById = async (req, res) => {
  try {
    const deviceZonePosition = await DeviceZonePosition.findByPk(req.params.id);
    if (!deviceZonePosition) {
      return res.status(404).json({ error: 'DeviceZonePosition not found' });
    }
    res.status(200).json(deviceZonePosition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновление записи
exports.updateDeviceZonePosition = async (req, res) => {
  try {
    const [updated] = await DeviceZonePosition.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'DeviceZonePosition not found' });
    }
    const updatedDeviceZonePosition = await DeviceZonePosition.findByPk(req.params.id);
    res.status(200).json(updatedDeviceZonePosition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удаление записи
exports.deleteDeviceZonePosition = async (req, res) => {
  try {
    const deleted = await DeviceZonePosition.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'DeviceZonePosition not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
