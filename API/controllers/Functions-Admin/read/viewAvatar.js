const connection = require('../../../data/connection') //conexão com o banco de dados


exports.viewAvatar =
async function (res) {
    const executeConnection = await connection.getConnection();
    const query = "SELECT * FROM ViewAllAvatar"
    const result = await executeConnection.query(query)
    if(result <= 0){
        return res.status(400).json({message: "Erro ao buscar avatar"})
    }
    executeConnection.end()
    return res.status(200).json(result)
   
}