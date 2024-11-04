const connection = require('../../../data/connection'); //conexão com o banco de dados

exports.viewRank =
async (req, res) =>{
  let createRank = {}; //array que armazena os rankings
 const executeConnection = await connection.getConnection();
  try{
    //realiza a conexão com o banco de dados
    
    const query             = `SELECT * FROM ViewAllNicknames ORDER BY XP_user DESC LIMIT 3 ;`;

    //executa a query
    const [results] = await executeConnection.query(query);
    if (results != 0){
      //armazena o resultado da query
      createRank = results;

      //retorna o resultado da query em ordem decrescente 
      createRank.sort(function(a, b){
        if (a.XP_user < a.XP_user) return -1;
        if (a.XP_user > b.XP_user) return 1;

        return 0;
      });

      //retorna o array em ordem decrescente com base no XP
      return res.status(200).json(createRank);

    }else{
      return res.status(500).json({ msg: "Erro ao puxar os dados do ranking."});    
    };
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