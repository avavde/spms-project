const { FloorPlan, Beacon, Building } = require('../models');
const path = require('path');
const multer = require('multer');

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination for file upload');
    console.log('Request body in destination:', req.body); // Debug log
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log('Setting filename for file upload');
    console.log('Request body in filename:', req.body); // Debug log
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll();
    console.log('All floor plans:', floorPlans);
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
    console.log('Floor plan by ID:', floorPlan);
    res.json(floorPlan);
  } catch (error) {
    console.error('Ошибка при получении этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении этажа' });
  }
};

exports.createFloorPlan = async (req, res) => {
  try {
    const { building_id, name } = req.body;

    if (!building_id || !name) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    const newFloorPlan = await FloorPlan.create({ building_id, name });
    res.status(201).json(newFloorPlan);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании плана этажа' });
  }
};

exports.uploadFloorPlanImage = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }

    try {
      const floorPlan = await FloorPlan.findByPk(req.params.id);
      if (!floorPlan) {
        return res.status(404).json({ error: 'Этаж не найден' });
      }

      const file_url = `/uploads/${req.file.filename}`;
      const file_type = req.file.mimetype;

      await floorPlan.update({ file_url, file_type });
      res.json(floorPlan);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении плана этажа с изображением' });
    }
  });
};

exports.updateFloorPlan = async (req, res) => {
  try {
    const { building_id, name } = req.body;
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      console.error('Этаж не найден');
      return res.status(404).json({ error: 'Этаж не найден' });
    }

    await floorPlan.update({ building_id, name });
    console.log('Updated floor plan:', floorPlan);
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
      console.error('Этаж не найден');
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.destroy();
    console.log('Deleted floor plan:', floorPlan);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении этажа' });
  }
};

exports.getBeaconsForFloorPlan = async (req, res) => {
  try {
    const beacons = await Beacon.findAll({ where: { floor_id: req.params.id } });
    console.log('Beacons for floor plan:', beacons);
    res.json(beacons);
  } catch (error) {
    console.error('Ошибка при получении маяков для этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении маяков для этажа' });
  }
};

exports.getUnassignedFloorPlans = async (req, res) => {
  try {
    const unassignedFloorPlans = await FloorPlan.findAll({
      where: {
        building_id: null
      }
    });
    
    // Если в базе данных нет незакрепленных планов этажей, отправляем пустой массив
    if (!unassignedFloorPlans.length) {
      console.log('No unassigned floor plans found.');
      return res.json([]);
    }

    console.log('Unassigned floor plans:', unassignedFloorPlans);
    res.json(unassignedFloorPlans);
  } catch (error) {
    console.error('Ошибка при получении незакрепленных этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении незакрепленных этажей' });
  }
};
