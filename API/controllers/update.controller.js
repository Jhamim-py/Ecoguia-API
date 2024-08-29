
const conectar       = require('../data/conexao')
exports.update =
    async (req,res) => {
    const userId = req.user.id;
    const{nome,sobrenome,email,avatar} = req.body;
    const connection = conectar.getConnection();
   
    try{
       const sql = `CALL ModifyUser(?,?,?,?,?)`
       const values =[userId,nome,sobrenome,email,avatar]
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