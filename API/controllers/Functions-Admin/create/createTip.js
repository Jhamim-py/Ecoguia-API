const connection  = require('../../../data/connection');

// Função assíncrona para adicionar uma nova dica
exports.createTip = 
async (req, res) => {
    // Obtém os dados da nova dica do corpo da requisição
    const { tip_description } = req.body;
    const   limitLength        = 280; 

    if (checkLength(tip_description, 280)){
        return res.status(400).json({ msg: `A descrição da dica ultrapassou o limite de ${limitLength} caracteres.` });
    };

    // Validação simples para garantir que a descrição da dica não está vazia
    // Atenção a essa validação, saber todo o contexto dela e quem sabe replicar ou transformar em função!!!
    if (!tip_description || typeof tip_description !== 'string' || tip_description.trim() === '') {
        return res.status(400).json({ msg: "Descrição da dica não pode ser vazia." });
    };

    try {
        // Obtém a conexão com o banco de dados
        executeConnection = await connection.getConnection();

        // Query para verificar se a dica já existe na view
        // Atenção a essa validação, saber todo o contexto dela e quem sabe replicar ou transformar em função!!!
        const checkQuery    = `SELECT COUNT(*) as count FROM ViewAllTip WHERE description_tip = ?`;
        const [checkResult] = await executeConnection.query(checkQuery, [tip_description]);

        if (checkResult[0].count > 0) {
            return res.status(400).json({ msg: "Essa Dica já existe!" });
        }

        // Query para chamar a procedure de criação da dica
        const query  = `CALL CreateTip(?)`; // Chama a procedure
        const values = [tip_description]; // Valores a serem passados para a procedure

		// Executa a query
		const [results] = await executeConnection.query(query, values);
		results;

        return res.status(201).json({ msg: "Dica adicionada com sucesso!" });
    }catch (error) {
        // Caso ocorra um erro durante a execução, retorna um erro 500
        console.error("Erro ao tentar registrar nova dica: ", error);
        return res.status(500).json({ msg: "Erro interno no servidor, tente novamente." });
    } 
    finally{
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};