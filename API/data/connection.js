const mysql2 = require('mysql2/promise');
var fs       = require('fs');

require('dotenv').config();

const serverCa = [fs.readFileSync("./DigiCertGlobalRootCA.crt.pem", "utf8")];

// Função para obter a conexão com o banco de dados
exports.getConnection = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: process.env.HOSTNAME_BD_AZURE,
      user: 'Eco12Biotech',
      password: process.env.PWD_BD_AZURE,
      database: 'bd_ecoguia',
      port: process.env.PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: serverCa
      }

    });
    return connection; 
  }catch (error) {
    console.error('Erro ao conectar: ' + error.stack);
    throw error; // Lance o erro para que possa ser tratado onde a conexão é chamada
  }
};