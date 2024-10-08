const executeConnection = require('../../../data/connection'); //conexão com o banco de dados

exports.deleteArticle =
async(req, res) => {
  //variáveis responsáveis por armazenar os dados
  const {id,title} = req.body;
  
  console.log(id);  //verificação
  
  //executa a conexão com o banco de dados
  const connection = await executeConnection.getConnection();
  
  try{
    const query = `CALL DeleteArticle(?, ?);`;
    const values = [id, title];

    //executa a query
    const [results] = await connection.query(query, values);
    results;
    if (results.length != 0){
      return res.status(200).json({ msg: "Artigo deletado com sucesso." });
    }else{
      return res.status(404).json({ msg: "Algo deu errado ao deletar o artigo no banco de dados, tente novamente." });
    };
  } catch(erro){
    console.log(erro); //verificação
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  } finally {
    // Fecha a conexão com o banco de dados, se foi estabelecida
    if (connection) {
      await executeConnection.end();
    };
  };
};