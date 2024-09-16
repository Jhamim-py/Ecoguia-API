const connection = require('../../../data/connection')//conexão com o banco de dados

exports.ViewArticles =
async (req,res) =>{

    //realiza a conexão com o banco de dados
    const executeConnection = connection.getConnection();
    const sql= `SELECT * FROM ViewAllArticle LIMIT 3`;
    
    //executa a query
    executeConnection.query(sql,function (erro,result){
            if (erro) {
                console.log(erro);
                return res.status(500).json({ msg: "Erro ao adicionar o artigo"})
            }
            //retorna a lista de artigos
          return res.status(200).json(result)
        })
        //Fecha a conexão com o banco de dados
        executeConnection.end();
  }