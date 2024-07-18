// controllers/beaconFloorPlanController.js
const BeaconFloorPlan = require('../models/BeaconFloorPlan');

exports.createBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.create(req.body);
    res.status(201).json(beaconFloorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBeaconFloorPlans = async (req, res) => {
  try {
    const beaconFloorPlans = await BeaconFloorPlan.findAll();
    res.status(200).json(beaconFloorPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBeaconFloorPlanById = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'Beacon-floor plan relationship not found' });
    }
    res.status(200).json(beaconFloorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'Beacon-floor plan relationship not found' });
    }
    await beaconFloorPlan.update(req.body);
    res.status(200).json(beaconFloorPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBeaconFloorPlan = async (req, res) => {
  try {
    const beaconFloorPlan = await BeaconFloorPlan.findByPk(req.params.id);
    if (!beaconFloorPlan) {
      return res.status(404).json({ error: 'Beacon-floor plan relationship not found' });
    }
    await beaconFloorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
