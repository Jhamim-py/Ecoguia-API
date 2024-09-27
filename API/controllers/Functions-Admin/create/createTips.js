const connection = require('../../../data/connection');

// Função assíncrona para adicionar uma nova dica
exports.createTip = async (req, res) => {

    // Obtém os dados da nova dica do corpo da requisição
    const { tip_description } = req.body; 

    // Validação simples para garantir que a descrição da dica não está vazia
    if (!tip_description || typeof tip_description !== 'string' || tip_description.trim() === '') {
        return res.status(400).json({ msg: "Descrição da dica não pode ser vazia." });
    }

    try {
        // Obtém a conexão com o banco de dados
        executeConnection = await connection.getConnection();

        // Query para verificar se a dica já existe na view
        const checkQuery = `SELECT COUNT(*) as count FROM ViewAllTip WHERE description_tip = ?`;
        const [checkResult] = await executeConnection.query(checkQuery, [tip_description]);

        if (checkResult[0].count > 0) {
            return res.status(400).json({ msg: "Essa Dica já existe!" });
        }

        // Query para chamar a procedure de criação da dica
        const query = `CALL CreateTip(?)`; // Chama a procedure
        const values = [tip_description]; // Valores a serem passados para a procedure

        await executeConnection.query(query, values); // Executa a consulta

        // Retorna uma resposta de sucesso
        return res.status(201).json({ msg: "Dica adicionada com sucesso!" });
    } catch (error) {
        // Caso ocorra um erro durante a execução, retorna um erro 500
        console.error("Erro ao adicionar dica: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            executeConnection.end();
        }
    }
};
