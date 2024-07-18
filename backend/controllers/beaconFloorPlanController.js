const BeaconFloorPlan = require('../models/BeaconFloorPlan');

exports.getAllBeaconFloorPlans = async (req, res) => {
  try {
    const beaconFloorPlans = await BeaconFloorPlan.findAll();
    res.json(beaconFloorPlans);
  } catch (error) {
    console.error('Ошибка при получении планов этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении планов этажей' });
  }
};

exports.getBeaconFloorPlanById = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }
    res.json(beaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при получении плана этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении плана этажа' });
  }
};

exports.createBeaconFloorPlan = async (req, res) => {
  try {
    const newBeaconFloorPlan = await BeaconFloorPlan.create(req.body);
    res.status(201).json(newBeaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при создании плана этажа:', error);
    res.status(500).json({ error: 'Ошибка при создании плана этажа' });
  }
};

exports.updateBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }
    await beaconFloorPlan.update(req.body);
    res.json(beaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при обновлении плана этажа:', error);
    res.status(500).json({ error: 'Ошибка при обновлении плана этажа' });
  }
};

exports.deleteBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }
    await beaconFloorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении плана этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении плана этажа' });
  }
};
