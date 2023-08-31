const Book = require('../models/book');
const jwt = require('jsonwebtoken');


exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    let initialRating = 0;

    if (bookObject.ratings && bookObject.ratings[0]) {
        initialRating = parseFloat(bookObject.ratings[0].grade);

        if (isNaN(initialRating)) {
            return res.status(400).json({ error: 'Invalid rating value.' });
        }
    }

    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        averageRating: initialRating
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .select('userID author title imageUrl year genre averageRating')
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(book);
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
};

exports.rateBook = (req, res, next) => {


    const grade = parseFloat(req.body.rating);

    console.log(grade)
    if (isNaN(grade)) {
        return res.status(400).json({ message: 'Veuillez fournir une note valide.' });
    }

    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }
            const existingRating = book.ratings.find(r => r.userId === req.body.userId);
            if (existingRating) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
            }
            book.ratings.push({
                userId: req.body.userId,
                grade: grade
            });
            const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
            book.averageRating = totalRatings / book.ratings.length;

            return book.save();
        })
        .then(book => {
            res.json(book);
        })
        .catch(error => res.status(500).json({ error }));
}

exports.DeleteBook = (req, res, next) => {
    Book.findByIdAndRemove(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json({ message: 'Livre supprimé avec succès' });
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
};


exports.getBestRating = async (req, res, next) => {
    console.log("requête bestrating reçue")
    try {
        const books = await Book.find()
            .sort({ averageRating: -1 })
            .limit(3);
        res.status(200).json(books);
        console.log(books);

    } catch (error) {
        res.status(500).json({ error: 'Une erreur s’est produite lors de la récupération des livres.' });
    }
};

exports.modifyBook = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
        const userIdFromToken = decodedToken.userId;

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé!' });
        }

        if (book.userId !== userIdFromToken) {
            return res.status(403).json({ message: 'Accès non autorisé!' });
        }

        let isModified = false;
        for (let prop in req.body) {
            if (prop !== 'averageRating' && prop !== 'userId' && book[prop] && book[prop] !== req.body[prop]) {
                book[prop] = req.body[prop];
                isModified = true;
            }
        }

        if (isModified) {
            await book.save();
            return res.status(200).json({ message: 'Livre modifié!' });
        } else {
            return res.status(200).json({ message: 'Aucune modification apportée au livre.' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};