const mysql2 = require('mysql2/promise');
require('dotenv').config();
// Função para obter a conexão com o banco de dados
exports.getConnection = async () => {
  try { 
    const connection = await mysql2.createConnection({
      host: 'mysql-server-test-ecoguia.mysql.database.azure.com',
      user: 'Eco12Biotech',
      password: process.env.PASSWORDAZURE,
      database: 'bd_ecoguia',
      port:3306,
    });
    return connection;
  }catch (error) {
    console.error('Erro ao conectar: ' + error.stack);
    throw error; // Lance o erro para que possa ser tratado onde a conexão é chamada
  }
};
 