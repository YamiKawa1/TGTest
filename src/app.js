const express = require('express');
require('dotenv').config()
const {initializeDB} = require('./models/initializeDB')
const reservationRoutes = require('./api/v1/reservation/reservation.routes')

// initializeDB(); // comentar a partir de la primera vez que se utilice
const app = express();

app.use(express.json());



app.use('/api/v1/reservations', reservationRoutes);

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Running in: ' + process.env.PORT || 5000);
});
