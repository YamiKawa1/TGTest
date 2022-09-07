const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const {Rooms} = require('./rooms')

const Bills = sequelize.define('Bills', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

Bills.hasOne(Rooms,{ foreignKey: 'room_id' });
Rooms.belongsTo(Bills)

module.exports = {Bills};