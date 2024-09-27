const c = require('config');
const connection = require('../../../data/connection')//conexão com o banco de dados

exports.viewArticles =
async (req,res) =>{

    //realiza a conexão com o banco de dados
    const executeConnection =  await connection.getConnection();
    try{
    const query= `SELECT * FROM ViewAllArticle LIMIT 3;`;
    const [results] = await executeConnection.execute(query);

    if(results == 0){
      return res.status(404).json({message: "Nenhum artigo encontrado"});
    }
    return res.status(200).json(results);
    
      }
      catch(error){
        console.error("Algo deu errado ao buscar os artigos,tente novamente", error);
        return res.status(500).json({msg: "Algo deu errado na conexão com o servidor, tente novamente."});
      }
      finally{
        if(executeConnection){
          //Fecha a conexão com o banco de dados
          await executeConnection.end();
        }
      }
        
  }