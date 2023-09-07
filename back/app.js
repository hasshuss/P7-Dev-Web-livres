const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const multerConfig = require('./middlewares/multer-config'); 
const bodyParser = require('body-parser');
require('dotenv').config();




app.use(cors());

let n = 0

// Middleware pour afficher les requêtes reçues
app.use((req, res, next) => {
  console.log('Requête reçue', 'méthode: ' + req.method, 'path:' + req.path, 'ip:' + req.ip );
  n = n + 1
     console.log('nombre totale de requêtes : ' + n)
    next();
});

// Middleware pour traiter le corps des requêtes JSON
app.use(express.json());


// Importation des routes
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);

const bookRoutes = require('./routes/book');

app.use('/api/books', multerConfig, bookRoutes);

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


const dbUrl = process.env.DATABASE_URL;

// Connexion à MongoDB
mongoose.connect(dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.listen(4000, () => console.log('Serveur lancé sur le PORT 4000'));

// Middleware d'erreur à placer après toutes les autres routes et middlewares
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});


module.exports = app;