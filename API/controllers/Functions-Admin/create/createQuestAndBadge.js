const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLength       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
const generateBadge     = require('../../../utils/generateBadge');   //importa a função de incrementar badges

exports.createQuestAndBadge   =
async (req, res) => {

  const {blobUrl, blobTitle, blobDescription, questDescription1, xpQuest1, questDescription2, xpQuest2, questDescription3, xpQuest3} = req.body;
     
  //executa a conexão com o banco de dados
  const executeConnection = await connection.getConnection();
  if(!blobUrl || !blobDescription || !blobTitle || !questDescription1 || !xpQuest1 || !questDescription2 || !xpQuest2 || !questDescription3 || !xpQuest3 ){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }

  try{
    if (!checkLength(blobUrl) || !checkLength(questDescription1) || !checkLength(questDescription2)){
    //se ultrapassar, não adiciona no banco de dados e passa para próxima interação
      return res.status(400).json({message: "Os campos não devem ultrapassar 2048 caracteres"});
    };

     // Validação para verificar se os dados já existem
     const existingQuery = `SELECT COUNT(*) AS count FROM tbl_badge WHERE title_badge = ?`;
     const [existingRows] = await executeConnection.query(existingQuery, [blobTitle]);

     if (existingRows[0].count > 0) {
         return res.status(409).json({ message: "Quest com o mesmo título já existe." });
     }

    const badgeId = generateBadge();
  
    const query = `CALL CreateQuestAndBadge(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const value = [blobUrl, blobTitle, blobDescription, questDescription1, xpQuest1, questDescription2, xpQuest2, questDescription3, xpQuest3, badgeId];

    const [result] = await executeConnection.query(query, value);
    result;

    return res.status(200).json({msg:"Quest criada com sucesso"});
  }catch(error){
    console.error("Algo deu errado ao criar as quests, tente novamente", error);
    return res.status(500).json({msg: "Algo deu errado na conexão com o servidor, tente novamente."});
  }
  finally{
    if(executeConnection){
      //Fecha a conexão com o banco de dados
      await executeConnection.end();
    }
  };
}; 

