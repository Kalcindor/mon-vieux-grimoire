const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    averageRating: 0,
    ratings: [],
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Livre non trouvé." });
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res) => {
  const bookId = req.params.id;

  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject.userId;

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé." });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Requête non autorisée !" });
      }

      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(path.join("images", oldFilename), () => {});
      }

      Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
        .then(() => res.status(200).json({ message: "Livre modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Livre non trouvé." });

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Requête non autorisée !" });
      }

      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(path.join("images", filename), () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;

  const grade = Number(req.body.rating);
  if (grade === undefined || isNaN(grade)) {
    return res
      .status(400)
      .json({ error: "La note est requise et doit être un nombre." });
  }
  if (grade < 0 || grade > 5) {
    return res.status(400).json({ error: "La note doit être entre 0 et 5." });
  }

  Book.findById(bookId)
    .then((book) => {
      if (!book) return res.status(404).json({ error: "Livre non trouvé." });

      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }
      book.ratings.push({ userId, grade });

      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = Math.round((total / book.ratings.length) * 10) / 10;

      book
        .save()
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
