//funções externas
const connection = require('../../../data/connection'); // conexão com o banco de dados

//função assíncrona para deletar a cadeia de missões mais recente
exports.deleteQuest = 
async (req, res) => {
	//executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

	try {
		//chama a procedure de exclusão e coloca os dados
		const query = `CALL DeleteQuestAndBadge();`;
		
		//envia a query e retorna caso tenha dado certo
		const [results] = await executeConnection.query(query);
		results;

		return res.status(200).json({ msg: "A cadeia de missões mais recente foi deletada com sucesso." });
	} catch (error) {    
		if (error.sqlState === '45000') {
			//caso o erro SQL seja por regras de negócio, expõe-o
			return res.status(400).json({ 
				msg: `Erro ao tentar deletar a última cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			//caso não seja, retorna no console e avisa
			console.error("Erro ao tentar deletar a cadeia de missões: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
	} finally {
		if (executeConnection) {
			//fecha a conexão com o banco de dados
			await executeConnection.end();
		};
	};
};