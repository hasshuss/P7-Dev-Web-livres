const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("vérification de l'authentification")
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY'); 
        req.userData = decodedToken;
        console.log("verification authentification ok !")
        next();
    } catch (error) {
        res.status(401).json({ message: 'Error 403 : request not allowed' });
    }
};