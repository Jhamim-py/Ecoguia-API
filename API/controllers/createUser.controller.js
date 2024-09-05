const conectar       = require('../data/conexao');
const gerarNick      = require('../utils/gerarNick')
const bcrypt         = require('bcrypt')
const meuCache       = require('../utils/cache');


exports.CreateUser =
async (req, res) => {
   const {token} = req.body
   const connection = conectar.getConnection();

   if(!meuCache.get(token)){
    console.log(meuCache.get(token))
    return   res.status(400).json({msg: "Token inválido ou expirado"}) 
  }

   const nome =  meuCache.take("nome")
   console.log(nome)
   const email = meuCache.take("email")
   console.log(email)
   const senha = meuCache.take("senha")
   console.log(senha)
   const sobrenome = meuCache.take("sobrenome")
   console.log(sobrenome)

 // Criar senha
 const salt = await bcrypt.genSalt(12);
 const passwordHash = await bcrypt.hash(senha, salt);
 const nameNick = gerarNick(nome, sobrenome)

const sql2 = `CALL CreateUser(?,?,?,?,?,?)`;
const values = [nome,sobrenome,email,passwordHash,nameNick,1]
connection.query(sql2,values,function(erro,result){
        if (erro) {
            console.log(erro);
            return res.status(500).json({ msg: "Erro ao criar usuário" });
        }
        if(result){
            return res.status(201).json({ msg: "Usuário criado com sucesso!" })
        }
    }) 
    connection.end();
    meuCache.flushAll();

}