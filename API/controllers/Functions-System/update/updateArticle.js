const connection = require('../../../data/connection')        //conexão com o banco de dados
const checkArticle = require('../../../utils/checkArticle') //verifica se o artigo adicionado já existe no banco de dados
const valorNulo = require('../../../utils/nullValue')       //verifica se a variável possui valor nulo 
const checkLenght = require('../../../utils/characterLimit')//verifica se o dado ultrapassa o limite de caracteres

exports.updateArticle =
async(req,res) =>{
    let{id,image,title,category,description,reference} = req.body; //variáveis responsáveis por armazenar os dados
  
    //executa a conexão com o banco de dados
    const executeConnection = connection.getConnection();
  

   //verifica se as variáveis possuem algum valor
    id = valorNulo(id)
    image = valorNulo(image)
    title = valorNulo(title)
    category = valorNulo(category)
    description = valorNulo(description)
    reference = valorNulo(reference)
    console.log(id)
     //verifica se os dados ultrapassam 2048
    if(checkLenght(image) == false || checkLenght(description) == false || checkLenght(reference)){
      return res.status(400).json({message: "O campo não pode exceder 2048 caracteres"})
    }
    //verifica se o artigo já existe no banco de dados
    if(checkArticle(title) ==  false){
      console.log("Artigo já existente no banco de dados")
      return res.status(400).json({message: "O artigo já existe no banco de dados"}) 
     }
  
  const sql = 'CALL  ModifyArticle(?,?,?,?,?,?)'
  const values = [id,image,title,category,description,reference]
  try{
    //executa a query
    executeConnection.query(sql,values,function(erro,result){
      if (erro) {
        console.log(erro);
      }
      if(result){
        return res.status(200).json({ msg: "Artigo atualizado com sucesso" })
      }
    })
  }
  catch(erro){
      console.log(erro)
  }
  //fecha a conexão com o banco de dados
   executeConnection.end();
  }