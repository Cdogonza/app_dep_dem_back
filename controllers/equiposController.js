const db = require('../db.js'); // Asegúrate de crear un archivo db.js para manejar la conexión


//EQUIPAMIENTO

// Obtener todos los equipos
exports.getAllEquipos = (req, res) => {
    // db.query('SELECT * FROM u154726602_equipos.equipos', (err, results) => {
    //     if (err) return res.status(500).json(err);
    //     res.json(results);
    // });
    alert("Funciona el backend");
};
// Crear un nuevo equipo
exports.createEquipo = (req, res) => {
    const nuevoEquipo = req.body;
    db.query('INSERT INTO u154726602_equipos.equipos SET ?', nuevoEquipo, (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, ...nuevoEquipo });
    });
};
// Obtener un equipo por ID
exports.getEquipoById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM u154726602_equipos.equipos WHERE dem = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.json(results[0]);
    });
};
// Actualizar un equipo
exports.updateEquipo = (req, res) => {
    const { id } = req.params;
    const equipoActualizado = req.body;
    db.query('UPDATE u154726602_equipos.equipos SET ? WHERE dem = ?', [equipoActualizado, id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.json({ message: 'Equipo actualizado correctamente' });
    });
};

// Eliminar un equipo
exports.deleteEquipo = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM u154726602_equipos.equipos WHERE dem = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Equipo no encontrado' });
        res.json({ message: 'Equipo eliminado correctamente' });
    });
};

//NOVEDADES
// Obtener todos las novedades
exports.getAllNovedades = (req, res) => {
    db.query('SELECT * FROM u154726602_equipos.novedades ORDER BY fecha DESC', (err, results) => {
        if (err) return res.status(500).json(err.cause);
        res.json(results);
    });
};
const moment = require('moment');
exports.getNovedadesHoy = (req, res) => {
    const hoy = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const ayer = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');

    const query = `
        SELECT * FROM u154726602_equipos.novedades 
        WHERE fecha >= ? AND fecha <= ?
        ORDER BY fecha DESC
    `;

    db.query(query, [ayer, hoy], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);

    });
};
exports.createNovedad = (req, res) => {
    const hoy = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const { nombre, novedad } = req.body;

    // Validar los datos
    if (!nombre || !novedad) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO u154726602_equipos.novedades (fecha, nombre, novedad) VALUES (?, ?, ?)';
    db.query(query, [hoy, nombre, novedad], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Novedad creada exitosamente', id: results.insertId });
    });
};