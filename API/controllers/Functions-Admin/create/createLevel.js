// funções externas
const connection  = require('../../../data/connection');


// função assíncrona para adicionar uma nova dica
exports.createLevel = 
async (req, res) => {
    // Obtém os dados da nova dica do corpo da requisição
    const { xp_level } = req.body;

    //executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try {
        // Query para chamar a procedure de criação da dica
        const query  = `CALL CreateLevel(?)`; // Chama a procedure
        const values = [xp_level]; // Valores a serem passados para a procedure

		// Executa a query
		const [results] = await executeConnection.query(query, values);
		results;

        return res.status(201).json({ msg: "Novo Level adicionado com sucesso" });
    }catch (error) {
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar criar novo level: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras
			console.error("Erro ao tentar criar novo level: ", error);
			return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
		};
    }
    finally{
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};
