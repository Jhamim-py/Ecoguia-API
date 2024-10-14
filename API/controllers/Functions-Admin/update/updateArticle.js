const connection    = require('../../../data/connection');       //conexão com o banco de dados
const nullValue     = require('../../../utils/nullValue');       //verifica se a variável possui valor nulo 
const checkLength   = require('../../../utils/characterLimit');  //verifica se o dado ultrapassa o limite de caracteres

exports.updateArticle =
async(req, res) =>{

  //variáveis responsáveis por armazenar os dados
  let{id, image, title, category, description, reference} = req.body; 

  //executa a conexão com o banco de dados
  const executeConnection = connection.getConnection();

  //verifica se as variáveis possuem algum valor
  id          = nullValue(id);
  image       = nullValue(image);
  title       = nullValue(title);
  category    = nullValue(category);
  description = nullValue(description);
  reference   = nullValue(reference);

  if (checkLength(image) == false || checkLength(description) == false || checkLength(reference) == false){
    //verifica se os dados ultrapassam 2048
    return res.status(400).json({msg: "Os campos não devem exceder 2048 caracteres."});

  };
  
  try{
    const query = 'CALL  ModifyArticle(?, ?, ?, ?, ?, ?);';
    const values = [id, image, title, category, description, reference];
  
    //executa a query
    const [results] = await executeConnection.query(query, values);
    if (results > 0){
      return res.status(200).json({ msg: "Artigo atualizado com sucesso." });
    }else{
      return res.status(404).json({ msg: "Algo deu errado ao modificar o artigo no banco de dados, tente novamente." });
    };
  } catch(erro){
    console.log(erro); //verificação
    res.status(500).json({ msg: "Algo deu errado na conexão com o servidor, tente novamente." });
  } finally {
    // Fecha a conexão com o banco de dados, se foi estabelecida
    if (executeConnection) {
        await executeConnection.end();
    };
  };
};