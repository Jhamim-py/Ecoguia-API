const conectar       = require('../data/conexao');
const bcrypt         = require('bcrypt');
const meuCache       = require('../utils/cache');
const verificarSenha = require('../utils/VerificarSenha');
exports.password =   
async (req,res) => {
    const userId = req.user.id;
    const {token, senha} = req.body;
    const connection = conectar.getConnection();
    const email = null;
    console.log(token)
    console.log(senha)
    const verificacao = verificarSenha(senha)
    if(verificacao[0] == false){
        return res.status(400).json({erro: verificacao[1]})
    }

    console.log(meuCache.get(token))

    if(!meuCache.get(token)){
      return   res.status(400).json({msg: "Token inválido ou expirado"}) 
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);
    try{
        const sql = `CALL ModifyUser(?,?,?)`
        const values =[userId,email,passwordHash]
        connection.query(sql,values, async function(erro,result){
            if(erro){
                console.log(erro)
                return res.status(500).json({msg: "Erro ao tentar atualizar a senha",erro})
            }
            else if(result){
                return res.status(200).json({msg: "Senha atualizada com sucesso"})
            }
        })
        
     }
     catch(erro){
        return res.status(500).json({msg: "Erro ao tentar atualizar o usuário"})
     }
     connection.end();
     meuCache.flushAll();
    }
    
