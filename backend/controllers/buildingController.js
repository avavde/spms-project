const Building = require('../models/Building');
const FloorPlan = require('../models/FloorPlan');
const Zone = require('../models/Zone');

exports.createBuilding = async (req, res) => {
  try {
    const { name, address, gps_coordinates, dimensions, floorPlans, zones } = req.body;

    const building = await Building.create({ name, address, gps_coordinates, dimensions });

    if (floorPlans && floorPlans.length > 0) {
      for (let plan of floorPlans) {
        await FloorPlan.create({ ...plan, building_id: building.id });
      }
    }

    if (zones && zones.length > 0) {
      for (let zone of zones) {
        await Zone.create({ ...zone, floor_plan_id: zone.floor_plan_id });
      }
    }

    res.status(201).json(building);
  } catch (error) {
    console.error('Ошибка создания здания:', error);
    res.status(500).json({ error: 'Ошибка создания здания' });
  }
};

exports.getBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll({
      include: [
        { model: FloorPlan },
        { model: Zone },
      ],
    });
    res.status(200).json(buildings);
  } catch (error) {
    console.error('Ошибка загрузки зданий:', error);
    res.status(500).json({ error: 'Ошибка загрузки зданий' });
  }
};

exports.getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findByPk(id, {
      include: [
        { model: FloorPlan },
        { model: Zone },
      ],
    });

    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }

    res.status(200).json(building);
  } catch (error) {
    console.error('Ошибка загрузки здания:', error);
    res.status(500).json({ error: 'Ошибка загрузки здания' });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, gps_coordinates, dimensions, floorPlans, zones } = req.body;

    const building = await Building.findByPk(id);

    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }

    await building.update({ name, address, gps_coordinates, dimensions });

    await FloorPlan.destroy({ where: { building_id: id } });
    if (floorPlans && floorPlans.length > 0) {
      for (let plan of floorPlans) {
        await FloorPlan.create({ ...plan, building_id: id });
      }
    }

    await Zone.destroy({ where: { building_id: id } });
    if (zones && zones.length > 0) {
      for (let zone of zones) {
        await Zone.create({ ...zone, building_id: id });
      }
    }

    res.status(200).json(building);
  } catch (error) {
    console.error('Ошибка обновления здания:', error);
    res.status(500).json({ error: 'Ошибка обновления здания' });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findByPk(id);

    if (!building) {
      return res.status(404).json({ error: 'Здание не найдено' });
    }

    await building.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка удаления здания:', error);
    res.status(500).json({ error: 'Ошибка удаления здания' });
  }
};
