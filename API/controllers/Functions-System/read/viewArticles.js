const connection = require('../../../data/connection')//conexão com o banco de dados

exports.viewArticles =
async (res) => {
  //realiza a conexão com o banco de dados
  const executeConnection = await connection.getConnection();

  try{
    const query= `SELECT * FROM ViewAllArticle LIMIT 3`;

    // envio de query para o banco de dados e retorna o resultado
    const [results] = executeConnection.query(query, values);
    if (results > 0) {
      return res.status(200).json(results);
    };
  }catch(error){
    console.error("Algo deu errado ao visualizar os artigos, tente novamente: ", error);
    return res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  
  }finally {
    // Fecha a conexão com o banco de dados, se foi estabelecida
    if (executeConnection) {
        await executeConnection.end();
    };
  };
};