const connection = require('../../../data/connection') //conexão com o banco de dados

exports.selectArticle =
    async(req,res) => {
    
    const {id} = req.body;  //variáveis responsáveis por armazenar os dados

    const query = "CALL SelectIDArticle(?)"
    const value = [id] 
    //executa a conexão com o banco de dados
    const executeConnection = connection.getConnection();
    //executa a query
    executeConnection.query(query,value, function (erro,result){
        if(erro){
            console.log(erro)
        }
        if(result){
            res.json(result)
        }
    })
    //fecha a conexão com o banco de dados
     executeConnection.end();
    }
