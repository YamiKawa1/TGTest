const express = require('express');
require('dotenv').config()
const {initializeDB} = require('./models/initializeDB')
const reservationRoutes = require('./api/v1/reservation/reservation.routes')

// initializeDB(); // comentar a partir de la primera vez que se utilice
const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/reservations', reservationRoutes);



module.exports = app;