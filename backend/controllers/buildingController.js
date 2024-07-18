// controllers/buildingController.js
const Building = require('../models/Building');

exports.createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(201).json(building);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBuildingById = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    res.status(200).json(building);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    await building.update(req.body);
    res.status(200).json(building);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    await building.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
