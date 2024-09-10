// variáveis de ambiente para importar funções
const connection = require('../../../data/connection');     // conexão com o banco de dados

// função de registro que pode ser exportada
exports.getTip = 
async (res) => {   //função assíncrona com parâmetros de requisição e resposta
    const executeConnection = connection.getConnection();        // variável que armazena a execução de conexão com o banco de dados
    const today             = new Date();                        // variável responsável por armazenar a data de 'hoje'
    const formattedDate     = today.toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD

    try{
        // armazena a query de visualização de dica (date)
        const query  = `SELECT * FROM ViewAllTip WHERE DATE(date_tip) = ?`;
        const values = [formattedDate];

        // armazena a segunda query de visualização de dica (random)
        const query2  = `SELECT * FROM ViewAllTip ORDER BY RAND() LIMIT 1`;
        const values2 = [randomTip];

        // envio de query para o banco de dados e retorna o resultado
        executeConnection.query(query, values, async function(error, results){
            if (error) {
                console.log(error); //verificação
                return res.status(500).json({ msg: "Algo deu errado ao buscar a dica de hoje, tente novamente." });
            }
            if (results.length > 0){
                //caso exista uma dica com a data de 'hoje'
                return res(null, res[0]);
            }
            else{
                // query para buscar dica aleatória
                const query2 = `SELECT * FROM ViewAllTip ORDER BY RAND() LIMIT 1`;

                executeConnection.query(query2, async function (error, randomResults) {
                    if (error) {
                        console.log(error); //verificação
                        return res.status(500).json({ msg: "Algo deu errado ao buscar uma dica aleatória, tente novamente." });
                    }
                    if (randomResults.length > 0) {
                        // caso exista alguma dica no banco de dados
                        return res.json(randomResults[0]);

                    } else {
                        return res.status(404).json({ msg: "Nenhuma dica disponível no momento." });
                    }
                });
            }
        })
    }catch(error) {
        console.error("Algo deu errado ao buscar dica, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }
    connection.end();     //fecha a conexão com banco de dados
};