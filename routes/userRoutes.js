const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota de registro
router.post('/register', userController.registerUser);

// Rota de login
router.post('/login', userController.loginUser);

module.exports = router;