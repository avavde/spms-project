const { FloorPlan, Beacon } = require('../models');


exports.getAllFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll();
    res.json(floorPlans);
  } catch (error) {
    console.error('Ошибка при получении этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении этажей' });
  }
};

exports.getFloorPlanById = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    res.json(floorPlan);
  } catch (error) {
    console.error('Ошибка при получении этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении этажа' });
  }
};

exports.createFloorPlan = async (req, res) => {
  try {
    const { building_id, name, map } = req.body;
    const newFloorPlan = await FloorPlan.create({ building_id, name, map });
    res.status(201).json(newFloorPlan);
  } catch (error) {
    console.error('Ошибка при создании этажа:', error);
    res.status(500).json({ error: 'Ошибка при создании этажа' });
  }
};

exports.updateFloorPlan = async (req, res) => {
  try {
    const { building_id, name, map } = req.body;
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.update({ building_id, name, map });
    res.json(floorPlan);
  } catch (error) {
    console.error('Ошибка при обновлении этажа:', error);
    res.status(500).json({ error: 'Ошибка при обновлении этажа' });
  }
};

exports.deleteFloorPlan = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении этажа' });
  }
};

exports.getBeaconsForFloorPlan = async (req, res) => {
  try {
    const beacons = await Beacon.findAll({ where: { floor_id: req.params.id } });
    res.json(beacons);
  } catch (error) {
    console.error('Ошибка при получении маяков для этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении маяков для этажа' });
  }
};
