const connection  = require('../../../data/connection'); // conexão com o banco de dados

exports.deleteLevel = 
async (req, res) => {

	// executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();
    try {
        const query = `CALL DeleteLevel();`;
	//executa a query
	const [results] = await executeConnection.query(query);
	results;

	return res.status(200).json({ msg: "Level deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao tentar deletar o level: ", error);
        return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
    } finally {
		// Fecha a conexão com o banco de dados
		if (executeConnection) {
			await executeConnection.end();
		};
	};
};
