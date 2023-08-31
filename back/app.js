const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const multerConfig = require('./middlewares/multer-config'); 


app.use(cors());
var n = 0

// Middleware pour afficher les requêtes reçues
app.use((req, res, next) => {
    console.log('Requête reçue :', req.method, req.path);
     n = n + 1
     console.log(n)
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




// Connexion à MongoDB
mongoose.connect('mongodb+srv://hasscrpt:DK3YcBJjzCTjqIhS@cluster0.l7fobve.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.listen(4000, () => console.log('Serveur lancé sur le PORT 4000'));

// Middleware d'erreur à placer après toutes les autres routes et middlewares
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});


module.exports = app;