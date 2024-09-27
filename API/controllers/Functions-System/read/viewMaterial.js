const connection = require('../../../data/connection') //conexão com o banco de dados


exports.viewMaterial =
async function (req,res) {
    const executeConnection = await connection.getConnection();
  
    try{
        const query = "SELECT * FROM ViewAllMaterial"
        const result = await executeConnection.query(query)
        if(result <= 0){
            return res.status(400).json({message: "Erro ao buscar avatar"})
        }
        return res.status(200).json(result)
        }catch(erro){
            console.log(erro)
        }
        finally {
            // Fecha a conexão com o banco de dados, se foi estabelecida
            if (executeConnection) {
                await executeConnection.end();
            };
        };
}