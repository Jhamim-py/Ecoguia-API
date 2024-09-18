// preciso que o Jhamim comente e arrume esse arquivo...
const connection     =  require('../../../data/connection');  // conexão com o banco de dados
const bcrypt         =  require('bcrypt');                   // criptografa dados em hash
const appCache       =  require('../../../utils/cache');         // armazena os dados de usuário, usado posteriormente para validações


exports.updateEmail =

 async (req,res) => {
    
   
    // variáveis responsáveis por armazenar os dados
    const {token} = req.body;
    const userId = req.user.id;
    const email = appCache.take("endereco");
    const senha  = appCache.take("senha");
    console.log("email:",email)
    console.log("senha:" ,senha)
    console.log("ID: ",userId)

    //verifica se o token é válido
    if (!appCache.get(token)) {
        console.log(appCache.get(token));  //verificação
        return res.status(400).json({ msg: "Token inválido ou expirado" });
    }
const executeConnection = connection.getConnection(); // variável que armazena a execução de conexão com o banco de dados

  // criptografa a senha dada em hash
  const salt = await bcrypt.genSalt(12); // define o tamanho do hash (12 caracteres)
  const passwordHash = await bcrypt.hash(senha, salt); // cria o hash da senha

  try{
     // executa a query de atualização da senha e do email no banco de dados
    const sql = `CALL ModifyUser(?,?,?)`
    const values =[userId,email,passwordHash]
    executeConnection.query(sql,values, async function(erro,result){
        if(erro){
            console.log(erro) //verificação
            return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
        }
        if(result){
            return res.status(200).json({msg: "Usuário atualizado com sucesso"})
        }
    })
    
 }
 catch(erro){
    return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
 }
 executeConnection.end(); //fecha a conexão com banco de dados
 appCache.flushAll(); // comando que reseta o cachê do app

 }