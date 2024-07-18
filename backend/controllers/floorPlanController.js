// controllers/floorPlanController.js
const FloorPlan = require('../models/FloorPlan');

exports.createFloorPlan = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.create(req.body);
    res.status(201).json(floorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll();
    res.status(200).json(floorPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFloorPlanById = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Floor plan not found' });
    }
    res.status(200).json(floorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFloorPlan = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Floor plan not found' });
    }
    await floorPlan.update(req.body);
    res.status(200).json(floorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFloorPlan = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Floor plan not found' });
    }
    await floorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
