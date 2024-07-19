// backend/controllers/messageController.js

const { Device }= require('../models');


const { sendMessage } = require('../mqttClient');

const sendMessageToDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({ devicetype: 'badge' });
        devices.forEach(device => {
            const topic = device.mqttTopic;
            const message = 'SOS_START';
            sendMessage(topic, message);
        });
        res.status(200).send({ message: 'Messages sent successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const cancelSosMessage = async (req, res) => {
    try {
        const devices = await Device.findAll({ devicetype: 'badge' });
        devices.forEach(device => {
            const topic = device.mqttTopic;
            const message = 'SOS_STOP';
            sendMessage(topic, message);
        });
        res.status(200).send({ message: 'Cancel SOS messages sent successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    sendMessageToDevices,
    cancelSosMessage,
};
