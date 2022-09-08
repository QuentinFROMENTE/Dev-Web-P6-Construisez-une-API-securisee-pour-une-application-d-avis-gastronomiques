const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, require: true}, /*Id MongoDB unique à l'utilisateur créateur de la sauce*/
    name: {type: String, require: true}, /*Nom de la sauce*/
    manufacturer: {type: String, require: true}, /*Fabriquant de la sauce*/
    description: {type: String, require: true}, /*Description de la sauce*/
    mainPepper: {type: String, require: true}, /*Ingrédient principal*/
    imageUrl: {type: String, require: true}, /*URL de l'image*/
    heat: {type: Number, require: true}, /* Nombre entre 1 et 10 décrivant la sauce*/
    likes: {type: Number, require: true}, /*Nombre d'utilisateur ayant liker*/
    dislikes: {type: Number, require: true}, /*Nombre d'utilsateur ayant disliker*/
    usersLiked: {type: Array, require: true}, /*Tableau des Id MongoDB des utilsateurs ayant liker*/
    usersDisliked: {type: Array, required: true} /*Tableau des Id MongoDB des Utilisateurs ayant disliker*/
});

module.exports = mongoose.model('sauce', sauceSchema);