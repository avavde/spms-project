
const { Zone, Department, Beacon } = require('../models');
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    res.status(500).json({ error: 'Ошибка при получении зон' });
  }
};

exports.getZoneById = async (req, res) => {
  try {
    console.log(`Запрос на получение зоны с ID: ${req.params.id}`);
    const zone = await Zone.findByPk(req.params.id, {
      include: [
        { model: Department },
        { model: Beacon },
      ],
    });
    if (!zone) {
      console.log(`Зона с ID ${req.params.id} не найдена`);
      return res.status(404).json({ error: 'Зона не найдена' });
    }
    console.log(`Найдена зона: ${JSON.stringify(zone)}`);
    res.json(zone);
  } catch (error) {
    console.error('Ошибка при получении зоны:', error);
    res.status(500).json({ error: 'Ошибка при получении зоны' });
  }
};

exports.createZone = async (req, res) => {
  try {
    const { name, coordinates, beacons, type, department_id } = req.body;
    console.log('Создание новой зоны с данными:', { name, coordinates, beacons, type, department_id });
    const newZone = await Zone.create({ name, coordinates, beacons, type, department_id });
    res.status(201).json(newZone);
  } catch (error) {
    console.error('Ошибка при создании зоны:', error);
    res.status(500).json({ error: 'Ошибка при создании зоны' });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const { name, coordinates, beacons, type, department_id } = req.body;
    console.log(`Запрос на обновление зоны с ID ${req.params.id} данными:`, { name, coordinates, beacons, type, department_id });
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      console.log(`Зона с ID ${req.params.id} не найдена`);
      return res.status(404).json({ error: 'Зона не найдена' });
    }
    await zone.update({ name, coordinates, beacons, type, department_id });
    console.log(`Обновленная зона: ${JSON.stringify(zone)}`);
    res.json(zone);
  } catch (error) {
    console.error('Ошибка при обновлении зоны:', error);
    res.status(500).json({ error: 'Ошибка при обновлении зоны' });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    console.log('Запрос на удаление зоны с ID:', req.params.id);
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      console.log('Зона с указанным ID не найдена');
      return res.status(404).json({ error: 'Зона не найдена' });
    }

    // Логирование связанных данных перед удалением
    const relatedBeacons = await Beacon.findAll({ where: { zone_id: req.params.id } });
    console.log(`Маяки, связанные с зоной: ${JSON.stringify(relatedBeacons)}`);

    // Удаление связанных данных, если необходимо
    for (let beacon of relatedBeacons) {
      await beacon.destroy();
    }

    await zone.destroy();
    console.log('Зона удалена');
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении зоны:', error);
    res.status(500).json({ error: 'Ошибка при удалении зоны' });
  }
};