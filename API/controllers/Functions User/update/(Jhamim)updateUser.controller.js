// preciso que o Jhamim comente e arrume esse arquivo...
const validator      = require('email-validator');
const conectar       = require('../../../data/connection');
const bcrypt         = require('bcrypt');
const meuCache       = require('../../utils/cache')
const mandarEmail    = require('../utils/email')
const crypto         = require('crypto')
const verificarSenha = require('../utils/VerificarSenha')
exports.updateUser =
    async (req,res) => {
    const userId = req.user.id;
    let {email,senha} = req.body;
    const connection = conectar.getConnection();
    const verificacao = verificarSenha(senha)
    if(verificacao[0] == false){
        return res.status(400).json({erro: verificacao[1]})
    }

    if (!validator.validate(email) & email == "") {
       email = null;
    }
    else if(!validator.validate(email)){ 
        return res.status(400).json({message: "Email invalido"})
    }
    else{
        meuCache.set("email",email);
        meuCache.set("senha",senha);
        const tokenForget = crypto.randomBytes(10).toString("hex");
        const mensagem =`Utilize o token para a sua validação de troca de email :)\n
        token: ${tokenForget}`;
        mandarEmail(mensagem);
        return res.status(200).json({message:"confirme seu email com o token para efetuar a atualização!"})
    }
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
   }