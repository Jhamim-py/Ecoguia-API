const conectar       =  require('../data/conexao');
exports.getPerfil =
 async (req,res) => {
    const connection = conectar.getConnection();
    const userId = req.user.id;
    const sql = `CALL ViewProfile(?)`
    const value = userId
    const Profile = {};
    connection.query(sql,value, async function(erro,result){
        if(erro){
            console.log(erro)
            return res.status(500).json({msg: "Erro ao tentar visualizar o perfil"})
        }
        if(result){
            Profile=res.status(200).json(result)
        }
    })
    //Ver Histórico
    const sql2 = `CALL ViewHistoric(?)`
    connection.query(sql,value, async function(erro,result){
        if(erro){
            console.log(erro)
            return res.status(500).json({msg: "Erro ao tentar visualizar o perfil"})
        }
        if(result){
            return res.status(200).json(Profile + result)
        }
 })
    connection.end();

} 