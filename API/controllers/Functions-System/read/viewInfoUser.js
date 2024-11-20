import connection from '../../../data/connection.js'; //conexão com o banco de dados

const viewInfoUser =
async (req, res) =>{
const userID = req.user.id  //variáveis responsáveis por armazenar os dados

 //realiza a conexão com o banco de dados
 const executeConnection = await connection.getConnection();
  try{
    
    const query             = `SELECT * FROM viewallemails WHERE pk_IDuser=?;`;
    const values            = userID 
    //executa a query
    const [results] = await executeConnection.query(query, values);
    results;
   
    //retorna as iformações do usuário
    return res.status(200).json(results);
  }catch(error){
    console.error("Algo deu errado ao pegar os dados do usuário, tente novamente: ", error);
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  }finally {
      // Fecha a conexão com o banco de dados, se foi estabelecida
      if (executeConnection) {
          await executeConnection.end();
      };
  };
}; 

export default viewInfoUser;