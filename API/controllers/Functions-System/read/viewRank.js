const connection = require('../../../data/connection') //conexão com o banco de dados

exports.viewRank =
async (req,res) =>{

  
 let createRank = {}
    //realiza a conexão com o banco de dados
    const executeConnection = connection.getConnection();
    const query= `SELECT * FROM viewallnicknames LIMIT 3 ;`;
    
    //executa a query
    executeConnection.query(query,function (erro,result){
            if (erro) {
                console.log(erro);
                return res.status(500).json({ msg: "Erro ao pegar o rank"})
            }
            
            //armazena o resultado da query
            createRank = result
            //retorna o resultado da query em orde decrescente 
            createRank.sort(function(a,b){
              if(a.XP_user < a.XP_user) return -1;
              if(a.XP_user > b.XP_user) return 1;
              return 0;
            })
            console.log(createRank);
            //retorna o array em ordem decrescente com base no XP
            return createRank;
        })
        //Fecha a conexão com o banco de dados
        executeConnection.end();
  }