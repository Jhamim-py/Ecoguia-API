const conectar       = require('../data/conexao');
const validator      = require('email-validator');
const gerarNick      = require('../utils/gerarNick')
const bcrypt         = require('bcrypt')
exports.postRegistro =
async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;
    const connection = conectar.getConnection();

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

    // Criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    // Criar Nick
    const nameNick = gerarNick(nome);

    // Criar usuário

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
}

