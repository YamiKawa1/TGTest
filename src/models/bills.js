const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Bills = sequelize.define('Bills', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    room_id: {

    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

module.exports = Bills;