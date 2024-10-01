// importação do arquivo de configuração .env
require('dotenv').config();

//componentes do node 
const connection        = require('../../../data/connection');       //conexão com o banco de dados
const checkLength       = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres
const checkArticle      = require('../../../utils/checkArticle');    //verifica se o artigo adicionado já existe no banco de dados

exports.createArticle   =
async (req, res) => {

  const {title, category, description, image, reference} = req.body;
    
  if(title == "" || title == null){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }
  if(category == "" || category == null){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }
  if(description == "" || description == null){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }
  if(image == "" || image == null){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }
  if(reference == "" || reference == null){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }
  //executa a conexão com o banco de dados
  const executeConnection = await connection.getConnection();
  if(!title || !category || !description || !image || !reference){
      return res.status(400).json({message: "Preencha todos os campos!"});
  }

  try{
    if (!checkLength(image) | !checkLength(description)|| !checkLength(reference)){
    //se ultrapassar, não adiciona no banco de dados e passa para próxima interação
      return res.status(400).json({message: "Os campos não devem ultrapassar 2048 caracteres"});

    }else if (!await checkArticle(title, reference)){
    //verifica se o artigo já existe no banco de dados
      console.log("Artigo já existente no banco de dados");
      return res.status(400).json({msg: "O artigo já existe no banco de dados"});
    };
  
    const query = `CALL CreateArticle(?, ?, ?, ?, ?);`;
    const value = [image, title, category, description, reference];

    const [result] = await executeConnection.query(query, value);
    result;

    return res.status(200).json({msg:"Artigo criado com sucesso"});
  }catch(error){
    console.error("Algo deu errado ao buscar os artigos,tente novamente", error);
    return res.status(500).json({msg: "Algo deu errado na conexão com o servidor, tente novamente."});
  }
  finally{
    if(executeConnection){
      //Fecha a conexão com o banco de dados
      await executeConnection.end();
    }
  };
}; 