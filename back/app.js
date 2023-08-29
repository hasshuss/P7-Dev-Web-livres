const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());

// Middleware pour afficher les requêtes reçues
app.use((req, res, next) => {
    console.log('Requête reçue :', req.method, req.path);
    next();
});

// Middleware pour traiter le corps des requêtes JSON
app.use(express.json());

// Routes principales
app.get('/', (req, res) => { res.send("testinput"); });

// Importation des routes
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);

// Middleware d'erreur à placer après toutes les autres routes et middlewares
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});

// Connexion à MongoDB
mongoose.connect('mongodb+srv://hasscrpt:DK3YcBJjzCTjqIhS@cluster0.l7fobve.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.listen(4000, () => console.log('Serveur lancé sur le PORT 4000'));
module.exports = app;