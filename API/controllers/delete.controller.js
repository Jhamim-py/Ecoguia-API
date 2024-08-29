const conectar       =  require('../data/conexao')
const bcrypt         =  require('bcrypt')
exports.delete = 

  async (req, res) => {
    
    const userId = req.user.id;
    const {senha} =  req.body
    const sql = `SELECT * FROM tbl_user WHERE pk_IDuser=?`
    const value = userId

    const connection = conectar.getConnection();
    connection.query(sql,value, async function(erro,result){
        if (erro) {
            console.log(erro);
            return res.status(500).json({ msg: "Erro ao verificar se o usuário existe"})
        }
        if (result.length == 0) {
            return res.status(404).json({ msg: "Usuário não encontrado" })
        }

       const user = result[0]
       const checkPassword = await bcrypt.compare(senha, user.password_user);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }

    const senhaReal = user.password_user


    const sql2 = "CALL DeleteUser(?,?)"
    const values2 = [userId,senhaReal]
    connection.query(sql2,values2,function(erro,result){
        if (erro) {
            console.log(erro);
            return res.status(500).json({ msg: "Erro ao deletar usuário" });
        }
        if(result){
            return res.status(200).json({ msg: "Usuário deletado com sucesso!" })
        }
    });
    connection.end();
})
}
