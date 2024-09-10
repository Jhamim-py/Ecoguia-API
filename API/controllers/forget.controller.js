const conectar       =  require('../data/conexao')
const mandarEmail       =  require('../utils/email')
const crypto         =  require('crypto')
const meuCache       =  require('../utils/cache')
require('dotenv').config();
exports.getForget =
async (req,res)  => {
   
    const connection = conectar.getConnection();
    const {email} = req.body;
    try{
        const sql = `SELECT * FROM tbl_user WHERE email_user=?`;
        const value = email;
        connection.query(sql,value, async function(erro,result){
            if (erro) {
                console.log(erro);
                return res.status(500).json({ msg: "Erro ao verificar se o usuário existe"})
            }
            if (result.length == 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" })
            };
         });
     }
    catch(erro){
        return res.status(500).json({msg: "Erro ao tentar recuperar a senha",erro}) 
    }


   const tokenForget = crypto.randomBytes(10).toString("hex");
   meuCache.set(tokenForget,true); 

   console.log(meuCache.get(tokenForget))

   const mensagem = `Copie o token abaixo para recuperar sua senha em até 30 minutos | seu esquecido >:(\n
        Token: ${tokenForget}`
    
    mandarEmail(mensagem)

    connection.end()
    
}

