const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    if (!req.body.password) {
        console.log("pas de mdp");
        return res.status(400).json({ error: 'Password not provided' });
    }
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        console.log("Mot de passe haché:", hash); 
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


  const jwt = require('jsonwebtoken');

  exports.login = (req, res, next) => {
      User.findOne({ email: req.body.email })
          .then(user => {
              if (!user) {
                  return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
              }
              bcrypt.compare(req.body.password, user.password)
                  .then(valid => {
                      if (!valid) {
                          return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                      }
                      const token = jwt.sign(
                          { userId: user._id },
                          'RANDOM_SECRET_KEY', 
                          { expiresIn: '24h' } 
                      );
                      res.status(200).json({
                          userId: user._id,
                          token: token
                      });
                  })
                  .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
  };
