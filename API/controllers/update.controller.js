const conectar       = require('../data/conexao')
exports.update =
    async (req,res) => {
    const userId = req.user.id;
    let {nome,sobrenome,avatar} = req.body;
    const connection = conectar.getConnection();

   if(nome == ''){
    nome = null;
   }
   if(sobrenome == ''){
    sobrenome = null;
   }
   if(avatar == ''){
    avatar = null;
   }
   
    try{
       const sql = `CALL ModifyProfile(?,?,?,?)`
       const values =[userId,nome,sobrenome,avatar]
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
   }