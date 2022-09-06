const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const States = sequelize.define('States', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  definition: {
    type: DataTypes.STRING
  }
});


module.exports = States;