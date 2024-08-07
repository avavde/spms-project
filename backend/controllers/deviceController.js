const { Device } = require('../models'); // Импортируем Device из index.js

// Получение всех устройств
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении устройств' });
  }
};

// Получение устройства по ID
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (device) {
      res.json(device);
    } else {
      res.status(404).json({ error: 'Устройство не найдено' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении устройства' });
  }
};

// Создание нового устройства
exports.createDevice = async (req, res) => {
  try {
    const newDevice = await Device.create(req.body);
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании устройства' });
  }
};

// Обновление устройства
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (device) {
      await device.update(req.body);
      res.json(device);
    } else {
      res.status(404).json({ error: 'Устройство не найдено' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при обновлении устройства' });
  }
};

// Удаление устройства
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (device) {
      await device.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Устройство не найдено' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении устройства' });
  }
};

// Получение доступных маяков
exports.getAvailableBeacons = async (req, res) => {
  try {
    const beacons = await Device.findAll({ where: { devicetype: 'beacon' } });
    res.json(beacons);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении доступных маяков' });
  }
};

// Получение доступных меток
exports.getAvailableBadges = async (req, res) => {
  try {
    const beacons = await Device.findAll({ where: { devicetype: 'badge' } });
    res.json(beacons);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении доступных меток.' });
  }
};
