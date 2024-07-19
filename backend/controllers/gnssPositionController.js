const { GNSSPosition } = require('../models');

exports.getAllGNSSPositions = async (req, res) => {
  try {
    const positions = await GNSSPosition.findAll();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGNSSPositionById = async (req, res) => {
  try {
    const position = await GNSSPosition.findByPk(req.params.id);
    if (position) {
      res.json(position);
    } else {
      res.status(404).json({ error: 'GNSS Position not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGNSSPosition = async (req, res) => {
  try {
    const position = await GNSSPosition.create(req.body);
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGNSSPosition = async (req, res) => {
  try {
    const position = await GNSSPosition.findByPk(req.params.id);
    if (position) {
      await position.update(req.body);
      res.json(position);
    } else {
      res.status(404).json({ error: 'GNSS Position not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGNSSPosition = async (req, res) => {
  try {
    const position = await GNSSPosition.findByPk(req.params.id);
    if (position) {
      await position.destroy();
      res.json({ message: 'GNSS Position deleted' });
    } else {
      res.status(404).json({ error: 'GNSS Position not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
