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
  entryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  exitDate:{
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  peopleQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Reservations.hasOne(Bills );
Bills.belongsTo(Reservations, { foreignKey: 'bills_id' });

Reservations.hasOne(Clients);
Clients.belongsTo(Reservations, { foreignKey: 'clients_id' });

Reservations.hasOne(States);
States.belongsTo(Reservations, { foreignKey: 'states_id' });

module.exports = {Reservations};


