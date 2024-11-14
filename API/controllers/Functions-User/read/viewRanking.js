const connection = require('../../../data/connection'); //conexão com o banco de dados

exports.getRanking =
async (req, res) =>{
const userID = req.user.id  //variáveis responsáveis por armazenar os dados
 const executeConnection = await connection.getConnection();
  try{
    //realiza a conexão com o banco de dados
    
    const query             = `CALL SelectRanking(?);`;
    const values            = userID 
    //executa a query
    const [results] = await executeConnection.query(query, values);
    results;
   
    //retorna o array em ordem decrescente com base no XP
    return res.status(200).json(results[0]);
  }catch(error){
    console.error("Algo deu errado ao criar ranking, tente novamente: ", error);
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  }finally {
      // Fecha a conexão com o banco de dados, se foi estabelecida
      if (executeConnection) {
          await executeConnection.end();
      };
  };
}; 
