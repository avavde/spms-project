const { Beacon, Device } = require('../models');

exports.getAvailableBeacons = async (req, res) => {
  try {
    const devices = await Device.findAll({ where: { devicetype: 'beacon' } });

    const beacons = await Promise.all(devices.map(async (device) => {
      const beacon = await Beacon.findOne({ where: { beacon_mac: device.id } });
      return {
        id: device.id,
        beacon_mac: device.id,
        map_coordinates: beacon ? beacon.map_coordinates : null,
      };
    }));
    res.json(beacons);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении доступных маяков' });
  }
};

exports.updateBeaconCoordinates = async (req, res) => {
  console.log('Received request to update beacon coordinates');
  try {
    const { beacon_mac } = req.params;
    const { map_coordinates } = req.body;

    console.log(`Looking for beacon with beacon_mac: ${beacon_mac}`);
    console.log(`New coordinates: ${JSON.stringify(map_coordinates)}`);

    // Проверка, что map_coordinates имеет правильный формат
    if (!Array.isArray(map_coordinates) || map_coordinates.length !== 2) {
      console.error('Invalid map_coordinates format:', map_coordinates);
      return res.status(400).json({ error: 'Invalid map_coordinates format' });
    }

    const beacon = await Beacon.findOne({ where: { beacon_mac } });
    if (!beacon) {
      console.error(`Beacon not found for beacon_mac: ${beacon_mac}`);
      return res.status(404).json({ error: 'Маяк не найден' });
    }

    console.log(`Beacon found: ${JSON.stringify(beacon)}`);
    await beacon.update({ map_coordinates });
    console.log(`Beacon coordinates updated successfully for beacon_mac: ${beacon_mac}`);
    res.json(beacon);
  } catch (error) {
    console.error('Error during beacon coordinates update:', error.message);
    console.error('Error stack trace:', error.stack);
    res.status(500).json({ error: 'Ошибка при обновлении координат маяка', details: error.message });
  }
};

exports.deleteBeacon = async (req, res) => {
  console.log('Received request to delete beacon coordinates');
  try {
    const { beacon_mac } = req.params;

    console.log(`Looking for beacon with beacon_mac: ${beacon_mac}`);

    const beacon = await Beacon.findOne({ where: { beacon_mac } });
    if (!beacon) {
      console.error(`Beacon not found for beacon_mac: ${beacon_mac}`);
      return res.status(404).json({ error: 'Маяк не найден' });
    }

    console.log(`Beacon found: ${JSON.stringify(beacon)}`);
    await beacon.update({ map_coordinates: null });
    console.log(`Beacon coordinates deleted successfully for beacon_mac: ${beacon_mac}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error during beacon coordinates deletion:', error.message);
    console.error('Error stack trace:', error.stack);
    res.status(500).json({ error: 'Ошибка при удалении координат маяка', details: error.message });
  }
};

exports.getBeaconIdsByMacs = async (req, res) => {
  try {
    const { beacon_macs } = req.query;

    if (!beacon_macs || !Array.isArray(beacon_macs)) {
      return res.status(400).json({ error: 'Invalid request: beacon_macs must be an array' });
    }

    const beacons = await Beacon.findAll({ where: { beacon_mac: beacon_macs } });
    const beaconIds = beacons.map(beacon => beacon.id);

    res.json(beaconIds);
  } catch (error) {
    console.error('Ошибка при получении beacon IDs по MAC адресам:', error);
    res.status(500).json({ error: 'Ошибка при получении beacon IDs по MAC адресам' });
  }
};
