
const {User, UserAction } = require('../models');

// Получить все действия пользователей
exports.getAllUserActions = async (req, res) => {
  try {
    const userActions = await UserAction.findAll({ include: User });
    res.json(userActions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить действие пользователя по ID
exports.getUserActionById = async (req, res) => {
  try {
    const userAction = await UserAction.findByPk(req.params.id, { include: User });
    if (userAction) {
      res.json(userAction);
    } else {
      res.status(404).json({ error: 'UserAction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Создать новое действие пользователя
exports.createUserAction = async (req, res) => {
  try {
    const userAction = await UserAction.create(req.body);
    res.status(201).json(userAction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить действие пользователя
exports.updateUserAction = async (req, res) => {
  try {
    const [updated] = await UserAction.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedUserAction = await UserAction.findByPk(req.params.id, { include: User });
      res.json(updatedUserAction);
    } else {
      res.status(404).json({ error: 'UserAction not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удалить действие пользователя
exports.deleteUserAction = async (req, res) => {
  try {
    const deleted = await UserAction.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'UserAction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
