const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'invitado',
    password: 'O2T6d9s7BQkUGhqI',
    database: 'test',
    port: 3306
});

con.connect(err => {
    if (err) {
        console.log('Hubo un error en la conexion');
        throw err;
    }
    console.log('Conectado exitosamente');
});

module.exports = con;