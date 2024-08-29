const conectar       =  require('../data/conexao');
const bcrypt         =  require('bcrypt');
const jwt            =  require('jsonwebtoken');
require('dotenv').config();

exports.postLogin =
async (req, res) => {
    const { email, senha } = req.body;
    const connection = conectar.getConnection();
    // Validação
    if (!email || !senha) {
        return res.status(422).json({ msg: "É obrigatório preencher todos os dados para o login" });
    }

    try {
        // Checar se existe
        const sql = `SELECT * FROM tbl_user WHERE email_user=? `
        const values = [email]
        connection.query(sql,values, async function (erro,result){
            if (erro) {
                console.log(erro);
                return res.status(500).json({ msg: "Erro ao verificar usuário" });
            }
            if(result.length == 0){
                return res.status(404).json({ msg: "Usuário não encontrado" })
            }
        

        const user = result[0];

        const checkPassword = await bcrypt.compare(senha, user.password_user);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }

        // Gerar token
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user.pk_IDuser }, secret);

        res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
    })
    } catch (erro) {
        console.error("Erro ao tentar fazer login:", erro);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" });
    }
    connection.end();
}