const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Registro de usuario
exports.register = (req, res) => {
    const { username, password, email } = req.body;

    // Verificar que todos los campos estén presentes
    if (!username || !password || !email) {
        return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Insertar el nuevo usuario en la base de datos
    db.query('INSERT INTO u154726602_equipos.users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, results) => {
        if (err) {
            // Manejar errores de duplicados
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("El nombre de usuario o el correo electrónico ya están en uso.");
            }
            return res.status(500).send("Error en la base de datos.");
        }
        res.status(201).send("Usuario registrado.");
    });
};

// Login de usuario
exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM u154726602_equipos.users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send("Error en la base de datos.");
        if (results.length === 0) return res.status(404).send("Usuario no encontrado.");

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
};

// Resetear contraseña
exports.resetPassword = (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM u154726602_equipos.users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send("Error en la base de datos.");
        if (results.length === 0) return res.status(404).send("Usuario no encontrado.");

        const user = results[0];
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Configuración del transportador de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Para restablecer su contraseña, haga clic en el siguiente enlace: http://localhost:4200/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send("Error al enviar el correo.");
            }
            res.status(200).send("Correo de restablecimiento enviado.");
        });
    });
};