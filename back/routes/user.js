const express = require('express');
const router = express.Router();

// Import du contrôleur associé aux utilisateurs
const userCtrl = require('../controllers/user');

// Routes d'inscription et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);  // Vous n'avez pas encore fourni la logique de cette fonction, assurez-vous de l'ajouter dans votre contrôleur plus tard.

module.exports = router;