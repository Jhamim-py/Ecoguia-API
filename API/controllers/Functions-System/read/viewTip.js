const connection = require('../../../data/connection'); 

// Função assíncrona para obter a dica
exports.getTip = async (req, res) => { 
    let executeConnection;

    try {
        // Obtém a conexão com o banco de dados
        executeConnection = connection.getConnection();
        const today = new Date();  // Obtém a data atual
        const formattedDate = today.toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD

        // Query para buscar dica do dia
        const query = `SELECT * FROM ViewAllTip WHERE DATE(date_tip) = ?`;
        const values = [formattedDate];

        // Executa a query para buscar a dica do dia
        const [results] = executeConnection.query(query, values);
        
        if (results.length > 0) {
            // Se encontrar uma dica para hoje, retorna a dica
            return res.json(results[0]);
        } else {
            // Se não encontrar, busca uma dica aleatória
            const query2 = `SELECT * FROM ViewAllTip ORDER BY RAND() LIMIT 1`;
            const [randomResults] = executeConnection.query(query2);

            if (randomResults.length > 0) {
                // Se encontrar uma dica aleatória, retorna a dica
                return res.json(randomResults[0]);
            } else {
                // Se não encontrar nenhuma dica, retorna um erro 404
                return res.status(404).json({ msg: "Nenhuma dica disponível no momento." });
            }
        }
    } catch (error) {
        // Caso ocorra um erro, retorna um erro 500
        console.error("Algo deu errado ao buscar dica, tente novamente: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados
        if (executeConnection) {
            executeConnection.end();
        }
    }
};