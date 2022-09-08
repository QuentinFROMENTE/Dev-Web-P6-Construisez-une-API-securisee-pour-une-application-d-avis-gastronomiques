const Sauce = require('../models/Sauce');
const fs = require('fs');

/*Middleware d'envoie du tableau des sauces à partir de la base de donnée*/
exports.getAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({error}));
}

/*Middleware d'envoie d'une sauce par rapport à son Id*/
exports.getOne = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({error}));
}

/*Middleware de création d'une nouvelle entré sur la base de donnée*/
exports.postNewSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const newSauce = new Sauce ({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLikes: [],
        userDislikes: []
    });
    newSauce.save()
        .then(() => res.status(201).json({message: 'Nouvelle sauce ajoutée à la base de donnée'}))
        .catch((error) => res.status(400).json({error}));
}

/*Middleware de modification d'une sauce existante*/
exports.updateSauce = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
            .then((previousImage) => {
                const update = JSON.parse(req.body.sauce);
                const filename = previousImage.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({_id: req.params.id}, {...update, _id: req.params.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
                    .then(() => {res.status(201).json({message: 'Mise à jour réussi'})})
                    .catch(error => res.status(400).json({error}));
                });
            })
            .catch(error => res.status(400).json({error}));
    } else {
        Sauce.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
            .then(() => {res.status(201).json({message: 'Mise à jour réussi'})})
            .catch(error => res.status(400).json({error}));
    }
}

/*Middlewware de suppression d'une sauce*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet Supprimé'}))
                    .catch((error) => res.status(401).json({error}));
            });
        })
        .catch((error) => res.status(500).json({error}));
}

/*Middleware d'ajout et suppression de like/dislike*/
exports.addLike = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const doubleArray = sauce.usersLiked.concat(sauce.usersDisliked);
            for (let likesDisliked of doubleArray) {
                if (likesDisliked == req.body.userId && req.body.like == 0) {
                    for (let i in sauce.usersLiked) {
                        if (sauce.usersLiked[i] == req.body.userId) {
                            let deleteLiked = sauce.usersLiked.splice(i, 1);
                            sauce.likes = sauce.usersLiked.length;
                            Sauce.updateOne({_id: sauce._id}, {likes: sauce.likes, usersLiked: sauce.usersLiked, _id: sauce._id})
                                .then(() => {res.status(201).json({message: 'Mise à jours réussi'})})
                                .catch(error => {res.status(500).json({error})});
                        }
                    };
                    for (let j in sauce.usersDisliked) {
                        if (sauce.usersDisliked[j] == req.body.userId) {
                            let deleteDisliked = sauce.usersDisliked.splice(j, 1);
                            sauce.dislikes = sauce.usersDisliked.length;
                            Sauce.updateOne({_id: sauce._id}, {dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked, _id: sauce._id})
                                .then(() => res.status(201).json({message: 'Mise à jours réussi'}))
                                .catch(error => res.status(500).json({error}));
                        }
                    };
                } else if ((likesDisliked == req.body.userId && req.body.like != 0)) {
                    res.status(400).json({message : "Notation Like/Dislike déjà émis par l'utilisateur"});
                }}
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes = sauce.usersLiked.length;
                Sauce.updateOne({_id: sauce.id}, {likes: sauce.likes, usersLiked: sauce.usersLiked, _id: sauce.id})
                    .then(() => res.status(201).json({message: 'Like ajouté'}))
                    .catch(error => res.status(400).json({error}));
            } else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes = sauce.usersDisliked.length;
                Sauce.updateOne({_id: sauce._id}, {dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked, _id: sauce._id})
                    .then(() => res.status(201).json({message: 'Dislike ajouté'}))
                    .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(500).json({error}));
}