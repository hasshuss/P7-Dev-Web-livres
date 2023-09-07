const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(maxLength) {
    return [jsonParser, function(req, res, next) {
        console.log('lancement middleware check input');

  
        const fieldsToCheck = ['title', 'author','genre', 'email', 'password'];

        for (const field of fieldsToCheck) {
            const content = req.body[field];

            if (content && typeof content === 'string' && content.length > maxLength) {
                console.log(`Le champ "${field}" a une longueur de ${content.length}, ce qui est trop long.`);
                return res.status(400).json({
                    error: `Le contenu de "${field}" ne doit pas dépasser ${maxLength} caractères.`
                });
            }
        }

        console.log('input correct');
        next();
    }];
};

