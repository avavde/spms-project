const FloorPlan = require('../models/FloorPlan');
const Building = require('../models/Building');

exports.createFloorPlan = async (req, res) => {
  try {
    const { building_id, name, map } = req.body;

    const floorPlan = await FloorPlan.create({ building_id, name, map });
    res.status(201).json(floorPlan);
  } catch (error) {
    console.error('Ошибка создания плана этажа:', error);
    res.status(500).json({ error: 'Ошибка создания плана этажа' });
  }
};

exports.getFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll({
      include: [
        { model: Building },
      ],
    });
    res.status(200).json(floorPlans);
  } catch (error) {
    console.error('Ошибка загрузки планов этажей:', error);
    res.status(500).json({ error: 'Ошибка загрузки планов этажей' });
  }
};

exports.getFloorPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const floorPlan = await FloorPlan.findByPk(id, {
      include: [
        { model: Building },
      ],
    });

    if (!floorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }

    res.status(200).json(floorPlan);
  } catch (error) {
    console.error('Ошибка загрузки плана этажа:', error);
    res.status(500).json({ error: 'Ошибка загрузки плана этажа' });
  }
};

exports.updateFloorPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { building_id, name, map } = req.body;

    const floorPlan = await FloorPlan.findByPk(id);

    if (!floorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }

    await floorPlan.update({ building_id, name, map });
    res.status(200).json(floorPlan);
  } catch (error) {
    console.error('Ошибка обновления плана этажа:', error);
    res.status(500).json({ error: 'Ошибка обновления плана этажа' });
  }
};

exports.deleteFloorPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const floorPlan = await FloorPlan.findByPk(id);

    if (!floorPlan) {
      return res.status(404).json({ error: 'План этажа не найден' });
    }

    await floorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка удаления плана этажа:', error);
    res.status(500).json({ error: 'Ошибка удаления плана этажа' });
  }
};
