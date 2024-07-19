const { Building, FloorPlans } = require('../models');


exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    console.error('Ошибка при получении зданий:', error);
    res.status(500).json({ error: 'Ошибка при получении зданий' });
  }
};

exports.getBuildingById = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }
    res.json(building);
  } catch (error) {
    console.error('Ошибка при получении здания:', error);
    res.status(500).json({ error: 'Ошибка при получении здания' });
  }
};

exports.createBuilding = async (req, res) => {
  try {
    const { name, gps_coordinates, dimensions } = req.body;
    const newBuilding = await Building.create({ name, gps_coordinates, dimensions });
    res.status(201).json(newBuilding);
  } catch (error) {
    console.error('Ошибка при создании здания:', error);
    res.status(500).json({ error: 'Ошибка при создании здания' });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const { name, gps_coordinates, dimensions } = req.body;
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }
    await building.update({ name, gps_coordinates, dimensions });
    res.json(building);
  } catch (error) {
    console.error('Ошибка при обновлении здания:', error);
    res.status(500).json({ error: 'Ошибка при обновлении здания' });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }
    await building.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении здания:', error);
    res.status(500).json({ error: 'Ошибка при удалении здания' });
  }
};

exports.getFloorsForBuilding = async (req, res) => {
  try {
    const floors = await FloorPlan.findAll({ where: { building_id: req.params.id } });
    res.json(floors);
  } catch (error) {
    console.error('Ошибка при получении этажей здания:', error);
    res.status(500).json({ error: 'Ошибка при получении этажей здания' });
  }
};
