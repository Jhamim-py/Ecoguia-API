const connection = require('../../../data/connection'); //conexão com o banco de dados

exports.deleteArticle =
async(req, res) => {
    // variável responsável por armazenar o dado
	const {id} = req.body;

	// executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

	try{
		const query  = `CALL DeleteArticle(?);`;
		const values = [id];

		//executa a query
		const [results] = await executeConnection.query(query, values);
		results;
		
		return res.status(200).json({ msg: "Artigo deletado com sucesso." });
	}catch (error) {
		console.error("Erro ao tentar deletar artigo: ", error);
		return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
	}
	finally {
		// Fecha a conexão com o banco de dados
		if (executeConnection) {
			await executeConnection.end();
		};
	};
};
