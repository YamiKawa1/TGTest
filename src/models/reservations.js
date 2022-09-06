const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Reservations = sequelize.define('Reservations', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bills_id: {

  },
  clients_id: {

  },
  satet_id:{

  },
  stayingDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numberOfPeople: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Reservations;


