import getConnection  from '../../../data/connection.js';  //conexão com o banco de dados

const getRanking =
async (req, res) =>{
const userID = req.user.id  //variáveis responsáveis por armazenar os dados
 
  try{
    // Pega uma conexão
    const connection = await getConnection();
     
    const query             = `CALL SelectRanking(?);`;
    const values            = userID 
    //executa a query
    const [results] = await connection.query(query, values);
    results;
   
    //retorna o array em ordem decrescente com base no XP
    return res.status(200).json(results[0]);
  }catch(error){
    console.error("Algo deu errado ao criar ranking, tente novamente: ", error);
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  };
}; 

export default getRanking;