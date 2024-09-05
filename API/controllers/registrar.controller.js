const conectar       = require('../data/conexao');
const validator      = require('email-validator');
const meuCache       = require('../utils/cache')
const mandarEmail    = require('../utils/email')
const crypto         =  require('crypto')
const verificarSenha = require('../utils/VerificarSenha')
exports.postRegistro =
async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;
    const connection = conectar.getConnection();
    meuCache.flushAll();

    // Validações
    if (!nome || !sobrenome || !email || !senha) {
        return res.status(422).json({ msg: "É obrigatório preencher todos os dados para o login" });
    }

    if (!validator.validate(email)) {
        return res.status(422).json({ msg: "Email inválido" });
    }

 
    // Checar se já existe o usuário
const sql= `SELECT * FROM tbl_user WHERE email_user=?`;
const value = email
connection.query(sql,value,function (erro,result){
        if (erro) {
            console.log(erro);
            return res.status(500).json({ msg: "Erro ao verificar se o usuário existe"})
        }
        if (result.length > 0) {
            return res.status(422).json({ msg: "Já existe um usuário com esse email"})
        }
    })
    const verificacao = verificarSenha(senha)
    if(verificacao[0] == false){
        return res.status(400).json({erro: verificacao[1]})
    }

    const tokenForget = crypto.randomBytes(10).toString("hex");
    meuCache.set(tokenForget,true); 
    meuCache.set("nome",nome);
    meuCache.set("sobrenome",sobrenome);
    meuCache.set("email",email);
    meuCache.set("senha", senha);

    const mensagem = `Copie o token abaixo para verificar seu email em até 30 minutos | rápido >:(\n
        Token: ${tokenForget}`
    mandarEmail(mensagem);
    
    connection.end()

}

