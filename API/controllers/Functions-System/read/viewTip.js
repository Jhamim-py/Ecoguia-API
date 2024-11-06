const connection = require('../../../data/connection');

// Variável global para armazenar a dica do dia
let dailyTip = null; // Armazena a dica que será retornada ao usuário
let lastTipDate = null; // Armazena a data em que a dica foi buscada

// Função assíncrona para obter a dica
exports.getTip = 
async (req, res) => {
    const executeConnection = await connection.getConnection();  // Variável para armazenar a conexão com o banco de dados

    try {
        const today = new Date(); // Obtém a data e hora atuais
        const formattedDate = today.toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD

        // Verifica se já existe uma dica armazenada para hoje
        if (lastTipDate === formattedDate && dailyTip) {
            return res.json(dailyTip); // Retorna a dica armazenada se for o mesmo dia
        };

        // Query para buscar uma dica aleatória da tabela ViewAllTip
        const query = `SELECT * FROM ViewRandomTip`;
        const [results] = await executeConnection.query(query); // Executa a consulta

        if (results.length > 0) { // Verifica se há resultados
            // Armazena a dica do dia e a data atual
            dailyTip = results[0]; // A primeira dica encontrada é armazenada
            lastTipDate = formattedDate; // Atualiza a data da dica

            // Retorna a dica encontrada em formato JSON
            return res.status(200).json(dailyTip);
        } else {
            // Se não encontrar nenhuma dica, retorna um erro 404
            return res.status(404).json({ msg: "Nenhuma dica disponível no momento." });
        }
    } catch (error) {
        // Caso ocorra um erro durante a execução, retorna um erro 500
        console.error("Algo deu errado ao buscar dica, tente novamente: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};
