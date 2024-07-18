const BeaconFloorPlan = require('../models/BeaconFloorPlan');

exports.getAllBeaconFloorPlans = async (req, res) => {
  try {
    const beaconFloorPlans = await BeaconFloorPlan.findAll();
    res.json(beaconFloorPlans);
  } catch (error) {
    console.error('Ошибка при получении планов маяков:', error);
    res.status(500).json({ error: 'Ошибка при получении планов маяков' });
  }
};

exports.getBeaconFloorPlanById = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План маяка не найден' });
    }
    res.json(beaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при получении плана маяка:', error);
    res.status(500).json({ error: 'Ошибка при получении плана маяка' });
  }
};

exports.createBeaconFloorPlan = async (req, res) => {
  try {
    const { building_id, floorplan_id } = req.body;
    const newBeaconFloorPlan = await BeaconFloorPlan.create({ building_id, floorplan_id });
    res.status(201).json(newBeaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при создании плана маяка:', error);
    res.status(500).json({ error: 'Ошибка при создании плана маяка' });
  }
};

exports.updateBeaconFloorPlan = async (req, res) => {
  try {
    const { building_id, floorplan_id } = req.body;
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План маяка не найден' });
    }
    await beaconFloorPlan.update({ building_id, floorplan_id });
    res.json(beaconFloorPlan);
  } catch (error) {
    console.error('Ошибка при обновлении плана маяка:', error);
    res.status(500).json({ error: 'Ошибка при обновлении плана маяка' });
  }
};

exports.deleteBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'План маяка не найден' });
    }
    await beaconFloorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении плана маяка:', error);
    res.status(500).json({ error: 'Ошибка при удалении плана маяка' });
  }
};
