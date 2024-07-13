// backend/controllers/messageController.js

const Device = require('../models/Device');
const { sendMessage } = require('../mqttClient');

const sendMessageToDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({ where: { devicetype: 'badge' } });
        devices.forEach(device => {
            const topic = `Badge/${device.id}/down/commands`;
            const message = JSON.stringify({
                message: {
                    event: 'SOS_START',
                    sync: 'AAAAAA'
                }
            });
            sendMessage(topic, message);
        });
        res.status(200).send({ message: 'Messages sent successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    sendMessageToDevices,
};
