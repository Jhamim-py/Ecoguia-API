// funções externas
const connection  = require('../../../data/connection');

// função assíncrona para adicionar uma nova dica
exports.createTip = 
async (req, res) => {
    // Obtém os dados da nova dica do corpo da requisição
    const { tip_description } = req.body;
    const   limitLength       = 280; 

	// validação de campo vazio
	if (!tip_description || typeof tip_description !== 'string') {
		return res.status(422).json({ msg: "É obrigatório preencher o campo da descrição de dica." });

	}else if (checkLength(tip_description, 280)){
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };

    //executa a conexão com o banco de dados
	const executeConnection = await connection.getConnection();

    try {
        // Query para chamar a procedure de criação da dica
        const query  = `CALL CreateTip(?)`; // Chama a procedure
        const values = [tip_description]; // Valores a serem passados para a procedure

		// Executa a query
		const [results] = await executeConnection.query(query, values);
		results;

        return res.status(201).json({ msg: "Nova dica criada com sucesso." });
    }catch (error) {
		if (error.sqlState === '45000') {
			// Caso o erro SQL seja por regras de negócio
			return res.status(400).json({ 
				msg: `Erro ao tentar criar cadeia de missões: ${error.sqlMessage}`
			});
		} else {
			// Caso o erro seja inerente as regras
			console.error("Erro ao tentar criar cadeia de missões: ", error);
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