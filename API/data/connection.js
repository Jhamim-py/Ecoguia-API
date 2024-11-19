import mysql2 from 'mysql2/promise';
import fs     from 'fs/promises';

import 'dotenv/config';

//função para validar o CA
const getServerCa = async () => {
	try {
		return [await fs.readFile("./DigiCertGlobalRootCA.crt.pem", "utf8")];
	} catch (error) {
		console.error("Erro ao ler o certificado SSL:", error);
		throw error;
	}
};

//função para obter a conexão com o banco de dados
const getConnection = async () => {
	try {
		const serverCa = await getServerCa();

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

export default getConnection;