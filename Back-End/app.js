const express = require ('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

const userRoutes = require('./routes/User');
const sauceRoutes = require('./routes/Sauce');

/*Connexion à la bas de donnée MongoDB*/
mongoose.connect(
    'mongodb+srv://Admin:gMvYxvwqBQBEK6nr@p6fromente.jdm1d.mongodb.net/p6fromente',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection à MongoDB réussi'))
    .catch(() => console.log('Connexion à MongoDB échoué'));
    
app.use(express.json());

/*Middleware de gestion CORS*/
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, '../images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;