const conectar       =  require('../data/conexao');
const bcrypt         =  require('bcrypt');
const meuCache       = require('../utils/cache')

exports.updateEmail =

 async (req,res) => {

    const userId = req.user.id;
    const email  = meuCache.take("email");
    const senha  = meuCache.take("senha");

 
  const connection = conectar.getConnection();

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(senha, salt);

  try{
    const sql = `CALL ModifyUser(?,?,?)`
    const values =[userId,email,passwordHash]
    connection.query(sql,values, async function(erro,result){
        if(erro){
            console.log(erro)
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
 connection.end();
 meuCache.flushAll();

 }