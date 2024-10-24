const connection = require('../../../data/connection'); // conexão com o banco de dados

exports.deleteQuest = 
async (req, res) => {
	// executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

	try {
		const query = `CALL DeleteQuestAndBadge();`;
		
		// executa a query
		const [results] = await executeConnection.query(query);
		results;

		return res.status(200).json({ msg: "A cadeia de missões mais recente foi deletada com sucesso." });
	} catch (error) {    
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar deletar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras
			console.error("Erro ao tentar deletar cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	} finally {
		// Fecha a conexão com o banco de dados
		if (executeConnection) {
			await executeConnection.end();
		};
	};
};