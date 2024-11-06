const connection = require('../../../data/connection'); //conexão com o banco de dados

exports.selectArticle =
async(req, res) => {
    const {id} = req.body;  //variáveis responsáveis por armazenar os dados

    //executa a conexão com o banco de dados
    const executeConnection = connection.getConnection();

    try{
        const query  = "CALL SelectIDArticle(?);";
        const values = [id];
    
        //executa a query
        const [results] = await executeConnection.query(query, values);
    
        if(results.length > 0){
            return res.status(200).json(results);
        };

    } catch (error) {
        // Caso ocorra um erro durante a execução, retorna um erro 500
        console.error("Algo deu errado ao buscar artigo, tente novamente: ", error);
        return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    } finally {
        // Fecha a conexão com o banco de dados, se foi estabelecida
        if (executeConnection) {
            await executeConnection.end();
        };
    };
};