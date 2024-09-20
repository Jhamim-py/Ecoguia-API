const { captureRejectionSymbol } = require('node-cache');
const connection = require('../data/connection');    // conexão com o banco de dados

//função para checar se o artigo existe (?)
module.exports =
function checkArticle(title){
    //executa a conexão com o banco de dados
    const executeConnection = connection.getConnection();

    try{
        // armazena a query que chama a view que retorna somente o ID, nickname e e-mail
        const query = "SELECT * FROM ViewAllArticle WHERE title_article=?;";
        const value = title;
        
        //executa a query
        executeConnection.query(query, value, (err, results) => {
            if (err) {
                //caso ocorra erro ao executar a query, retorna o erro no console
                console.log(err);
            }else if(results > 0){
                return false;
            }else{
                return true;
            };
        });
    }catch(error){
        console.error("Algo deu errado ao realizar o login, tente novamente: ", error);
        res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
    }

    executeConnection.end();        //fecha a conexão com banco de dados
};