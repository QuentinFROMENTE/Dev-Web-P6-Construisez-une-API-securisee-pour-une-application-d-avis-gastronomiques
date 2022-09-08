const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/Sauce');
const Auth = require('../middleware/Auth');
const multer = require('../middleware/multer-config');

router.get('/', Auth, sauceCtrl.getAll);
router.get('/:id', Auth, sauceCtrl.getOne);
router.post('/', Auth, multer, sauceCtrl.postNewSauce);
router.put('/:id', Auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', Auth, sauceCtrl.deleteSauce);
router.post('/:id/like', Auth, sauceCtrl.addLike);

module.exports = router;