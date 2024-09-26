const connection = require('../../../data/connection') //conexão com o banco de dados

exports.deleteArticle =
 async(req,res) => {
   
    const {id,title} = req.body  //variáveis responsáveis por armazenar os dados
    const query = `CALL DeleteArticle(?,?);`
    const value = [id,title]
    console.log(id)
    //executa a conexão com o banco de dados
    const connection = executeConnection.getConnection();
    try{
    //executa a query
    executeConnection.query(query,value,function(erro,result){
      if (erro) {
        console.log(erro);
      }
      if(result){
        return res.status(200).json({ msg: "Artigo deletado com sucesso" })
      }
    }) 
  }catch(erro){
    console.log(erro);
   }
  //fecha a conexão com o banco de dados
   executeConnection.end();
  }