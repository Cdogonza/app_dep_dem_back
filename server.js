const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authroutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


const corsOptions = {
    origin: ['https://gold-porpoise-471965.hostingersite.com', 'http://localhost:4200'],
    methods: ['GET', 'POST'],
    credentials: true,
};
// Middleware para parsear JSON
//app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen, ajusta según tus necesidades
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // Agregar encabezado para permitir el acceso a redes privadas
    res.header('Access-Control-Allow-Private-Network', 'true');
    
    // Si es una solicitud OPTIONS, respondemos aquí
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});



// Rutas
app.use('/equipos', require('./routes/equipos'));
app.use('/novedades', require('./routes/novedades'));
app.use('/taller', require('./routes/taller'));

app.use('/auth', authRoutes);



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});