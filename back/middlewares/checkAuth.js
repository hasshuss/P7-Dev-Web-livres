const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
    console.log("vérification de l'authentification")
    try {
        const token = req.headers.authorization.split(' ')[1];
        const secretkey = process.env.RANDOM_SECRET_KEY;
        const decodedToken = jwt.verify(token, secretkey); 
        req.userData = decodedToken;
        console.log("verification authentification ok !")
        next();
    } catch (error) {
        res.status(403).json({ message: 'Error 403 : request not allowed' });
    }
};