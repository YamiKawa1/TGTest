const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const {Bills} = require('./bills');
const {Clients} = require('./clients');
const {States} = require('./states');

const Reservations = sequelize.define('Reservations', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bills_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clients_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payMethod: {
    type: DataTypes.STRING,
    allowNull: false
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

Reservations.hasOne(Bills,{ foreignKey: 'bills_id' });
Bills.belongsTo(Reservations);

Reservations.hasOne(Clients,{ foreignKey: 'clients_id' });
Clients.belongsTo(Reservations);

Reservations.hasOne(States,{ foreignKey: 'state_id' });
States.belongsTo(Reservations);

module.exports = {Reservations};


