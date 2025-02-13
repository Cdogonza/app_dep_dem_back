const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

// Obtener todos los equipos
router.get('/todas', equiposController.getAllNovedades);

// Crear un nuevo equipo
router.get('/hoy', equiposController.getNovedadesHoy);

router.post('/', equiposController.createNovedad);

module.exports = router;