const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Rooms = sequelize.define('Rooms', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  floor:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  door: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  beds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
});


module.exports = {Rooms};