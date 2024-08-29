const mysql2 = require('mysql2');

exports.getConnection =  () => {

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bd_ecoguia'
})

connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar: ' + err.stack);
      return;
    }
    console.log('Conectado como ID ' + connection.threadId);
  });

  return connection;
}