const connection = require('../../../data/connection'); // conexão com o banco de dados

exports.getAllArticles = 
async (req, res) => { // Incluindo req como parâmetro
    const executeConnection = await connection.getConnection();
    try {
        const query = `SELECT * FROM ViewAllArticle;`;

        // Envio de query para o banco de dados e retorna o resultado
        const [results] = await executeConnection.query(query);

        return res.status(200).json(results);
    } catch (error) {
        console.error("Algo deu errado ao visualizar os artigos:", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        }
    }
};