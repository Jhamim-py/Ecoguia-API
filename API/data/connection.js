import mysql2 from 'mysql2/promise';

import 'dotenv/config';

//função para obter a conexão com o banco de dados
const getConnection = async () => {
	try {
		const connection = await mysql2.createConnection({
			host: process.env.HOSTNAME_BD_AZURE,
			user: 'Eco12Biotech', 
			password: process.env.PWD_BD_AZURE,
			database: 'bd_ecoguia',
			port: process.env.PORT
		});
		return connection; 
	}catch (error) {
		console.error('Erro ao conectar: ' + error.stack);
		throw error; 
	}
};

export default getConnection;