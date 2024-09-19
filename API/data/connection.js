const mysql2 = require('mysql2/promise');

// Função para obter a conexão com o banco de dados
exports.getConnection = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'bd_ecoguia'
    });

    console.log('Conectado como ID ' + connection.threadId);
    return connection;
  } catch (err) {
    console.error('Erro ao conectar: ' + err.stack);
    throw err; // Lance o erro para que possa ser tratado onde a conexão é chamada
  }
};
